import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/api';
import { Search, ArrowRight } from 'lucide-react';
import { categoryMeta } from '@/constants/categories';

// ─── TYPES ───
interface CategoryStat {
  categoryImage: string;
  _id: string; 
  count: number;
}

// ─── SKELETON COMPONENT ───
const CategorySkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="h-64 md:h-80 rounded-3xl bg-gray-100 animate-pulse flex flex-col justify-end p-8">
        <div className="w-12 h-12 rounded-2xl bg-gray-200 mb-4" />
        <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-1/2 bg-gray-200 rounded" />
      </div>
    ))}
  </div>
);

const CategoryPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<CategoryStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const res = await api.get('/services/category-stats');
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching category stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryData();
  }, []);

  // Performance: Memoize filtered results to avoid recalculation on every render
  const filteredStats = useMemo(() => {
    return stats.filter(stat =>
      stat._id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [stats, searchQuery]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20 mt-15">

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12 md:mb-16">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 tracking-tighter leading-[1.1] md:leading-[0.9]">
              What do you <br className="hidden md:block" />
              <span className="text-blue-600">need help</span> with?
            </h1>
            <p className="mt-4 text-gray-500 font-medium md:text-lg">
              Select a category to see available professional services.
            </p>
          </div>

          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors w-5 h-5" />
            <input
              type="text"
              placeholder="Search categories..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-lg"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <CategorySkeleton />
        ) : (
          <>
            {filteredStats.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {filteredStats.map((stat) => {
                  const catName = stat._id;
                  const meta = categoryMeta[catName];
                  const displayImage = stat.categoryImage || meta?.image || 'https://via.placeholder.com/400';
                  const Icon = meta?.icon || Search;
                  const catSlug = catName.toLowerCase().replace(/\s+/g, '-');

                  return (
                    <div
                      key={catName}
                      onClick={() => navigate(`/categories/${catSlug}`)}
                      className="group relative h-64 md:h-80 rounded-[2.5rem] overflow-hidden cursor-pointer bg-gray-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
                    >
                      {/* Image with Lazy Loading */}
                      <img
                        src={displayImage}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out"
                        alt={catName}
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                      {/* Content */}
                      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:rotate-[360deg] transition-all duration-500">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        
                        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <h3 className="text-xl md:text-2xl font-black text-white leading-tight mb-1">
                                {catName}
                            </h3>
                            <div className="flex items-center justify-between">
                                <p className="text-xs md:text-sm font-bold text-blue-400 uppercase tracking-widest">
                                    {stat.count} Services
                                </p>
                                <ArrowRight className="text-white w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-400 text-xl font-medium">No categories found matching "{searchQuery}"</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;