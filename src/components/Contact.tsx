import { motion } from 'motion/react';
import { SOCIAL_LINKS } from '../constants';
import { Instagram, MessageCircle } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-32 px-6 bg-gray-50 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-display font-bold tracking-tighter uppercase mb-8"
        >
          Ready to shine?
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg opacity-70 mb-12 max-w-2xl mx-auto"
        >
          Send your order and payment proof. We're here to help you get the best fit.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a 
            href={SOCIAL_LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-12 py-5 bg-[#25D366] text-white text-sm uppercase tracking-[0.2em] font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2"
          >
            <MessageCircle size={20} />
            WhatsApp
          </a>
          <a 
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-12 py-5 border border-black dark:border-white text-black dark:text-white text-sm uppercase tracking-[0.2em] font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors flex items-center justify-center gap-2"
          >
            <Instagram size={20} />
            Instagram
          </a>
          <a 
            href={SOCIAL_LINKS.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-12 py-5 border border-black dark:border-white text-black dark:text-white text-sm uppercase tracking-[0.2em] font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
            TikTok
          </a>
        </motion.div>
      </div>
    </section>
  );
}
