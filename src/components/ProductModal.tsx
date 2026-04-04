import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, ChevronLeft, ChevronRight, Pencil, Upload } from 'lucide-react';
import { Product } from '../types';
import React, { useState } from 'react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  onUpdateProduct: (product: Product) => void;
  isAdmin: boolean;
}

export default function ProductModal({ product, onClose, onAddToCart, onUpdateProduct, isAdmin }: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  if (!product) return null;

  const allImages = [
    product.image,
    ...(product.backImage ? [product.backImage] : []),
    ...(product.additionalImages || [])
  ];

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back' | 'additional') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (type === 'front') {
          onUpdateProduct({ ...product, image: result });
        } else if (type === 'back') {
          onUpdateProduct({ ...product, backImage: result });
        } else if (type === 'additional') {
          onUpdateProduct({ 
            ...product, 
            additionalImages: [...(product.additionalImages || []), result] 
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCurrentImage = () => {
    if (currentImageIndex === 0) return;
    
    if (product.backImage && currentImageIndex === 1) {
      onUpdateProduct({ ...product, backImage: undefined });
      setCurrentImageIndex(0);
    } else {
      const additionalIndex = currentImageIndex - (product.backImage ? 2 : 1);
      const newAdditional = [...(product.additionalImages || [])];
      newAdditional.splice(additionalIndex, 1);
      onUpdateProduct({ ...product, additionalImages: newAdditional });
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-white/90 dark:bg-black/90 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-6xl bg-white dark:bg-black border border-black/5 dark:border-white/5 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-10 p-2 bg-black dark:bg-white text-white dark:text-black rounded-full hover:scale-110 transition-transform"
          >
            <X size={20} />
          </button>
          
          {isAdmin && (
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`absolute top-6 right-16 z-10 p-2 rounded-full hover:scale-110 transition-transform ${isEditing ? 'bg-green-500 text-white' : 'bg-black dark:bg-white text-white dark:text-black'}`}
              title="Edit Photos"
            >
              <Pencil size={20} />
            </button>
          )}

          {/* Image Section */}
          <div className="w-full md:w-1/2 relative bg-gray-100 dark:bg-zinc-900 flex items-center justify-center overflow-hidden">
            {isEditing && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center space-y-4 z-20">
                <label className="cursor-pointer bg-white dark:bg-black text-black dark:text-white px-6 py-3 flex items-center space-x-2 text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform">
                  <Upload size={16} />
                  <span>Upload Front Photo</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'front')} />
                </label>
                <label className="cursor-pointer bg-white dark:bg-black text-black dark:text-white px-6 py-3 flex items-center space-x-2 text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform">
                  <Upload size={16} />
                  <span>Upload Back Photo</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'back')} />
                </label>
                <label className="cursor-pointer bg-white dark:bg-black text-black dark:text-white px-6 py-3 flex items-center space-x-2 text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform">
                  <Upload size={16} />
                  <span>Add More Photos</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'additional')} />
                </label>
                {currentImageIndex > 0 && (
                  <button 
                    onClick={handleRemoveCurrentImage}
                    className="bg-red-500 text-white px-6 py-3 flex items-center space-x-2 text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform"
                  >
                    <X size={16} />
                    <span>Remove Current Photo</span>
                  </button>
                )}
              </div>
            )}
            <motion.img 
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={allImages[currentImageIndex]} 
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            
            {allImages.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-4 z-10">
                <button 
                  onClick={handlePrevImage}
                  className="w-12 h-12 border flex items-center justify-center transition-all bg-white/50 dark:bg-black/50 border-transparent hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={handleNextImage}
                  className="w-12 h-12 border flex items-center justify-center transition-all bg-white/50 dark:bg-black/50 border-transparent hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            {/* Dots indicator */}
            {allImages.length > 1 && (
              <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                {allImages.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-black dark:bg-white scale-125' : 'bg-black/20 dark:bg-white/20'}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="w-full md:w-1/2 p-8 md:p-16 overflow-y-auto flex flex-col justify-center">
            <div className="mb-10">
              <p className="text-[10px] uppercase tracking-[0.3em] opacity-50 mb-4">{product.category}</p>
              
              {isEditing ? (
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => onUpdateProduct({ ...product, name: e.target.value })}
                  className="w-full text-4xl md:text-5xl font-display font-bold tracking-tighter uppercase mb-4 leading-none bg-transparent border-b border-black/20 dark:border-white/20 focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white"
                />
              ) : (
                <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter uppercase mb-4 leading-none">{product.name}</h2>
              )}

              {isEditing ? (
                <div className="flex items-center mb-8">
                  <span className="text-2xl font-display font-bold mr-2">MZN</span>
                  <input
                    type="number"
                    value={product.price}
                    onChange={(e) => onUpdateProduct({ ...product, price: Number(e.target.value) })}
                    className="text-2xl font-display font-bold bg-transparent border-b border-black/20 dark:border-white/20 focus:outline-none focus:border-black dark:focus:border-white w-32 text-black dark:text-white"
                  />
                </div>
              ) : (
                <p className="text-2xl font-display font-bold mb-8">{product.price} MZN</p>
              )}

              {isEditing ? (
                <textarea
                  value={product.description}
                  onChange={(e) => onUpdateProduct({ ...product, description: e.target.value })}
                  className="w-full text-sm uppercase tracking-widest leading-relaxed opacity-60 bg-transparent border border-black/20 dark:border-white/20 p-2 focus:outline-none focus:border-black dark:focus:border-white min-h-[120px] text-black dark:text-white"
                />
              ) : (
                <p className="text-sm uppercase tracking-widest leading-relaxed opacity-60">
                  {product.description}
                </p>
              )}
            </div>

            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <p className="text-[10px] uppercase tracking-widest font-bold mb-4">Select Size</p>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-14 h-14 flex items-center justify-center text-xs font-bold border transition-all ${
                        selectedSize === size 
                          ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' 
                          : 'border-black/10 dark:border-white/10 hover:border-black dark:hover:border-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div className="mb-10">
                <p className="text-[10px] uppercase tracking-widest font-bold mb-4">Select Color</p>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 h-14 flex items-center justify-center text-xs font-bold border transition-all ${
                        selectedColor === color 
                          ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' 
                          : 'border-black/10 dark:border-white/10 hover:border-black dark:hover:border-white'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => {
                if (product.sizes && product.sizes.length > 0 && !selectedSize) return alert('Please select a size');
                if (product.colors && product.colors.length > 0 && !selectedColor) return alert('Please select a color');
                onAddToCart(product, selectedSize || undefined, selectedColor || undefined);
              }}
              className="w-full py-5 bg-black dark:bg-white text-white dark:text-black text-sm uppercase tracking-[0.3em] font-bold flex items-center justify-center space-x-4 hover:scale-[1.02] transition-transform active:scale-95"
            >
              <ShoppingBag size={18} />
              <span>Add to Bag</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
