import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Plus, Trash2, Edit2, Save, Image as ImageIcon } from 'lucide-react';
import { db, storage } from '../firebase';
import { collection, getDocs, getDoc, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Product } from '../types';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'settings'>('orders');
  
  // Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);

  // Settings State
  const [settings, setSettings] = useState({
    heroTitle: 'BORN TO SHINE',
    heroSubtitle: 'Astro Clothing. Premium streetwear for the urban explorer.',
    aboutText: 'ASTRO is more than a clothing brand. It\'s a movement. Born in the streets, designed for the stars.'
  });

  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
      fetchOrders();
      fetchSettings();
    }
  }, [isOpen]);

  const fetchProducts = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'products'));
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(prods);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'orders'));
      const ords = snapshot.docs.map(doc => ({ ...doc.data(), docId: doc.id } as any));
      // Sort by date descending
      ords.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(ords);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchSettings = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'settings'));
      const mainSettings = snapshot.docs.find(doc => doc.id === 'main');
      if (mainSettings) {
        setSettings(mainSettings.data() as any);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = (type: 'main' | 'additional') => async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !editingProduct) return;
    
    const file = e.target.files[0];
    setUploadingImage(true);
    
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          
          if (type === 'main') {
            setEditingProduct({
              ...editingProduct,
              image: dataUrl
            });
          } else {
            setEditingProduct({
              ...editingProduct,
              additionalImages: [...(editingProduct.additionalImages || []), dataUrl]
            });
          }
          setUploadingImage(false);
        };
        img.onerror = () => {
          console.error("Error loading image");
          setUploadingImage(false);
        };
      };
      reader.onerror = () => {
        console.error("Error reading file");
        setUploadingImage(false);
      };
    } catch (error) {
      console.error("Error processing image:", error);
      setUploadingImage(false);
    }
  };

  const handleSaveProduct = async () => {
    if (!editingProduct) return;
    if (!editingProduct.name || !editingProduct.category) {
      showNotification("Name and Category are required.", "error");
      return;
    }
    try {
      const prodId = editingProduct.id || Math.random().toString(36).substring(2, 9);
      const productToSave: any = {
        ...editingProduct,
        id: prodId,
        description: editingProduct.description || '',
        sizes: editingProduct.sizes || [],
        colors: editingProduct.colors || []
      };
      
      if (!productToSave.backImage) {
        delete productToSave.backImage;
      }
      
      await setDoc(doc(db, 'products', prodId), productToSave);
      setEditingProduct(null);
      fetchProducts();
      showNotification("Produto guardado com sucesso!", "success");
    } catch (error: any) {
      console.error("Error saving product:", error);
      showNotification("Erro ao guardar o produto. Verifique a consola para mais detalhes.", "error");
      try {
        handleFirestoreError(error, OperationType.WRITE, 'products');
      } catch (e) {}
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', id));
        fetchProducts();
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'products');
      }
    }
  };

  const handleSaveSettings = async () => {
    try {
      await setDoc(doc(db, 'settings', 'main'), settings);
      showNotification('Definições guardadas com sucesso!', 'success');
    } catch (error: any) {
      console.error("Error saving settings:", error);
      showNotification("Erro ao guardar definições.", "error");
      try {
        handleFirestoreError(error, OperationType.WRITE, 'settings');
      } catch (e) {}
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      const orderSnap = await getDoc(orderRef);
      
      if (orderSnap.exists()) {
        const orderData = orderSnap.data();
        const previousStatus = orderData.status;
        
        await updateDoc(orderRef, { status });
        
        // Handle loyalty card stars (purchasesCount)
        if (status === 'completed' && previousStatus !== 'completed') {
          if (orderData.userId && orderData.userId !== 'anonymous') {
            const userRef = doc(db, 'users', orderData.userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              const currentPurchases = userSnap.data().purchasesCount || 0;
              await updateDoc(userRef, { purchasesCount: currentPurchases + 1 });
            }
          }
        } else if (previousStatus === 'completed' && status !== 'completed') {
          if (orderData.userId && orderData.userId !== 'anonymous') {
            const userRef = doc(db, 'users', orderData.userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              const currentPurchases = userSnap.data().purchasesCount || 0;
              await updateDoc(userRef, { purchasesCount: Math.max(0, currentPurchases - 1) });
            }
          }
        }
      }

      fetchOrders();
      showNotification(`Estado da encomenda atualizado para ${status}`, 'success');
    } catch (error: any) {
      console.error("Error updating order:", error);
      showNotification("Erro ao atualizar o estado da encomenda.", "error");
      try {
        handleFirestoreError(error, OperationType.UPDATE, 'orders');
      } catch (e) {}
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-white dark:bg-black overflow-y-auto">
      {notification && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[300] px-6 py-3 rounded shadow-lg text-sm font-bold uppercase tracking-widest ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-display font-bold uppercase tracking-tighter">Admin Dashboard</h1>
          <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full">
            <X size={32} />
          </button>
        </div>

        <div className="flex gap-8 mb-12 border-b border-black/10 dark:border-white/10">
          {['orders', 'products', 'settings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-4 text-sm uppercase tracking-widest font-bold transition-colors ${
                activeTab === tab 
                  ? 'border-b-2 border-black dark:border-white text-black dark:text-white' 
                  : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-2xl font-display font-bold">Contabilidade / Encomendas</h2>
              <div className="flex gap-4 text-sm font-mono">
                <div className="px-4 py-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                  <span className="opacity-50 block text-[10px] uppercase tracking-widest">Total Orders</span>
                  <span className="font-bold text-lg">{orders.length}</span>
                </div>
                <div className="px-4 py-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                  <span className="opacity-50 block text-[10px] uppercase tracking-widest">Completed Revenue</span>
                  <span className="font-bold text-lg">{orders.reduce((acc: number, order: any) => order.status === 'completed' ? acc + order.total : acc, 0).toFixed(2)} MZN</span>
                </div>
              </div>
            </div>
            <div className="grid gap-6">
              {orders.map(order => (
                <div key={order.id} className="p-6 border border-black/10 dark:border-white/10 flex flex-col md:flex-row justify-between gap-6">
                  <div>
                    <p className="font-bold mb-2">Order #{order.id}</p>
                    <p className="text-sm opacity-70 mb-1">Date: {new Date(order.createdAt).toLocaleString()}</p>
                    <p className="text-sm opacity-70 mb-4">Total: {order.total} MZN</p>
                    <div className="text-xs space-y-1">
                      {JSON.parse(order.items).map((item: any, idx: number) => (
                        <p key={idx}>- {item.quantity}x {item.name} ({item.selectedSize} / {item.selectedColor})</p>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <select 
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order.docId, e.target.value)}
                      className="p-2 bg-transparent border border-black/20 dark:border-white/20 text-sm uppercase tracking-widest [&>option]:bg-white [&>option]:text-black dark:[&>option]:bg-black dark:[&>option]:text-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
              {orders.length === 0 && <p className="opacity-50">No orders yet.</p>}
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold">Produtos</h2>
              <button 
                onClick={() => setEditingProduct({ id: '', name: '', price: 0, category: 'T-Shirts', image: '', description: '', sizes: ['S', 'M', 'L'], colors: ['Preto', 'Branco'] })}
                className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-xs uppercase tracking-widest font-bold"
              >
                <Plus size={16} /> Add Product
              </button>
            </div>

            {editingProduct ? (
              <div className="p-6 border border-black/10 dark:border-white/10 mb-8 space-y-6">
                <h3 className="text-lg font-bold uppercase tracking-widest">{editingProduct.id ? 'Edit Product' : 'New Product'}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2">Name</label>
                    <input 
                      type="text" 
                      value={editingProduct.name}
                      onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                      className="w-full p-3 bg-transparent border border-black/20 dark:border-white/20 text-black dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2">Price (MZN)</label>
                    <input 
                      type="number" 
                      value={editingProduct.price}
                      onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                      className="w-full p-3 bg-transparent border border-black/20 dark:border-white/20 text-black dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2">Category</label>
                    <select 
                      value={editingProduct.category}
                      onChange={e => setEditingProduct({...editingProduct, category: e.target.value as any})}
                      className="w-full p-3 bg-transparent border border-black/20 dark:border-white/20 text-black dark:text-white [&>option]:bg-white [&>option]:text-black dark:[&>option]:bg-black dark:[&>option]:text-white"
                    >
                      <option value="Hoodies">Hoodies</option>
                      <option value="T-Shirts">T-Shirts</option>
                      <option value="Cropped Tops">Cropped Tops</option>
                      <option value="Hats">Hats</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Shorts">Shorts</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-widest mb-2">Main Image</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={editingProduct.image}
                        onChange={e => setEditingProduct({...editingProduct, image: e.target.value})}
                        placeholder="https://..."
                        className="flex-1 p-3 bg-transparent border border-black/20 dark:border-white/20 text-black dark:text-white"
                      />
                      <label className="cursor-pointer flex items-center justify-center px-4 bg-black dark:bg-white text-white dark:text-black hover:opacity-80 transition-opacity">
                        {uploadingImage ? '...' : <ImageIcon size={20} />}
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleImageUpload('main')}
                          disabled={uploadingImage}
                        />
                      </label>
                    </div>
                    {editingProduct.image && (
                      <div className="mt-4 w-32 h-32 border border-black/10 dark:border-white/10 overflow-hidden relative group">
                        <img src={editingProduct.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-widest mb-2">Back Image (Optional)</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={editingProduct.backImage || ''}
                        onChange={e => setEditingProduct({...editingProduct, backImage: e.target.value})}
                        placeholder="https://..."
                        className="flex-1 p-3 bg-transparent border border-black/20 dark:border-white/20 text-black dark:text-white"
                      />
                    </div>
                    {editingProduct.backImage && (
                      <div className="mt-4 w-32 h-32 border border-black/10 dark:border-white/10 overflow-hidden relative group">
                        <img src={editingProduct.backImage} alt="Back Preview" className="w-full h-full object-cover" />
                        <button 
                          onClick={() => setEditingProduct({...editingProduct, backImage: ''})}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full shadow-md hover:bg-red-600 transition-colors"
                          title="Eliminar imagem"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-widest mb-2">Additional Images</label>
                    <div className="flex gap-2 mb-4">
                      <label className="flex items-center justify-center px-4 py-3 w-full bg-black/5 dark:bg-white/5 border border-black/20 dark:border-white/20 cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-xs uppercase tracking-widest font-bold text-black dark:text-white">
                        {uploadingImage ? <span className="animate-spin mr-2">⏳</span> : <Plus size={16} className="mr-2" />}
                        Add Additional Image
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload('additional')} disabled={uploadingImage} />
                      </label>
                    </div>
                    {editingProduct.additionalImages && editingProduct.additionalImages.length > 0 && (
                      <div className="flex flex-wrap gap-4">
                        {editingProduct.additionalImages.map((imgUrl: string, idx: number) => (
                          <div key={idx} className="relative w-24 h-24 border border-black/10 dark:border-white/10 overflow-hidden group">
                            <img src={imgUrl} alt={`Additional ${idx}`} className="w-full h-full object-cover" />
                            <button 
                              onClick={() => {
                                const newImages = [...(editingProduct.additionalImages || [])];
                                newImages.splice(idx, 1);
                                setEditingProduct({...editingProduct, additionalImages: newImages});
                              }}
                              className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full shadow-md hover:bg-red-600 transition-colors"
                              title="Eliminar imagem"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-widest mb-2">Description</label>
                    <textarea 
                      value={editingProduct.description || ''}
                      onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                      className="w-full p-3 bg-transparent border border-black/20 dark:border-white/20 h-24 text-black dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2">Sizes (comma separated)</label>
                    <input 
                      type="text" 
                      value={editingProduct.sizes?.join(', ') || ''}
                      onChange={e => setEditingProduct({...editingProduct, sizes: e.target.value.split(',').map(s => s.trim())})}
                      className="w-full p-3 bg-transparent border border-black/20 dark:border-white/20 text-black dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2">Colors (comma separated)</label>
                    <input 
                      type="text" 
                      value={editingProduct.colors?.join(', ') || ''}
                      onChange={e => setEditingProduct({...editingProduct, colors: e.target.value.split(',').map(c => c.trim())})}
                      className="w-full p-3 bg-transparent border border-black/20 dark:border-white/20 text-black dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={handleSaveProduct}
                    className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black text-xs uppercase tracking-widest font-bold"
                  >
                    Save Product
                  </button>
                  <button 
                    onClick={() => setEditingProduct(null)}
                    className="px-6 py-3 border border-black/20 dark:border-white/20 text-xs uppercase tracking-widest font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <div key={product.id} className="border border-black/10 dark:border-white/10 p-4 flex gap-4">
                    <img src={product.image} alt={product.name} className="w-20 h-24 object-cover" />
                    <div className="flex-1">
                      <h3 className="font-bold text-sm mb-1">{product.name}</h3>
                      <p className="text-xs opacity-70 mb-2">{product.price} MZN</p>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingProduct(product)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDeleteProduct(product.id)} className="p-2 hover:bg-red-500/10 text-red-500 rounded">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-display font-bold mb-6">Definições do Site</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2">Hero Title</label>
                <input 
                  type="text" 
                  value={settings.heroTitle}
                  onChange={e => setSettings({...settings, heroTitle: e.target.value})}
                  className="w-full p-3 bg-transparent border border-black/20 dark:border-white/20 text-black dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2">Hero Subtitle</label>
                <textarea 
                  value={settings.heroSubtitle}
                  onChange={e => setSettings({...settings, heroSubtitle: e.target.value})}
                  className="w-full p-3 bg-transparent border border-black/20 dark:border-white/20 h-24 text-black dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2">About Text</label>
                <textarea 
                  value={settings.aboutText}
                  onChange={e => setSettings({...settings, aboutText: e.target.value})}
                  className="w-full p-3 bg-transparent border border-black/20 dark:border-white/20 h-32 text-black dark:text-white"
                />
              </div>
              <button 
                onClick={handleSaveSettings}
                className="flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black text-xs uppercase tracking-widest font-bold"
              >
                <Save size={16} /> Save Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
