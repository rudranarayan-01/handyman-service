import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/api';
import { Search, ArrowRight, ShieldCheck, ImageOff } from 'lucide-react';
import { categoryMeta } from '@/constants/categories';

// --- UPDATED TYPES ---
interface CategoryStat {
  _id: string; // This is now the Category ID from the database
  name: string; // Added: The human-readable name of the category
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
        // Ensure your backend endpoint is updated to return { _id, name, count }
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
      // Now searching by stat.name instead of the ID
      stat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [stats, searchQuery]);

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @keyframes revealUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-reveal { 
          animation: revealUp 0.8s cubic-bezier(0.2, 1, 0.3, 1) forwards; 
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 md:pt-32 md:pb-20">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-16">
          <div className="max-w-2xl animate-reveal" style={{ opacity: 0 }}>
            <div className="flex items-center gap-2 mb-6">
                <span className="h-[2px] w-8 bg-blue-600"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Premium Home Care</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-[0.8] mb-8">
              Expert <br />
              <span className="text-blue-600">Solutions.</span>
            </h1>
            <div className="flex items-center gap-4 text-gray-500 font-bold text-sm">
                <ShieldCheck size={20} className="text-blue-600" />
                <span>Background Verified Professionals</span>
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="relative w-full lg:w-96 animate-reveal" style={{ opacity: 0, animationDelay: '0.2s' }}>
            <input
              type="text"
              placeholder="Search category..."
              className="w-full bg-white border-b-2 border-gray-200 py-4 px-2 outline-none focus:border-blue-600 transition-all text-xl font-bold text-gray-800 placeholder:text-gray-300"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
          </div>
        </div>

        {/* CONTENT GRID */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[4/5] rounded-[2.5rem] bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {filteredStats.map((stat, index) => (
               <CategoryCard 
                  key={stat._id} 
                  stat={stat} 
                  index={index} 
                  navigate={navigate} 
               />
            ))}
          </div>
        )}

        {!loading && filteredStats.length === 0 && (
          <div className="py-20 text-center animate-reveal">
            <p className="text-gray-400 text-xl font-bold italic">No categories match your search...</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- CARD SUB-COMPONENT ---
const CategoryCard = ({ stat, index, navigate }: { stat: CategoryStat, index: number, navigate: any }) => {
  const [hasError, setHasError] = useState(false);
  
  // Use the category name to find metadata/icons
  const meta = categoryMeta[stat.name];
  const Icon = meta?.icon || Search;
  const displayImage = stat.categoryImage || meta?.image;

  // IMPORTANT: Navigate using the ID so the services list can filter correctly
  // but keep the URL friendly by using the slug of the name
  const catSlug = stat.name.toLowerCase().replace(/\s+/g, '-');

  return (
    <div
      onClick={() => navigate(`/categories/${catSlug}`, { state: { categoryId: stat._id } })}
      className="group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden cursor-pointer bg-gray-100 animate-reveal hover:shadow-2xl transition-all duration-500"
      style={{ 
        opacity: 0, 
        animationDelay: `${0.1 * (index % 8)}s` 
      }}
    >
      {/* IMAGE HANDLING */}
      {displayImage && !hasError ? (
        <img
          src={displayImage}
          onError={() => setHasError(true)}
          alt={stat.name}
          className="absolute inset-0 w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-out"
        />
      ) : (
        <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
          <ImageOff className="text-slate-400" size={32} />
        </div>
      )}

      {/* OVERLAYS */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

      {/* TEXT & ICON */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <div className="mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 group-hover:bg-blue-600 transition-all">
                <Icon className="text-white w-6 h-6" />
            </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-3xl font-black text-white leading-[0.9] tracking-tighter">
            {stat.name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest group-hover:text-white transition-colors">
              {stat.count} Specialties
            </p>
            <ArrowRight className="text-white w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;