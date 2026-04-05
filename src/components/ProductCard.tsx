import { motion } from 'motion/react';
import { Product } from '../types';
import { Share2, Check } from 'lucide-react';
import React, { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  key?: string;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, you might have specific routes for products. 
    // Here we just share the main URL, but you could append ?product=id
    const url = `${window.location.origin}?product=${product.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} at ASTRO!`,
          url: url,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="group cursor-pointer"
      onClick={() => onClick(product)}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-zinc-900 mb-4">
        <img 
          src={product.image} 
          alt={product.name}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Hover Image */}
        {(product.backImage || (product.additionalImages && product.additionalImages.length > 0)) && (
          <img 
            src={product.backImage || (product.additionalImages && product.additionalImages[0])} 
            alt={`${product.name} alternate view`}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        
        {/* Share Button */}
        <button
          onClick={handleShare}
          className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white dark:hover:bg-black"
          title="Share Product"
        >
          {copied ? <Check size={16} className="text-green-500" /> : <Share2 size={16} />}
        </button>

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/80 dark:bg-black/80 backdrop-blur-sm">
          <p className="text-[10px] uppercase tracking-widest font-bold text-center">View Details</p>
        </div>
      </div>

      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xs uppercase tracking-widest font-bold mb-1">{product.name}</h3>
          <p className="text-[10px] opacity-50 uppercase tracking-widest">{product.category}</p>
        </div>
        <p className="text-sm font-display font-bold">{product.price} MZN</p>
      </div>
    </motion.div>
  );
}
