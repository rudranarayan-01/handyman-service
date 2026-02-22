import { Droplets, Hammer, Sparkles, ShieldCheck, Home, TreePine } from 'lucide-react';
export const CATEGORIES = [
    "Home Maintenance",
    "Cleaning & Pest Control",
    "Appliance Repair",
    "Home Renovations",
    "Security & Smart Home",
    "Outdoor & Lifestyle"
];

export const categoryMeta: Record<string, { icon: any, image: string }> = {
  'Home Maintenance': { icon: Sparkles, image: '/images/home-maintainance.png' },
  'Cleaning & Pest Control': { icon: Droplets, image: '/images/Cleaning/cleaning.jpg' },
  'Appliance Repair': { icon: Hammer, image: '/images/applience-repair-wallpaper.jpg' },
  'Home Renovations': { icon: Home, image: '/images/home-renovation-wallpaper.jpeg' },
  'Security & Smart Home': { icon: ShieldCheck, image: '/images/smart-home-wallpaper.jpeg' },
  'Outdoor & Lifestyle': { icon: TreePine, image: '/images/garden-maintenance.jpg' },
};