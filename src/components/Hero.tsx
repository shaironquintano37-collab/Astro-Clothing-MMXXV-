import { motion } from 'motion/react';
import { SOCIAL_LINKS } from '../constants';
import { Instagram, MessageCircle } from 'lucide-react';

interface HeroProps {
  title?: string;
  subtitle?: string;
}

export default function Hero({ title = 'BORN 2\nSHINE', subtitle = '' }: HeroProps) {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] border-[1px] border-black dark:border-white rounded-full animate-pulse" />
      </div>

      <div className="z-10 text-center px-6">
        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="slogan-text text-7xl md:text-[12rem] leading-none mb-6 whitespace-pre-line"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-lg md:text-xl font-mono mb-12 opacity-80 max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a 
            href="#shop"
            className="w-full sm:w-auto px-12 py-4 bg-black dark:bg-white text-white dark:text-black text-sm uppercase tracking-[0.3em] font-bold hover:scale-105 transition-transform"
          >
            Shop Now
          </a>
          <a 
            href={SOCIAL_LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 border border-black dark:border-white text-black dark:text-white text-sm uppercase tracking-[0.1em] font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle size={18} />
            Order via WhatsApp
          </a>
          <a 
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 border border-black dark:border-white text-black dark:text-white text-sm uppercase tracking-[0.1em] font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors flex items-center justify-center gap-2"
          >
            <Instagram size={18} />
            Message on Instagram
          </a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
      >
        <span className="text-[10px] uppercase tracking-widest mb-2 opacity-50">Scroll</span>
        <div className="w-[1px] h-12 bg-black dark:bg-white origin-top animate-bounce" />
      </motion.div>
    </section>
  );
}
