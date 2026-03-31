import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Gift } from 'lucide-react';

interface LoyaltyModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchasesCount: number;
}

export default function LoyaltyModal({ isOpen, onClose, purchasesCount }: LoyaltyModalProps) {
  const maxPurchases = 5;
  const currentPurchases = Math.min(purchasesCount, maxPurchases);
  const isEligible = purchasesCount >= maxPurchases;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm"
          />
          
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-white dark:bg-zinc-950 shadow-2xl pointer-events-auto border border-black/10 dark:border-white/10"
            >
              <div className="p-6 border-b border-black/10 dark:border-white/10 flex justify-between items-center">
                <h2 className="text-2xl font-display font-bold tracking-tighter uppercase flex items-center gap-2">
                  <Star className="fill-current" />
                  Cartão de Fidelidade
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-8">
                <p className="text-sm opacity-70 mb-8 text-center uppercase tracking-widest leading-relaxed">
                  Complete 5 compras e receba um brinde grátis à nossa escolha na sua próxima encomenda.
                </p>

                <div className="flex justify-center gap-4 mb-8">
                  {Array.from({ length: maxPurchases }).map((_, i) => {
                    const isFilled = i < currentPurchases;
                    const isLast = i === maxPurchases - 1;
                    return (
                      <div 
                        key={i} 
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                          isFilled 
                            ? 'bg-black dark:bg-white border-black dark:border-white text-white dark:text-black scale-110' 
                            : 'border-black/20 dark:border-white/20 text-black/20 dark:text-white/20'
                        }`}
                      >
                        {isLast ? (
                          <Gift size={20} className={isFilled ? 'fill-current' : ''} />
                        ) : (
                          <Star size={20} className={isFilled ? 'fill-current' : ''} />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="text-center">
                  <h3 className="text-4xl font-display font-bold mb-2">
                    {currentPurchases}/{maxPurchases}
                  </h3>
                  <p className="text-xs uppercase tracking-widest opacity-50 font-bold">
                    Compras Realizadas
                  </p>
                </div>

                {isEligible && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 text-center"
                  >
                    <p className="text-green-800 dark:text-green-200 text-xs uppercase tracking-widest font-bold leading-relaxed">
                      🎉 Parabéns! Tem direito a um brinde grátis! Envie-nos uma mensagem no WhatsApp para reclamar o seu prémio.
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
