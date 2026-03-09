import { useState, useEffect } from 'react';
import { Clock, ArrowRight, Quote, CheckCircle, ShieldCheck, Zap, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const BlogPage = () => {
  const [activeTab, setActiveTab] = useState('All Stories');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading for Skeleton effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const featuredPost = {
    title: "The Ultimate Guide to Seasonal Home Maintenance in India",
    excerpt: "From monsoon-proofing your walls to AC servicing before peak summer, here is everything you need to know to keep your home running smoothly.",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6954?auto=format&fit=crop&q=80&w=1200",
    category: "Must Read",
    readTime: "12 min read",
  };

  const blogPosts = [
    { id: 1, title: "How to Choose the Right Wall Paint for Your Living Room", category: "Home Decor", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=600", time: "6 min read" },
    { id: 2, title: "5 DIY Cleaning Hacks Using Kitchen Ingredients", category: "Cleaning", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600", time: "4 min read" },
    { id: 3, title: "Understanding RO Water Purifier Servicing", category: "Maintenance", image: "https://images.unsplash.com/photo-1585837500582-4462615456f9?auto=format&fit=crop&q=80&w=600", time: "7 min read" },
    { id: 4, title: "Why Professional Sofa Cleaning is Better than DIY", category: "Expert Advice", image: "https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?auto=format&fit=crop&q=80&w=600", time: "5 min read" }
  ];

  const customerStories = [
    { id: 1, name: "Sneha Kapoor", location: "Gurugram", story: "My sofa looked beyond repair after my toddler's party. The Homexpertz Pro spent 3 hours and now it looks brand new.", service: "Deep Sofa Cleaning", avatar: "https://i.pravatar.cc/150?u=sneha" },
    { id: 2, name: "Rahul Mehra", location: "Mumbai", story: "Getting my AC serviced was always a hassle until I tried Homexpertz Service. Transparent pricing and no mess.", service: "AC Power Jet Service", avatar: "https://i.pravatar.cc/150?u=rahul" },
  ];

  const categories = ['All Stories', 'Home Decor', 'Maintenance', 'Cleaning', 'Safety', 'Expert Tips'];

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* 1. Header & Active Tabs */}
      <header className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-4">
            Homexpertz <span className="text-blue-600">Journal</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg md:text-xl max-w-2xl">
            Pro tips, maintenance guides, and real transformation stories from the experts you trust.
          </p>
        </motion.div>

        <div className="flex gap-3 mt-12 overflow-x-auto pb-4 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`whitespace-nowrap px-8 py-3.5 rounded-2xl font-black text-sm transition-all duration-300 ${
                activeTab === cat 
                ? 'bg-slate-900 text-white shadow-2xl shadow-slate-300 scale-105' 
                : 'bg-white border-2 border-slate-100 text-slate-500 hover:border-blue-500 hover:text-blue-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* 2. Featured Post with Skeleton */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        {isLoading ? (
          <div className="w-full h-[500px] bg-slate-100 animate-pulse rounded-[3.5rem]" />
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative group cursor-pointer overflow-hidden rounded-[3.5rem] bg-slate-900 min-h-[550px] flex flex-col justify-end p-8 md:p-20 shadow-3xl shadow-slate-200"
          >
            <img 
              src={featuredPost.image} 
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[2s] ease-out"
              alt="Featured Home Maintenance"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
            
            <div className="relative z-10 max-w-3xl">
              <span className="bg-blue-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] mb-6 inline-block">
                {featuredPost.category}
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-white leading-[1.1] mb-8 tracking-tighter">
                {featuredPost.title}
              </h2>
              <div className="flex flex-wrap items-center gap-6 text-white font-bold text-sm">
                <span className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/20">
                    <Clock size={16}/> {featuredPost.readTime}
                </span>
                <button className="flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-2xl hover:bg-blue-50 transition-all font-black group shadow-xl">
                  Read Full Guide <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform"/>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* 3. Stats Component (New) */}
      <section className="max-w-7xl mx-auto px-6 mb-24 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
            { icon: <ShieldCheck className="text-green-500" />, label: "Verified Experts", val: "5000+" },
            { icon: <Zap className="text-amber-500" />, label: "Avg. Response", val: "45 Mins" },
            { icon: <Star className="text-blue-500" />, label: "Avg. Rating", val: "4.8/5" },
            { icon: <Star className="text-blue-500" />, label: "Happy Homes", val: "1M+" },
        ].map((stat, i) => (
            <div key={i} className="bg-white border border-slate-100 p-6 rounded-[2rem] text-center shadow-sm">
                <div className="flex justify-center mb-3">{stat.icon}</div>
                <div className="text-2xl font-black text-slate-900">{stat.val}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
            </div>
        ))}
      </section>

      {/* 4. Article Grid with Skeletons */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <h3 className="text-3xl font-black text-slate-900 mb-12 flex items-center gap-4">
          Latest Insights <div className="h-1.5 w-24 bg-blue-600 rounded-full" />
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {isLoading ? [1,2,3,4].map(n => (
              <div key={n} className="space-y-4">
                  <div className="aspect-square bg-slate-100 animate-pulse rounded-[2.5rem]" />
                  <div className="h-4 w-1/2 bg-slate-100 animate-pulse rounded" />
                  <div className="h-6 w-full bg-slate-100 animate-pulse rounded" />
              </div>
          )) : blogPosts.map((post) => (
            <motion.div 
                whileHover={{ y: -10 }}
                key={post.id} 
                className="group cursor-pointer"
            >
              <div className="relative aspect-square w-full rounded-[2.5rem] overflow-hidden mb-6 shadow-xl shadow-slate-100">
                <img 
                  src={post.image} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  alt={post.title}
                  loading="lazy"
                />
              </div>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3 block">
                {post.category}
              </span>
              <h4 className="text-xl font-black text-slate-900 leading-tight mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
                {post.title}
              </h4>
              <div className="flex items-center gap-4 text-slate-400 text-[11px] font-bold uppercase tracking-tighter">
                <span className="flex items-center gap-1.5"><Clock size={14}/> {post.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. Customer Stories */}
      <section className="bg-slate-900 py-28 mb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
              <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">Voices of our Community</h3>
              <p className="text-slate-400 font-medium text-lg">Real experiences from people who trusted Homexpertz Service.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {customerStories.map((story) => (
              <div key={story.id} className="bg-slate-800/50 backdrop-blur-md p-10 rounded-[3.5rem] border border-white/5 relative group hover:bg-slate-800 transition-all">
                <Quote className="absolute top-10 right-10 text-white/5" size={80} strokeWidth={4} />
                <div className="relative z-10">
                  <div className="flex items-center gap-5 mb-8">
                    <img src={story.avatar} alt={story.name} className="w-16 h-16 rounded-2xl object-cover ring-4 ring-blue-500/20" />
                    <div>
                      <h4 className="font-black text-white text-xl flex items-center gap-2">
                        {story.name} <CheckCircle size={18} className="text-blue-400" />
                      </h4>
                      <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">{story.location}</p>
                    </div>
                  </div>
                  <p className="text-slate-200 text-xl font-medium leading-relaxed italic mb-8">
                    "{story.story}"
                  </p>
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600/10 text-blue-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]">
                    <Star size={12} /> Service: {story.service}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. High-Conversion Footer CTA */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-3xl shadow-blue-200">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter leading-none">
                Ready to make your home <br className="hidden md:block"/> smarter and cleaner?
            </h2>
            <p className="text-blue-100 font-medium mb-12 text-lg md:text-xl opacity-90">
                Book a professional Homexpertz in less than 60 seconds.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <button className="w-full md:w-auto bg-white text-blue-700 px-14 py-6 rounded-[2.5rem] font-black text-xl hover:scale-105 transition-all shadow-2xl active:scale-95">
                Book a Service Now
                </button>
                <button className="w-full md:w-auto bg-transparent border-2 border-white/30 text-white px-10 py-6 rounded-[2.5rem] font-black text-xl hover:bg-white/10 transition-all">
                View All Services
                </button>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-[120px]" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-400/20 rounded-full blur-[120px]" />
        </div>
      </div>
    </div>
  );
};

export default BlogPage;