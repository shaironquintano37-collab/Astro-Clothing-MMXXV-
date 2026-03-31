import { motion } from 'motion/react';

export default function About() {
  return (
    <section id="about" className="py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-sm uppercase tracking-[0.4em] font-bold mb-12 opacity-30">Our Philosophy</h2>
          <p className="text-3xl md:text-5xl font-display font-bold tracking-tight leading-tight mb-12">
            ASTRO is about energy, mindset, and standing out without noise.
          </p>
          <div className="w-24 h-[1px] bg-black dark:bg-white mx-auto mb-12" />
          <p className="text-sm uppercase tracking-widest leading-loose opacity-60 max-w-2xl mx-auto">
            We believe streetwear is more than just clothing. It's a futuristic uniform for the modern creator. Every piece is crafted with high-contrast aesthetics to reflect the duality of light and shadow.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
