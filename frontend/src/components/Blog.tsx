import { Clock, ArrowRight, Quote, CheckCircle } from 'lucide-react';

const BlogPage = () => {
  const featuredPost = {
    title: "The Ultimate Guide to Seasonal Home Maintenance in India",
    excerpt: "From monsoon-proofing your walls to AC servicing before peak summer, here is everything you need to know to keep your home running smoothly.",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200",
    category: "Must Read",
    readTime: "12 min read",
    date: "Feb 10, 2026"
  };

  const blogPosts = [
    {
      id: 1,
      title: "How to Choose the Right Wall Paint for Your Living Room",
      category: "Home Decor",
      image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800",
      time: "6 min read"
    },
    {
      id: 2,
      title: "5 DIY Cleaning Hacks Using Kitchen Ingredients",
      category: "Cleaning",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
      time: "4 min read"
    },
    {
      id: 3,
      title: "Understanding RO Water Purifier Servicing",
      category: "Maintenance",
      image: "https://images.unsplash.com/photo-1585837500582-4462615456f9?auto=format&fit=crop&q=80&w=800",
      time: "7 min read"
    },
    {
      id: 4,
      title: "Why Professional Sofa Cleaning is Better than DIY",
      category: "Expert Advice",
      image: "https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?auto=format&fit=crop&q=80&w=800",
      time: "5 min read"
    }
  ];

  const customerStories = [
    {
      id: 1,
      name: "Sneha Kapoor",
      location: "Gurugram",
      story: "My sofa looked beyond repair after my toddler's birthday party. The UC professional spent 3 hours and now it looks brand new. Truly life-saving!",
      service: "Deep Sofa Cleaning",
      avatar: "https://i.pravatar.cc/150?u=sneha"
    },
    {
      id: 2,
      name: "Rahul Mehra",
      location: "Mumbai",
      story: "Getting my AC serviced was always a hassle until I tried UC. Transparent pricing and no hidden mess. Highly recommend their subscription.",
      service: "AC Power Jet Service",
      avatar: "https://i.pravatar.cc/150?u=rahul"
    },
    {
      id: 1,
      name: "Sneha Kapoor",
      location: "Gurugram",
      story: "My sofa looked beyond repair after my toddler's birthday party. The UC professional spent 3 hours and now it looks brand new. Truly life-saving!",
      service: "Deep Sofa Cleaning",
      avatar: "https://i.pravatar.cc/150?u=sneha"
    },
    {
      id: 2,
      name: "Rahul Mehra",
      location: "Mumbai",
      story: "Getting my AC serviced was always a hassle until I tried UC. Transparent pricing and no hidden mess. Highly recommend their subscription.",
      service: "AC Power Jet Service",
      avatar: "https://i.pravatar.cc/150?u=rahul"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20 font-sans mt-10">
      {/* 1. Clean Header (No Search) */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 text-center md:text-left">
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter">The UC Blog</h1>
        <p className="text-slate-500 font-medium mt-3 text-lg">Expert tips and real stories from your neighborhood.</p>
        
        {/* Categories Bar */}
        <div className="flex gap-4 mt-12 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
          {['All Stories', 'Home Decor', 'Maintenance', 'Cleaning', 'Safety', 'Expert Tips'].map((cat, i) => (
            <button key={i} className={`whitespace-nowrap px-8 py-3 rounded-2xl font-bold text-sm transition-all ${i === 0 ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'bg-white border-2 border-slate-100 text-slate-500 hover:border-indigo-500 hover:text-indigo-600'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Featured Post (Hero) */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <div className="relative group cursor-pointer overflow-hidden rounded-[3.5rem] bg-slate-900 min-h-[550px] flex flex-col justify-end p-8 md:p-20 shadow-2xl shadow-slate-200">
          <img 
            src={featuredPost.image} 
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[1.5s]"
            alt="Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
          
          <div className="relative z-10 max-w-3xl">
            <span className="bg-indigo-600 text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] mb-8 inline-block">
              {featuredPost.category}
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-8 tracking-tighter">
              {featuredPost.title}
            </h2>
            <div className="flex items-center gap-6 text-white/90 font-bold text-sm">
              <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20"><Clock size={16}/> {featuredPost.readTime}</span>
              <button className="flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-2xl hover:bg-indigo-50 transition-all font-black group">
                Read Full Guide <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform"/>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Article Grid */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <h3 className="text-3xl font-black text-slate-900 mb-12 flex items-center gap-3">
          Latest Insights <div className="h-1 w-20 bg-indigo-600 rounded-full"></div>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {blogPosts.map((post) => (
            <div key={post.id} className="group cursor-pointer">
              <div className="relative h-64 w-full rounded-[2.5rem] overflow-hidden mb-6 shadow-lg">
                <img 
                  src={post.image} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  alt={post.title}
                />
              </div>
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3 block">
                {post.category}
              </span>
              <h4 className="text-xl font-black text-slate-900 leading-tight mb-4 group-hover:text-indigo-600 transition-colors">
                {post.title}
              </h4>
              <div className="flex items-center gap-4 text-slate-400 text-[11px] font-bold">
                <span className="flex items-center gap-1.5"><Clock size={14}/> {post.time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FROM CUSTOMERS SECTION (Replaced Search) */}
      <section className="bg-slate-50 py-24 mb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h3 className="text-3xl font-black text-slate-900">Voices of our Community</h3>
              <p className="text-slate-500 font-medium mt-2 text-lg">Real stories from people who transformed their homes.</p>
            </div>
            <div className="hidden md:flex gap-2">
               <div className="w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-300 cursor-not-allowed italic">{"<"}</div>
               <div className="w-12 h-12 rounded-full border-2 border-slate-900 flex items-center justify-center text-slate-900 cursor-pointer hover:bg-slate-900 hover:text-white transition-all font-bold">{">"}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {customerStories.map((story) => (
              <div key={story.id} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative group hover:shadow-xl transition-all">
                <Quote className="absolute top-10 right-10 text-slate-100 group-hover:text-indigo-50 transition-colors" size={60} strokeWidth={4} />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <img src={story.avatar} alt={story.name} className="w-16 h-16 rounded-2xl object-cover ring-4 ring-slate-50" />
                    <div>
                      <h4 className="font-black text-slate-900 text-lg flex items-center gap-2">
                        {story.name} <CheckCircle size={16} className="text-green-500" />
                      </h4>
                      <p className="text-slate-400 text-sm font-bold">{story.location}</p>
                    </div>
                  </div>
                  <p className="text-slate-600 text-xl font-medium leading-relaxed italic mb-8">
                    "{story.story}"
                  </p>
                  <div className="inline-block px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest">
                    Service: {story.service}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Footer CTA */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-slate-900 rounded-[3.5rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tighter">Ready to experience 5-star service?</h2>
            <p className="text-slate-400 font-medium mb-10 text-lg">Join over 10 Million+ happy customers across the globe.</p>
            <button className="bg-indigo-600 text-white px-12 py-5 rounded-[2rem] font-black text-lg hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-500/20 active:scale-95">
              Book a Service Now
            </button>
          </div>
          {/* Background Decorative Circles */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]"></div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;