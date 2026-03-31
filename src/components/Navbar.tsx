import { motion } from 'motion/react';
import { ShoppingBag, Menu, X, Moon, Sun, Instagram, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { SOCIAL_LINKS } from '../constants';

interface NavbarProps {
  isDark: boolean;
  toggleDark: () => void;
  cartCount: number;
  onCartClick: () => void;
  onLoyaltyClick: () => void;
}

export default function Navbar({ isDark, toggleDark, cartCount, onCartClick, onLoyaltyClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Shop', href: '#shop' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-black/5 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <motion.a 
          href="#"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-display font-bold tracking-tighter"
        >
          ASTRO
        </motion.a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-12">
          {navLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href}
              className="text-sm uppercase tracking-widest hover:opacity-50 transition-opacity"
            >
              {link.name}
            </a>
          ))}
          <button 
            onClick={onLoyaltyClick}
            className="text-sm uppercase tracking-widest hover:opacity-50 transition-opacity flex items-center gap-2"
          >
            Fidelidade
          </button>
          <div className="flex items-center space-x-4 border-l border-black/10 dark:border-white/10 pl-8">
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="hover:opacity-50 transition-opacity">
              <Instagram size={18} />
            </a>
            <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:opacity-50 transition-opacity">
              <MessageCircle size={18} />
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-6">
          <button 
            onClick={toggleDark}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button 
            onClick={onCartClick}
            className="relative p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-black dark:bg-white text-white dark:text-black text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {cartCount}
              </span>
            )}
          </button>

          <button 
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

        {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-20 left-0 w-full bg-white dark:bg-black border-b border-black/5 dark:border-white/5 px-6 py-10 flex flex-col space-y-6"
        >
          {navLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-2xl font-display font-bold uppercase tracking-tighter"
            >
              {link.name}
            </a>
          ))}
          <button 
            onClick={() => {
              setIsOpen(false);
              onLoyaltyClick();
            }}
            className="text-2xl font-display font-bold uppercase tracking-tighter text-left"
          >
            Fidelidade
          </button>
        </motion.div>
      )}
    </nav>
  );
}
