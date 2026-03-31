import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Shop from './components/Shop';
import Featured from './components/Featured';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ProductModal from './components/ProductModal';
import Cart from './components/Cart';
import AdminModal from './components/AdminModal';
import LoyaltyModal from './components/LoyaltyModal';
import { Product, CartItem } from './types';
import { PRODUCTS, SOCIAL_LINKS } from './constants';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isLoyaltyModalOpen, setIsLoyaltyModalOpen] = useState(false);
  const [purchasesCount, setPurchasesCount] = useState(() => {
    const saved = localStorage.getItem('astro_loyalty_purchases');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Handle Dark Mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleOrderComplete = () => {
    setPurchasesCount(prev => {
      const newCount = prev + 1;
      localStorage.setItem('astro_loyalty_purchases', newCount.toString());
      return newCount;
    });
  };

  const addToCart = (product: Product, size?: string, color?: string) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedSize === size && item.selectedColor === color);
      if (existing) {
        return prev.map(item => 
          item.id === product.id && item.selectedSize === size && item.selectedColor === color
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, selectedSize: size, selectedColor: color, quantity: 1 }];
    });
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, size: string | undefined, color: string | undefined, delta: number) => {
    setCartItems(prev => {
      const updated = prev.map(item => {
        if (item.id === id && item.selectedSize === size && item.selectedColor === color) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      });
      return updated;
    });
  };

  const removeFromCart = (id: string, size: string | undefined, color: string | undefined) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.selectedSize === size && item.selectedColor === color)));
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <Navbar 
        isDark={isDark} 
        toggleDark={() => setIsDark(!isDark)} 
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
        onLoyaltyClick={() => setIsLoyaltyModalOpen(true)}
      />

      <main>
        <Hero />
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <Shop products={products} onProductClick={setSelectedProduct} />
        </motion.div>

        <Featured products={products} />
        
        <About />
        <Contact />
      </main>

      <Footer onAdminClick={() => setIsAdminModalOpen(true)} />

      {/* Floating WhatsApp Button */}
      <motion.a
        href={SOCIAL_LINKS.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center"
      >
        <MessageCircle size={32} />
      </motion.a>

      <AdminModal 
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={() => setIsAdmin(true)}
      />

      <AnimatePresence>
        {selectedProduct && (
          <ProductModal 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)}
            onAddToCart={addToCart}
            onUpdateProduct={(updated) => {
              setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
              setSelectedProduct(updated);
            }}
            isAdmin={isAdmin}
          />
        )}
      </AnimatePresence>

      <Cart 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onClearCart={() => setCartItems([])}
        onOrderComplete={handleOrderComplete}
      />

      <LoyaltyModal 
        isOpen={isLoyaltyModalOpen}
        onClose={() => setIsLoyaltyModalOpen(false)}
        purchasesCount={purchasesCount}
      />
    </div>
  );
}
