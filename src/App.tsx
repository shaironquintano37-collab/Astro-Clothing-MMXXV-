import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Shop from './components/Shop';
import Featured from './components/Featured';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ProductModal from './components/ProductModal';
import Cart from './components/Cart';
import AdminDashboard from './components/AdminDashboard';
import LoyaltyModal from './components/LoyaltyModal';
import { Product, CartItem } from './types';
import { PRODUCTS, SOCIAL_LINKS } from './constants';
import { auth, db, googleProvider } from './firebase';
import { signInWithPopup, signInWithRedirect, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, onSnapshot, collection, getDocs } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from './utils/firestoreErrorHandler';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [settings, setSettings] = useState({
    heroTitle: 'BORN TO SHINE',
    heroSubtitle: 'Astro Clothing. Premium streetwear for the urban explorer.',
    aboutText: 'ASTRO is more than a clothing brand. It\'s a movement. Born in the streets, designed for the stars.'
  });
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isLoyaltyModalOpen, setIsLoyaltyModalOpen] = useState(false);
  
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [purchasesCount, setPurchasesCount] = useState(() => {
    const saved = localStorage.getItem('astro_loyalty_purchases');
    const parsed = parseInt(saved || '0', 10);
    return isNaN(parsed) ? 0 : parsed;
  });

  // Handle Dark Mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Fetch initial data
  useEffect(() => {
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      if (!snapshot.empty) {
        setProducts(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
      } else {
        // Seed products if empty
        setProducts(PRODUCTS); // Show default products immediately
        PRODUCTS.forEach(async (p) => {
          try {
            await setDoc(doc(db, 'products', p.id), p);
          } catch (e) {
            // Ignore permission errors for non-admins during seeding
          }
        });
      }
      setIsLoadingProducts(false);
    }, (error) => {
      console.error("Error fetching products:", error);
      setIsLoadingProducts(false);
    });

    const unsubSettings = onSnapshot(doc(db, 'settings', 'main'), (snapshot) => {
      if (snapshot.exists()) {
        setSettings(snapshot.data() as any);
      } else {
        try {
          setDoc(doc(db, 'settings', 'main'), settings);
        } catch (e) {
          // Ignore permission errors for non-admins during seeding
        }
      }
    }, (error) => {
      console.error("Error fetching settings:", error);
    });

    return () => {
      unsubProducts();
      unsubSettings();
    };
  }, []);

  // Handle Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
      
      if (currentUser) {
        const isDefaultAdmin = currentUser.email?.toLowerCase() === 'shaironquintano37@gmail.com';
        
        // Optimistically set admin if email matches
        if (isDefaultAdmin) {
          setIsAdmin(true);
        }

        // Check if user document exists
        const userRef = doc(db, 'users', currentUser.uid);
        try {
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) {
            // Create new user profile
            await setDoc(userRef, {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || '',
              purchasesCount: purchasesCount, // migrate local purchases if any
              role: isDefaultAdmin ? 'admin' : 'user'
            });
          } else {
            // Check if they are admin from DB
            if (userSnap.data().role === 'admin') {
              setIsAdmin(true);
            }
          }
        } catch (error) {
          console.error("Error fetching/creating user data:", error);
          // If Firestore fails, we still rely on the optimistic check above
        }
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Listen to Firestore purchasesCount if logged in
  useEffect(() => {
    if (user && isAuthReady) {
      const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          if (data.purchasesCount !== undefined) {
            setPurchasesCount(data.purchasesCount);
            localStorage.setItem('astro_loyalty_purchases', data.purchasesCount.toString());
          }
        }
      }, (error) => {
        console.error("Firestore Error: ", error);
      });
      return () => unsubscribe();
    }
  }, [user, isAuthReady]);

  const handleLogin = async () => {
    console.log("Login button clicked");
    try {
      setLoginError(null);
      console.log("Calling signInWithPopup...");
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Login successful:", result.user.email);
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/popup-blocked') {
        console.log("Popup blocked or closed, falling back to redirect...");
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectError: any) {
          console.error("Redirect login error:", redirectError);
          setLoginError("Falha ao redirecionar para o login. Tente abrir o site num navegador diferente (Safari/Chrome).");
        }
      } else {
        setLoginError(error.message || "Falha ao fazer login. Tente novamente.");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleOrderComplete = async () => {
    const newCount = purchasesCount + 1;
    setPurchasesCount(newCount);
    localStorage.setItem('astro_loyalty_purchases', newCount.toString());

    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          purchasesCount: newCount
        });
      } catch (error) {
        console.error("Error updating purchases in Firestore:", error);
      }
    }
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
      {loginError && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded shadow-lg flex items-center gap-4">
          <span className="text-sm font-bold">{loginError}</span>
          <button onClick={() => setLoginError(null)} className="hover:opacity-70">
            <X size={16} />
          </button>
        </div>
      )}
      
      <Navbar 
        isDark={isDark} 
        toggleDark={() => setIsDark(!isDark)} 
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
        onLoyaltyClick={() => setIsLoyaltyModalOpen(true)}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        isAdmin={isAdmin}
        onAdminClick={() => setIsAdminDashboardOpen(true)}
      />

      <main>
        <Hero 
          title={settings.heroTitle}
          subtitle={settings.heroSubtitle}
        />
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <Shop products={products} onProductClick={setSelectedProduct} isLoading={isLoadingProducts} />
        </motion.div>

        <Featured products={products} />
        
        <About text={settings.aboutText} />
        <Contact />
      </main>

      <Footer 
        onAdminClick={() => setIsAdminDashboardOpen(true)} 
        isAdmin={isAdmin}
      />

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

        {isAdmin && (
          <AdminDashboard 
            isOpen={isAdminDashboardOpen}
            onClose={() => setIsAdminDashboardOpen(false)}
          />
        )}

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
