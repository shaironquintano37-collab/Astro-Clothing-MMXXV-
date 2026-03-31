import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORIES } from '../constants';
import ProductCard from './ProductCard';
import { Product } from '../types';

interface ShopProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export default function Shop({ products, onProductClick }: ShopProps) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <section id="shop" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
        <div>
          <h2 className="text-4xl font-display font-bold tracking-tighter uppercase mb-2">The Collection</h2>
          <p className="text-sm opacity-50 uppercase tracking-widest">Futuristic Streetwear Essentials</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`text-[10px] uppercase tracking-[0.2em] px-4 py-2 border transition-all ${
                activeCategory === cat.value 
                  ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' 
                  : 'border-black/10 dark:border-white/10 hover:border-black dark:hover:border-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

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
    </section>
  );
}
