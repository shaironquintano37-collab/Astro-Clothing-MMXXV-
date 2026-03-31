import { motion } from 'motion/react';
import { Product } from '../types';

interface FeaturedProps {
  products: Product[];
}

export default function Featured({ products }: FeaturedProps) {
  const featuredProducts = products.slice(0, 3);

  return (
    <section className="py-24 bg-black text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="slogan-text text-6xl md:text-8xl mb-8 leading-none">
              BORN 2<br />SHINE
            </h2>
            <p className="text-sm uppercase tracking-[0.2em] leading-relaxed opacity-70 max-w-md mb-12">
              Our signature collection is a statement of intent. High-contrast designs for those who aren't afraid to stand out in the dark.
            </p>
            <div className="flex space-x-8">
              <div className="text-center">
                <p className="text-3xl font-display font-bold mb-1">100%</p>
                <p className="text-[10px] uppercase tracking-widest opacity-50">Cotton</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-display font-bold mb-1">24/7</p>
                <p className="text-[10px] uppercase tracking-widest opacity-50">Energy</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-display font-bold mb-1">∞</p>
                <p className="text-[10px] uppercase tracking-widest opacity-50">Style</p>
              </div>
            </div>
          </motion.div>

          <div className="relative h-[600px]">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.8, rotate: index * 5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                className="absolute inset-0 flex items-center justify-center"
                style={{ zIndex: 3 - index }}
              >
                <div className="w-64 md:w-80 aspect-[3/4] bg-zinc-900 border border-white/10 shadow-2xl overflow-hidden transform" style={{ transform: `rotate(${index * 5 - 5}deg)` }}>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
