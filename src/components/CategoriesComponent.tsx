import React from 'react';
import { useNavigate } from 'react-router-dom';
import { applianceServices } from '@/data/Service';
import { Search, Wind, Droplets, Zap, Paintbrush, Hammer, Sparkles, ShieldCheck } from 'lucide-react';

// Manual mapping for Category Icons/Images based on the slugs in your service.ts
const categoryMeta: Record<string, { icon: any, image: string }> = {
  'ac-repair': { icon: Wind, image: '/images/categories/ac.jpg' },
  'plumbing': { icon: Droplets, image: '/images/categories/plumbing.jpg' },
  'electrical': { icon: Zap, image: '/images/categories/elec.jpg' },
  'painting': { icon: Paintbrush, image: '/images/categories/paint.jpg' },
  'appliance-repair': { icon: Hammer, image: '/images/categories/appliance.jpg' },
  'home-maintenance': { icon: Sparkles, image: '/images/categories/cleaning.jpg' },
  'outdoor-lifestyle': { icon: ShieldCheck, image: '/images/categories/outdoor.jpg' },
};

const CategoryPage = () => {
  const navigate = useNavigate();

  // Get unique categories from your applianceServices data
  const uniqueCategoryIds = Array.from(new Set(applianceServices.map(s => s.category)));

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section from your Screenshot */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
          <div className="max-w-2xl">
            <h1 className="text-6xl font-black text-gray-900 tracking-tighter leading-[0.9]">
              What do you <span className="text-blue-600">need help</span> with?
            </h1>
            <p className="text-gray-500 font-medium text-lg mt-6">
              Choose a category to see available experts.
            </p>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search services..." 
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {uniqueCategoryIds.map((catId) => {
            const meta = categoryMeta[catId] || categoryMeta['appliance-repair'];
            const serviceCount = applianceServices.filter(s => s.category === catId).length;
            const displayTitle = catId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

            return (
              <div 
                key={catId}
                onClick={() => navigate(`/categories/${catId}`)}
                className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                {/* Background Image */}
                <img 
                  src={meta.image} 
                  alt={displayTitle} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Dark Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity group-hover:opacity-90" />

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                    <meta.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-white leading-tight mb-1">
                    {displayTitle}
                  </h3>
                  <p className="text-sm font-bold text-gray-300 uppercase tracking-widest">
                    {serviceCount} Services
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Banner from your Screenshot */}
        <div className="mt-20 bg-[#0F172A] rounded-[2.5rem] p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="relative z-10 text-center md:text-left">
                <h2 className="text-3xl font-black text-white mb-2">Can't find what you're looking for?</h2>
                <p className="text-gray-400 font-medium italic">Our support team is available 24/7 to help you out.</p>
            </div>
            <button className="relative z-10 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all">
                Chat with us
            </button>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;