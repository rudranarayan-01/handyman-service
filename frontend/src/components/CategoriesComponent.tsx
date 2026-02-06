import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/api';
import { Search } from 'lucide-react';
import { categoryMeta } from '@/constants/categories';

const CategoryPage = () => {
  const navigate = useNavigate();
  const [allServices, setAllServices] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch data to get service counts
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Tip: Ensure your backend route returns all services or counts
        const res = await api.get('/services'); 
        setAllServices(res.data);
      } catch (err) {
        console.error("Error fetching services for count:", err);
      }
    };
    fetchAllData();
  }, []);

  // Filter categories based on search
  const categoriesList = Object.keys(categoryMeta).filter(cat => 
    cat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white mt-10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header Section */}
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search categories..." 
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoriesList.map((catName) => {
            const meta = categoryMeta[catName];
            
            // 1. Create Slug: "Appliance Repair" -> "appliance-repair"
            const catSlug = catName.toLowerCase().replace(/\s+/g, '-');
            
            // 2. Real count logic
            const serviceCount = allServices.filter(s => s.category === catName).length;

            return (
              <div 
                key={catName}
                // FIXED: Using catSlug here
                onClick={() => navigate(`/categories/${catSlug}`)}
                className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                {/* Background Image */}
                <img 
                  src={meta.image} 
                  alt={catName} 
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Dark Overlay Gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent transition-opacity group-hover:opacity-90" />

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                    <meta.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-white leading-tight mb-1">
                    {catName}
                  </h3>
                  <p className="text-sm font-bold text-gray-300 uppercase tracking-widest">
                    {serviceCount} Services Available
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Banner */}
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