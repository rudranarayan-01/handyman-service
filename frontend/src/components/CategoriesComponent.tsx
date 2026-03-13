import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/api';
import { motion, AnimatePresence } from 'framer-motion'; // Added for smooth UI
import { Search, ArrowRight, ShieldCheck, ImageOff, Sparkles } from 'lucide-react';
import { categoryMeta } from '@/constants/categories';

interface CategoryStat {
  _id: string;
  name: string;
  categoryImage?: string;
  count: number;
}

const CategoryPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<CategoryStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const res = await api.get('/services/category-stats');
        setStats(res.data || []);
      } catch (err) {
        console.error("Error fetching category stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryData();
  }, []);

  const filteredStats = useMemo(() => {
    return stats.filter(stat =>
      stat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [stats, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 md:pt-32">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="h-1 w-6 bg-blue-600 rounded-full"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Explore Services</span>
            </div>
            {/* Adjusted font sizes for mobile (text-4xl) vs desktop (text-8xl) */}
            <h1 className="text-5xl md:text-8xl font-black text-gray-900 tracking-tighter leading-[0.85] mb-6">
              Expert <br />
              <span className="text-blue-600">Solutions.</span>
            </h1>
            <div className="flex items-center gap-3 text-gray-500 font-bold text-xs md:text-sm">
              <div className="p-2 bg-blue-50 rounded-lg">
                <ShieldCheck size={18} className="text-blue-600" />
              </div>
              <span>Verified Professionals at your doorstep</span>
            </div>
          </motion.div>

          {/* SEARCH BAR */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full lg:w-96"
          >
            <div className="group relative">
              <input
                type="text"
                placeholder="Search category..."
                className="w-full bg-white border-2 border-gray-100 rounded-2xl py-4 px-6 pr-12 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50/50 transition-all text-lg font-bold text-gray-800 shadow-sm group-hover:shadow-md"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
            </div>
          </motion.div>
        </div>

        {/* CONTENT GRID - Updated to grid-cols-2 for mobile */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[3/4] md:aspect-[4/5] rounded-[2rem] bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8"
          >
            <AnimatePresence>
              {filteredStats.map((stat, index) => (
                <CategoryCard 
                  key={stat._id} 
                  stat={stat} 
                  index={index} 
                  navigate={navigate} 
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* EMPTY STATE */}
        {!loading && filteredStats.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center"
          >
            <div className="inline-flex p-6 bg-gray-100 rounded-full mb-4">
              <Search className="text-gray-400" size={32} />
            </div>
            <p className="text-gray-500 text-xl font-bold italic">No categories found...</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const CategoryCard = ({ stat, index, navigate }: { stat: CategoryStat, index: number, navigate: any }) => {
  const [hasError, setHasError] = useState(false);
  const meta = categoryMeta[stat.name];
  const Icon = meta?.icon || Sparkles;
  const displayImage = stat.categoryImage || meta?.image;
  const catSlug = stat.name.toLowerCase().replace(/\s+/g, '-');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => navigate(`/categories/${catSlug}`, { state: { categoryId: stat._id } })}
      // Removed fixed aspect ratio for mobile to allow a tighter 2x2 feel
      className="group relative aspect-[3/4] md:aspect-[4/5] rounded-[1.8rem] md:rounded-[2.5rem] overflow-hidden cursor-pointer bg-white shadow-sm hover:shadow-2xl transition-all duration-500 active:scale-95 touch-manipulation"
    >
      {/* IMAGE */}
      {displayImage && !hasError ? (
        <img
          src={displayImage}
          onError={() => setHasError(true)}
          alt={stat.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ease-out"
        />
      ) : (
        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
          <ImageOff className="text-slate-300" size={24} />
        </div>
      )}

      {/* GRADIENT OVERLAY - Made darker for better text contrast on mobile */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

      {/* CONTENT */}
      <div className="absolute inset-0 p-4 md:p-8 flex flex-col justify-end">
        {/* ICON - Hidden on very small screens to save space, or just made smaller */}
        <div className="mb-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 hidden sm:block">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-md rounded-xl md:rounded-2xl flex items-center justify-center border border-white/20 group-hover:bg-blue-600 group-hover:border-blue-500 transition-all">
            <Icon className="text-white w-5 h-5 md:w-6 md:h-6" />
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-xl md:text-3xl font-black text-white leading-[0.95] tracking-tighter">
            {stat.name}
          </h3>
          <div className="flex items-center justify-between gap-2">
            <p className="text-[9px] md:text-[10px] font-black text-blue-400 uppercase tracking-widest group-hover:text-white transition-colors truncate">
              {stat.count} Services
            </p>
            <ArrowRight className="text-white w-4 h-4 md:w-5 md:h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryPage;