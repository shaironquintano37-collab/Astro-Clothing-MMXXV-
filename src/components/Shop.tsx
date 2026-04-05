import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ProductCard from './ProductCard';
import { Product } from '../types';
import { Loader2 } from 'lucide-react';

interface ShopProps {
  products: Product[];
  categories: string[];
  onProductClick: (product: Product) => void;
  isLoading?: boolean;
}

export default function Shop({ products, categories, onProductClick, isLoading = false }: ShopProps) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const displayCategories = ['All', ...(categories || [])];

  return (
    <section id="shop" className="py-24 px-6 max-w-7xl mx-auto min-h-[60vh]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
        <div>
          <h2 className="text-4xl font-display font-bold tracking-tighter uppercase mb-2">The Collection</h2>
          <p className="text-sm opacity-50 uppercase tracking-widest">Futuristic Streetwear Essentials</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          {displayCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-[10px] uppercase tracking-[0.2em] px-4 py-2 border transition-all ${
                activeCategory === cat 
                  ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' 
                  : 'border-black/10 dark:border-white/10 hover:border-black dark:hover:border-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-50">
          <Loader2 size={48} className="animate-spin mb-4" />
          <p className="text-xs uppercase tracking-widest font-bold">A carregar produtos...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-50">
          <p className="text-xs uppercase tracking-widest font-bold">Nenhum produto disponível no momento.</p>
        </div>
      ) : activeCategory === 'All' ? (
        <div className="space-y-24">
          {(categories || []).map(section => {
            const sectionProducts = products.filter(p => p.category === section);
            if (sectionProducts.length === 0) return null;
            
            return (
              <div key={section}>
                <h3 className="text-2xl font-display font-bold uppercase tracking-widest mb-8 border-b border-black/10 dark:border-white/10 pb-4">{section}</h3>
                <motion.div 
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12"
                >
                  <AnimatePresence mode="popLayout">
                    {sectionProducts.map((product) => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        onClick={onProductClick}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>
            );
          })}
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onClick={onProductClick}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
