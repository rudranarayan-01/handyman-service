import { MessageSquare, Star, ArrowRight, ShieldCheck, Clock, Award, Quote } from 'lucide-react';

const HousexpertzBlog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "5 Signs Your Home Needs Professional Maintenance",
      excerpt: "Ignoring minor leaks or cracks can lead to expensive repairs. From electrical surges to damp walls, here is what to look for before it's too late.",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800",
      date: "Mar 9, 2026",
      category: "Maintenance"
    },
    {
      id: 2,
      title: "Transforming Your Space: Housexpertz Success Stories",
      excerpt: "See how our experts turned a cluttered living area into a modern sanctuary in just 48 hours. Real transformations for real homes.",
      image: "https://images.unsplash.com/photo-1503387762-592dea58ef21?auto=format&fit=crop&q=80&w=800",
      date: "Mar 2, 2026",
      category: "Success Stories"
    }
  ];

  return (
    <div className="bg-white min-h-screen font-sans overflow-x-hidden mt-20">
      {/* --- HERO SECTION --- 
          We keep the background full-width but center the text content.
      */}
      <header className="bg-black text-white py-16 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Housexpertz Insights</h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Expert tips, home care guides, and our journey in redefining professional service in India.
          </p>
        </div>
      </header>

      {/* --- MAIN CONTENT CONTAINER --- 
          This is what aligns the page with your other screenshots.
      */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 pb-20">
        
        {/* --- WHAT WE OFFER --- */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">What We Offer</h2>
            <div className="h-1 w-20 bg-blue-600 mx-auto mt-4 rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <ShieldCheck className="w-8 h-8 text-blue-600" />, title: "Verified Experts", desc: "Rigorous background checks for your complete peace of mind." },
              { icon: <Clock className="w-8 h-8 text-blue-600" />, title: "Instant Booking", desc: "Schedule a professional in under 60 seconds." },
              { icon: <Award className="w-8 h-8 text-blue-600" />, title: "Quality Guaranteed", desc: "60-day rework warranty on all major services." },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:bg-white hover:shadow-lg transition-all duration-300">
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- BLOG & REVIEWS GRID --- */}
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Articles Column */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="text-blue-600" size={24} /> Recent Articles
            </h2>
            {blogPosts.map((post) => (
              <article key={post.id} className="group bg-white rounded-xl overflow-hidden border border-gray-200 flex flex-col md:flex-row hover:border-blue-300 transition-colors">
                <div className="md:w-56 h-48 md:h-auto overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 flex-1">
                  <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">{post.category}</span>
                  <h3 className="text-xl font-bold mt-2 mb-3 leading-tight">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs text-gray-400 font-medium">{post.date}</span>
                    <button className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                      Read Full Story <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Sidebar Column */}
          <aside className="space-y-8">
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <h3 className="text-lg font-bold mb-4 text-blue-900 flex items-center gap-2">
                <Star className="text-yellow-500 fill-yellow-500" size={18} /> Verified Reviews
              </h3>
              <div className="space-y-6">
                {[
                  { name: "Anil K.", text: "Housexpertz sent a plumber within 2 hours. Very professional and tidy work!" },
                  { name: "Meera V.", text: "The deep cleaning service was amazing. My home feels brand new." }
                ].map((rev, i) => (
                  <div key={i} className="relative pl-4 border-l-2 border-blue-200">
                    <p className="text-sm text-gray-700 italic mb-1">"{rev.text}"</p>
                    <p className="text-xs font-bold text-blue-800">— {rev.name}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-900 text-white p-6 rounded-2xl">
              <h3 className="font-bold mb-2 italic">Need immediate help?</h3>
              <p className="text-sm text-gray-400 mb-4">Our support team is available 24/7 for emergency repairs.</p>
              <button className="w-full bg-blue-600 py-2 rounded-lg text-sm font-bold">Contact Support</button>
            </div>
          </aside>
        </div>

        {/* --- DIRECTOR'S MESSAGE --- */}
        <section className="relative bg-gray-50 rounded-2xl p-8 md:p-12 overflow-hidden">
          <Quote className="absolute top-4 right-4 text-blue-100 w-24 h-24" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400" alt="Director" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-4">Director's Vision</h2>
              <p className="text-gray-700 leading-relaxed mb-4 italic">
                "Our goal at Housexpertz is to eliminate the 'search and struggle' of finding reliable home help. We don't just provide services; we provide peace of mind and professional excellence right at your doorstep."
              </p>
              <p className="font-bold text-gray-900">Vikram Aditya Singh</p>
              <p className="text-blue-600 text-sm font-medium">Founder & Director, Housexpertz</p>
            </div>
          </div>
        </section>

        {/* --- BEST MOMENTS --- */}
        <section>
          <h2 className="text-2xl font-bold mb-8">Best Moments in Service</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden shadow-sm group relative">
                <img 
                  src={`https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400&sig=${i}`} 
                  alt="Service Moment" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                />
                <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-transparent transition-colors"></div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* --- FOOTER CTA --- */}
      <section className="bg-gray-100 border-t border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Join the Housexpertz Family</h2>
          <p className="text-gray-500 mb-6 text-sm">Subscribe for monthly tips on keeping your home in top shape.</p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input type="email" placeholder="Email address" className="flex-1 px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500" />
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">Join Now</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HousexpertzBlog;