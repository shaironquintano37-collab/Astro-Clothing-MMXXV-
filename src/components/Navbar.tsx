import { motion } from 'motion/react';
import { ShoppingBag, Menu, X, Moon, Sun, Instagram, MessageCircle, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import React, { useState } from 'react';
import { SOCIAL_LINKS } from '../constants';
import { User } from 'firebase/auth';

const Avatar = ({ src, alt, size = 5 }: { src: string | null; alt: string; size?: number }) => {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className={`w-${size} h-${size} rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center`}>
        <UserIcon size={size === 5 ? 16 : 20} />
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={`w-${size} h-${size} rounded-full object-cover`} 
      referrerPolicy="no-referrer" 
      onError={() => setError(true)}
    />
  );
};

interface NavbarProps {
  isDark: boolean;
  toggleDark: () => void;
  cartCount: number;
  onCartClick: () => void;
  onLoyaltyClick: () => void;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  isAdmin?: boolean;
  onAdminClick?: () => void;
}

export default function Navbar({ isDark, toggleDark, cartCount, onCartClick, onLoyaltyClick, user, onLogin, onLogout, isAdmin, onAdminClick }: NavbarProps) {
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
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-xs uppercase tracking-widest opacity-70 flex items-center gap-2">
                  <Avatar src={user.photoURL} alt="Profile" size={5} />
                  {user.displayName?.split(' ')[0] || 'User'}
                </span>
                <button onClick={onLogout} className="hover:opacity-50 transition-opacity" title="Logout">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button onClick={onLogin} className="text-sm uppercase tracking-widest hover:opacity-50 transition-opacity flex items-center gap-2">
                <LogIn size={18} />
                Login
              </button>
            )}
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="hover:opacity-50 transition-opacity ml-4">
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

          {isAdmin && onAdminClick && (
            <button 
              onClick={onAdminClick}
              className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors text-xs font-bold uppercase tracking-widest"
            >
              Admin
            </button>
          )}
          
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
          {user ? (
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-6">
              <div className="flex items-center gap-3">
                <Avatar src={user.photoURL} alt="Profile" size={10} />
                <span className="text-lg font-display font-bold uppercase tracking-tighter">
                  {user.displayName || 'User'}
                </span>
              </div>
              <button onClick={() => { onLogout(); setIsOpen(false); }} className="p-2 bg-black/5 dark:bg-white/5 rounded-full">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => { onLogin(); setIsOpen(false); }}
              className="flex items-center gap-3 text-2xl font-display font-bold uppercase tracking-tighter text-left border-b border-black/10 dark:border-white/10 pb-6"
            >
              <LogIn size={24} />
              Login / Registo
            </button>
          )}

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
