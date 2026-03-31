import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Born to shine oversized Tee',
    price: 1500,
    category: 'T-Shirts',
    image: 'https://picsum.photos/seed/astro-tee-1/800/1000',
    backImage: 'https://picsum.photos/seed/astro-tee-back-1/800/1000',
    additionalImages: [
      'https://picsum.photos/seed/astro-tee-extra-1/800/1000',
      'https://picsum.photos/seed/astro-tee-extra-2/800/1000'
    ],
    description: 'Premium heavyweight cotton oversized tee with "BORN 2 SHINE" chest print. Minimalist fit for a futuristic silhouette.',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: ['Preto', 'Branco', 'Rosa', 'Azul', 'Castanho']
  },
  {
    id: '2',
    name: 'Born to shine sweatshirt',
    price: 1450,
    category: 'Hoodies',
    image: 'https://picsum.photos/seed/astro-hoodie-1/800/1000',
    backImage: 'https://picsum.photos/seed/astro-hoodie-back-1/800/1000',
    description: 'Ultra-soft fleece sweatshirt featuring the signature ASTRO logo on the back. Designed for maximum comfort and style.',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: ['Preto', 'Branco', 'Rosa', 'Azul', 'Castanho']
  },
  {
    id: '3',
    name: 'Born to shine tote bag',
    price: 550,
    category: 'Tote Bags',
    image: 'https://picsum.photos/seed/astro-tote-1/800/1000',
    description: 'Durable canvas tote bag with bold ASTRO typography. Your daily essential for carrying the energy.',
    sizes: ['OS'],
    colors: ['Preto', 'Branco']
  },
  {
    id: '4',
    name: 'Born to shine trucker hat',
    price: 600,
    category: 'Hats',
    image: 'https://picsum.photos/seed/astro-hat-1/800/1000',
    description: 'Classic trucker hat with high-quality ASTRO print. Minimalist style for the streets.',
    sizes: [],
    colors: ['Preto', 'Cinzento', 'Rosa bebé', 'Rosa', 'Azul', 'Azul bebé', 'Vermelho', 'Verde']
  },
  {
    id: '5',
    name: 'Born to shine Hoodie',
    price: 1700,
    category: 'Hoodies',
    image: 'https://picsum.photos/seed/astro-hoodie-2/800/1000',
    description: 'Heavyweight hoodie with industrial-grade hardware and minimal ASTRO branding.',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: ['Preto', 'Branco', 'Rosa', 'Azul', 'Castanho']
  },
  {
    id: '6',
    name: 'Born to shine cropped',
    price: 750,
    category: 'Cropped Tops',
    image: 'https://picsum.photos/seed/astro-crop-1/800/1000',
    description: 'Minimalist cropped top with high-contrast ASTRO branding. Perfect for layering or standalone streetwear.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    colors: ['Preto', 'Branco', 'Rosa', 'Azul', 'Castanho']
  },
  {
    id: '7',
    name: 'Born to shine shorts',
    price: 1400,
    category: 'Shorts',
    image: 'https://picsum.photos/seed/astro-shorts-1/800/1000',
    description: 'Technical mesh shorts with reflective ASTRO detailing. Engineered for the urban explorer.',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: ['Preto', 'Branco', 'Rosa', 'Azul', 'Castanho']
  },
  {
    id: '8',
    name: 'Born to shine normal Tee',
    price: 950,
    category: 'T-Shirts',
    image: 'https://picsum.photos/seed/astro-tee-2/800/1000',
    description: 'Classic fit graphic tee with abstract ASTRO elements. High-contrast print on premium cotton.',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: ['Preto', 'Branco', 'Rosa', 'Azul', 'Castanho']
  },
  {
    id: '9',
    name: 'BORN to shine polo t-shirt',
    price: 1200,
    category: 'T-Shirts',
    image: 'https://picsum.photos/seed/astro-polo-1/800/1000',
    description: 'Classic polo t-shirt with signature ASTRO branding. Perfect for a smart-casual streetwear look.',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: ['Preto', 'Branco', 'Rosa', 'Azul', 'Castanho']
  },
  {
    id: '10',
    name: 'Born to shine embroidered hat',
    price: 700,
    category: 'Hats',
    image: 'https://picsum.photos/seed/astro-hat-2/800/1000',
    description: 'Premium hat with high-quality embroidered ASTRO logo. Stand out with textured details.',
    sizes: [],
    colors: ['Full Black', 'Full White', 'Vermelho e preto', 'Azul e branco']
  }
];

export const SOCIAL_LINKS = {
  whatsapp: 'https://wa.me/258835111449',
  instagram: 'https://instagram.com/astro_clothing25',
  tiktok: 'https://tiktok.com/@astro___02'
};

export const DISCOUNT_CODES: Record<string, { type: 'percentage' | 'fixed', value: number }> = {
  'ASTRO10': { type: 'percentage', value: 0.10 }, // 10% off para clientes normais
  'ASTROREV200': { type: 'fixed', value: 200 } // 200 MZN off por peça para revendedores
};

export const CATEGORIES: { label: string; value: string }[] = [
  { label: 'All', value: 'All' },
  { label: 'T-Shirts', value: 'T-Shirts' },
  { label: 'Hoodies', value: 'Hoodies' },
  { label: 'Cropped Tops', value: 'Cropped Tops' },
  { label: 'Shorts', value: 'Shorts' },
  { label: 'Tote Bags', value: 'Tote Bags' },
  { label: 'Hats', value: 'Hats' }
];
