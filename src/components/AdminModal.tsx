import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminModal({ isOpen, onClose, onSuccess }: AdminModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple passcode for the prototype
    if (password === 'astro2026') {
      onSuccess();
      onClose();
      setPassword('');
      setError(false);
    } else {
      setError(true);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-white dark:bg-black border border-black/10 dark:border-white/10 shadow-2xl p-8"
        >
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full">
            <X size={20} />
          </button>
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center mb-4">
              <Lock size={20} />
            </div>
            <h2 className="text-2xl font-display font-bold uppercase tracking-tighter">Admin Access</h2>
            <p className="text-[10px] uppercase tracking-widest opacity-50 text-center mt-2">Enter passcode to unlock edit mode</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                placeholder="Enter passcode"
                className={`w-full p-4 bg-gray-50 dark:bg-zinc-900 border ${error ? 'border-red-500' : 'border-black/10 dark:border-white/10'} focus:outline-none focus:border-black dark:focus:border-white text-sm tracking-widest`}
              />
              {error && <p className="text-red-500 text-[10px] uppercase tracking-widest mt-2">Incorrect passcode</p>}
            </div>
            <button 
              type="submit"
              className="w-full py-4 bg-black dark:bg-white text-white dark:text-black text-xs uppercase tracking-[0.2em] font-bold hover:scale-[1.02] transition-transform"
            >
              Unlock
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
