export const CATEGORIES = [
    "Home Maintenance",
    "Cleaning & Pest Control",
    "Appliance Repair",
    "Home Renovations",
    "Security & Smart Home",
    "Outdoor & Lifestyle"
];

import { Search, Wind, Droplets, Zap, Paintbrush, Hammer, Sparkles, ShieldCheck, Home, TreePine } from 'lucide-react';
export const categoryMeta: Record<string, { icon: any, image: string }> = {
  'Home Maintenance': { icon: Sparkles, image: '/images/categories/cleaning.jpg' },
  'Cleaning & Pest Control': { icon: Droplets, image: '/images/categories/plumbing.jpg' },
  'Appliance Repair': { icon: Hammer, image: '/images/categories/appliance.jpg' },
  'Home Renovations': { icon: Home, image: '/images/categories/paint.jpg' },
  'Security & Smart Home': { icon: ShieldCheck, image: '/images/categories/outdoor.jpg' },
  'Outdoor & Lifestyle': { icon: TreePine, image: '/images/categories/outdoor.jpg' },
};