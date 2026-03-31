import { Instagram, MessageCircle } from 'lucide-react';
import { SOCIAL_LINKS } from '../constants';

const TiktokIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

interface FooterProps {
  onAdminClick: () => void;
}

export default function Footer({ onAdminClick }: FooterProps) {
  return (
    <footer id="footer" className="py-20 px-6 border-t border-black/5 dark:border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
        <div>
          <h2 className="text-2xl font-display font-bold tracking-tighter mb-6">ASTRO</h2>
          <p className="text-[10px] uppercase tracking-widest opacity-50 max-w-xs">
            BORN 2 SHINE. Futuristic streetwear for the modern era. Designed in the shadows, made for the light.
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <h3 className="text-xs uppercase tracking-widest font-bold mb-2">Navigation</h3>
          <a href="#shop" className="text-[10px] uppercase tracking-widest hover:opacity-50 transition-opacity">Shop All</a>
          <a href="#about" className="text-[10px] uppercase tracking-widest hover:opacity-50 transition-opacity">Our Story</a>
          <a href="#contact" className="text-[10px] uppercase tracking-widest hover:opacity-50 transition-opacity">Contact</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onAdminClick(); }} className="text-[10px] uppercase tracking-widest hover:opacity-50 transition-opacity">Admin Access</a>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-widest font-bold mb-6">Connect</h3>
          <div className="flex space-x-6">
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="p-3 bg-black dark:bg-white text-white dark:text-black rounded-full hover:scale-110 transition-transform">
              <Instagram size={20} />
            </a>
            <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer" className="p-3 border border-black/10 dark:border-white/10 rounded-full hover:scale-110 transition-transform">
              <TiktokIcon size={20} />
            </a>
            <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="p-3 border border-black/10 dark:border-white/10 rounded-full hover:scale-110 transition-transform">
              <MessageCircle size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 flex flex-col md:flex-row justify-between items-center gap-4 opacity-30">
        <p className="text-[10px] uppercase tracking-widest">© 2026 ASTRO. All Rights Reserved.</p>
        <p className="text-[10px] uppercase tracking-widest">BORN 2 SHINE</p>
      </div>
    </footer>
  );
}
