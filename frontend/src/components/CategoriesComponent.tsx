import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/api';
import { Search, Loader2 } from 'lucide-react';
import { categoryMeta } from '@/constants/categories';

interface CategoryStat {
  categoryImage: string;
  _id: string; // Category Name from DB
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
        setLoading(true);
        // Direct stats fetch kar rahe hain
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

  // Filter logic: Jo categories DB mein hain + search query se match hoti hain
  const filteredStats = stats.filter(stat =>
    stat._id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-white mt-10">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Header Section (Same as your code) */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
          <div className="max-w-2xl">
            <h1 className="text-6xl font-black text-gray-900 tracking-tighter leading-[0.9]">
              What do you <span className="text-blue-600">need help</span> with?
            </h1>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search categories..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Dynamic Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredStats.map((stat) => {
            const catName = stat._id;
            const meta = categoryMeta[catName];

            // Logic: Pehle Backend ki image check karega, agar nahi hai toh constant wali use karega
            const displayImage = stat.categoryImage || meta?.image || 'https://via.placeholder.com/400';

            const Icon = meta?.icon || Search; // Fallback icon
            const catSlug = catName.toLowerCase().replace(/\s+/g, '-');

            return (
              <div
                key={catName}
                onClick={() => navigate(`/categories/${catSlug}`)}
                className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer shadow-lg"
              >
                {/* Dynamic Background Image */}
                <img
                  src={displayImage}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt={catName}
                />

                {/* Dark Overlay - Taaki text hamesha visible rahe */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-white leading-tight mb-1">{catName}</h3>
                  <p className="text-sm font-bold text-gray-300 uppercase tracking-widest">
                    {stat.count} Services Available
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;