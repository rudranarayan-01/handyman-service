import { useEffect, useState, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'; // SEO
import api from '@/api/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, ShieldCheck, ImageOff, Sparkles } from 'lucide-react';
import { categoryMeta } from '@/constants/categories';

interface CategoryStat {
  _id: string;
  name: string;
  categoryImage?: string;
  count: number;
  description?: string; // Included for SEO Schema
  slug?: string;
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

  // --- SEO STRUCTURED DATA ---
  const listSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": stats.map((cat, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": cat.name,
      "url": `${window.location.origin}/services?category=${cat.name.toLowerCase().replace(/\s+/g, '-')}`
    }))
  }), [stats]);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Helmet>
        <title>Professional Home Services | Expert Solutions at Your Doorstep</title>
        <meta name="description" content="Explore our wide range of professional home services. From cleaning to repairs, find verified experts for every need." />
        <meta name="keywords" content="home services, professional repairs, cleaning services, maintenance, verified experts" />
        <script type="application/ld+json">
          {JSON.stringify(listSchema)}
        </script>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 md:pt-32">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="h-1.5 w-8 bg-blue-600 rounded-full"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Premium Home Services</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-[0.8] mb-8">
              Expert <br />
              <span className="text-blue-600">Solutions.</span>
            </h1>
            <div className="flex items-center gap-3 text-gray-500 font-bold text-xs md:text-sm bg-white/50 w-fit p-1 pr-4 rounded-full border border-gray-100 shadow-sm">
              <div className="p-2 bg-blue-600 rounded-full shadow-lg shadow-blue-200">
                <ShieldCheck size={16} className="text-white" />
              </div>
              <span>Verified Professionals at your doorstep</span>
            </div>
          </motion.div>

          {/* SEARCH BAR */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full lg:w-[400px]"
          >
            <div className="group relative">
              <input
                type="text"
                placeholder="Search services..."
                className="w-full bg-white border-2 border-gray-100 rounded-[1.5rem] py-5 px-6 pr-14 outline-none focus:border-blue-600 focus:ring-8 focus:ring-blue-50 transition-all text-lg font-bold text-gray-800 shadow-xl shadow-gray-200/50"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-900 p-2.5 rounded-xl group-focus-within:bg-blue-600 transition-colors">
                <Search className="text-white w-5 h-5" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* CONTENT GRID */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[3/4] md:aspect-[4/5] rounded-[2.5rem] bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            <AnimatePresence mode='popLayout'>
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
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="py-32 text-center"
          >
            <div className="inline-flex p-8 bg-white border-2 border-dashed border-gray-200 rounded-[3rem] mb-6">
              <Search className="text-gray-300" size={48} />
            </div>
            <p className="text-gray-400 text-2xl font-black uppercase tracking-widest">No matching categories</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// --- OPTIMIZED CARD COMPONENT ---
const CategoryCard = memo(({ stat, index, navigate }: { stat: CategoryStat, index: number, navigate: any }) => {
  const [hasError, setHasError] = useState(false);
  const meta = categoryMeta[stat.name];
  const Icon = meta?.icon || Sparkles;
  const displayImage = stat.categoryImage || meta?.image;
  const catSlug = stat.name.toLowerCase().replace(/\s+/g, '-');

  const handleNavigation = () => {
    navigate(`/services?category=${catSlug}`);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ 
        duration: 0.5, 
        delay: Math.min(index * 0.05, 0.3), // Cap delay for many items
        ease: [0.215, 0.61, 0.355, 1] 
      }}
      onClick={handleNavigation}
      className="group relative aspect-[3/4] md:aspect-[4/5] rounded-[2rem] md:rounded-[3rem] overflow-hidden cursor-pointer bg-white shadow-lg hover:shadow-2xl transition-all duration-700 active:scale-[0.98] touch-manipulation"
    >
      {/* IMAGE WITH SMOOTH TRANSITION */}
      <div className="absolute inset-0 overflow-hidden bg-slate-200">
        {displayImage && !hasError ? (
          <img
            src={displayImage}
            loading="lazy"
            onError={() => setHasError(true)}
            alt={`${stat.name} services`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="text-slate-400" size={24} />
          </div>
        )}
      </div>

      {/* GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

      {/* CONTENT */}
      <div className="absolute inset-0 p-5 md:p-10 flex flex-col justify-end">
        {/* ICON - Desktop Only */}
        <div className="mb-4 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hidden sm:block">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 group-hover:bg-blue-600 group-hover:border-blue-400 group-hover:shadow-xl group-hover:shadow-blue-500/40 transition-all">
            <Icon className="text-white w-6 h-6" />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-2xl md:text-4xl font-black text-white leading-[0.9] tracking-tighter">
            {stat.name}
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 group-hover:bg-blue-600/30 group-hover:border-blue-400/50 transition-all">
                <p className="text-[8px] md:text-[10px] font-black text-gray-200 uppercase tracking-widest">
                  {stat.count} Services
                </p>
            </div>
            
            <motion.div 
              whileHover={{ x: 5 }}
              className="bg-white rounded-full p-2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 shadow-lg"
            >
                <ArrowRight className="text-black w-4 h-4" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// Setting display names for memoized components
CategoryCard.displayName = "CategoryCard";

export default CategoryPage;