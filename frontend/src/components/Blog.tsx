import { useState } from 'react';
import { MessageSquare, Star, ArrowRight, ShieldCheck, Clock, Award, Quote, ImageOff, Mail, Sparkles, Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '@/api/api';

const HousexpertzBlog = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async () => {
    // 1. Basic Email Validation Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address."); // Or use a toast
      return;
    }

    setIsSubmitting(true);
    try {
      // Replace with your actual backend URL
      await api.post('/subscribe', { email });
      console.log("Subscription successful for:", email);
      toast.success("Welcome to the family! Check your inbox.");
      setEmail("");
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const blogPosts = [
    {
      id: 1,
      title: "5 Signs Your Home Needs Professional Maintenance",
      excerpt: "Ignoring minor leaks or cracks can lead to expensive repairs. From electrical surges to damp walls, here is what to look for before it's too late.",
      image: "https://res.cloudinary.com/dnz67rxu0/image/upload/f_auto,q_auto/v1773159003/home-maintainance.jpg",
      date: "Mar 9, 2026",
      category: "Maintenance"
    },
    {
      id: 2,
      title: "Transforming Your Space: Housexpertz Success Stories",
      excerpt: "See how our experts turned a cluttered living area into a modern sanctuary in just 48 hours. Real transformations for real homes.",
      image: "https://res.cloudinary.com/dnz67rxu0/image/upload/f_auto,q_auto/v1773155710/home-renovation.webp",
      date: "Mar 2, 2026",
      category: "Success Stories"
    },
    {
      id: 3,
      title: "Real-Life Home Rescue: 3 Emergency Fixes You Can Do Now",
      excerpt: "From a burst pipe to a power outage, learn the quick DIY fixes that can save your home and prevent further damage until the pros arrive.",
      image: "https://res.cloudinary.com/dnz67rxu0/image/upload/f_auto,q_auto/v1773163968/images_toaex8.jpg",
      date: "Mar 2, 2026",
      category: "Success Stories"
    }
  ];

  return (
    <div className="bg-white min-h-screen font-sans overflow-x-hidden selection:bg-blue-100">
      {/* NATIVE CSS ANIMATIONS */}
      <style>{`
        @keyframes reveal { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-reveal { animation: reveal 0.8s cubic-bezier(0.2, 1, 0.3, 1) forwards; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
      `}</style>

      {/* --- HERO SECTION --- */}
      <header className="bg-slate-950 text-white py-24 md:py-32 relative overflow-hidden mt-16">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -mr-24 -mt-24" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center space-y-6 animate-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em]">
              <Sparkles size={14} /> The Housexpertz Journal
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.8] mb-4">
              Insights for <br /> <span className="text-blue-500">Modern Homes.</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
              Redefining professional home care in India through expert guides and verified success stories.
            </p>
          </div>
        </div>
      </header>

      {/* --- TRUST STATS SECTION --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100">
          {[
            { label: "Happy Homes", val: "10k+" },
            { label: "Expert Partners", val: "500+" },
            { label: "Cities Covered", val: "15+" },
            { label: "Avg. Rating", val: "4.9/5" }
          ].map((stat, i) => (
            <div key={i} className="text-center space-y-1">
              <p className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">{stat.val}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32 py-24">

        {/* --- WHAT WE OFFER --- */}
        <section className="animate-reveal delay-1" style={{ opacity: 0 }}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">What We Offer</h2>
              <p className="text-slate-500 font-medium">Why thousands of families trust our experts every day.</p>
            </div>
            <div className="h-1 w-24 bg-blue-600 hidden md:block rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <ShieldCheck className="w-10 h-10 text-blue-600" />, title: "Verified Experts", desc: "Every pro undergoes a rigorous 4-step background verification." },
              { icon: <Clock className="w-10 h-10 text-blue-600" />, title: "60 Min Arrival", desc: "Emergency services reach your doorstep in under an hour." },
              { icon: <Award className="w-10 h-10 text-blue-600" />, title: "Service Warranty", desc: "A 60-day rework guarantee if you aren't 100% satisfied." },
            ].map((item, i) => (
              <div key={i} className="bg-gray-100 p-10 rounded-[2.5rem] hover:bg-white hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-slate-100 group">
                <div className="mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="text-2xl font-black mb-3 text-slate-900">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- BLOG & SIDEBAR GRID --- */}
        <div className="grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12 animate-reveal delay-2" style={{ opacity: 0 }}>
            <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4 tracking-tight">
              <MessageSquare className="text-blue-600" size={32} /> Recent Stories
            </h2>
            {blogPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          <aside className="space-y-10 animate-reveal delay-3" style={{ opacity: 0 }}>
            {/* Verified Reviews */}
            <div className="bg-gray-900 p-10 rounded-[3rem] border border-slate-800">
              <h3 className="text-xl font-black mb-8 text-slate-100 flex items-center gap-2">
                <Star className="text-yellow-500 fill-yellow-500" size={20} /> Verified Reviews
              </h3>
              <div className="space-y-10">
                {[
                  { name: "Ali Shah.", text: "Excellent service ,even though it was late at night they came and resolved my plumbering issues for my bathroom" },
                  { name: "Deepak Kumar Sharma", text: "Mr. Shiv Kukreja leads the Boys@Work team, and he was just great - he exhibited rare qualities of professionalism, realistic advice, and sincerity right from the first plumbing visit to my house by one of his boys, Mr. Satyam. After significant rains in Delhi, my roof terrace main flow pipe created back pressure, causing water to enter my apartment instead of exiting. The plumbing crew made good and logical recommendations and resolved the issue quickly. I will certainly recommend his team's professional services for other home-based endeavours. Good luck to the Boys@Work the whole team!" }
                ].map((rev, i) => (
                  <div key={i} className="relative pl-6 border-l-4 border-blue-500">
                    <p className="text-sm text-slate-300 italic mb-3 leading-relaxed font-medium">"{rev.text}"</p>
                    <p className="text-xs font-black text-blue-500 tracking-widest uppercase">— {rev.name}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Newsletter Card */}
            <div className="bg-blue-600 text-white p-10 rounded-[3rem] shadow-xl relative overflow-hidden group">
              <Mail className="absolute -right-4 -top-4 w-32 h-32 opacity-10 rotate-12" />
              <h3 className="text-2xl font-black mb-4 leading-tight">Get Home Care <br />Tips in Your Inbox</h3>
              <p className="text-blue-100 text-sm mb-8 font-medium">Join 5,000+ homeowners who get our weekly guides.</p>
              <div className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full px-6 py-4 rounded-2xl bg-white/10 border border-white/20 outline-none placeholder:text-blue-200 font-bold text-white"
                />
                <button
                  onClick={handleSubscribe}
                  disabled={isSubmitting}
                  className="w-full bg-white text-blue-600 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-50 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Joining..." : "Subscribe"}
                </button>
              </div>
            </div>

            

            {/* --- NEW: CONTACT NAVIGATION CARD --- */}
            <div
              onClick={() => navigate('/contact')}
              className="bg-slate-950 text-white p-10 rounded-[3rem] border border-blue-500/30 group cursor-pointer relative overflow-hidden transition-all hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl group-hover:bg-blue-600/20 transition-all" />
              <Headphones className="text-blue-500 mb-6 group-hover:scale-110 transition-transform" size={40} />
              <h3 className="text-2xl font-black mb-3 tracking-tight">Need Support?</h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed font-medium">
                Our team is available 24/7 for emergency repairs and service queries.
              </p>
              <div className="flex items-center gap-2 text-blue-500 font-black text-xs uppercase tracking-widest">
                Contact Experts <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </aside>
        </div>

        {/* --- DIRECTOR'S MESSAGE --- */}
        <section className="relative bg-slate-950 text-white rounded-[4rem] p-10 md:p-20 overflow-hidden shadow-2xl">
          <Quote className="absolute top-10 right-10 text-white/5 w-64 h-64 rotate-12" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
            <div className="w-56 h-56 md:w-72 md:h-72 rounded-[3.5rem] overflow-hidden border-8 border-white/5 shadow-2xl rotate-2">
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400" alt="Director" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-block px-4 py-1 rounded-full bg-blue-600/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6">Founder's Note</div>
              <p className="text-slate-300 text-2xl md:text-3xl leading-[1.3] mb-8 italic font-medium tracking-tight">
                "We don't just provide services; we provide peace of mind. Our goal is to make professional excellence accessible to every Indian home."
              </p>
              <div>
                <p className="font-black text-white text-2xl tracking-tighter">Shiv Kukreja</p>
                <p className="text-blue-500 font-bold uppercase tracking-[0.3em] text-xs">CEO & Director, Housexpertz</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

const BlogCard = ({ post }: any) => {
  const [error, setError] = useState(false);

  return (
    <article className="group bg-gray-100 rounded-[3rem] overflow-hidden border border-slate-100 flex flex-col md:flex-row hover:shadow-2xl transition-all duration-700">
      <div className="md:w-80 h-72 md:h-auto overflow-hidden bg-slate-100 relative">
        {!error ? (
          <img
            src={post.image}
            alt={post.title}
            onError={() => setError(true)}
            className="w-full h-full object-cover grayscale-30 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
            <ImageOff size={48} />
          </div>
        )}
        <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-black text-blue-600 uppercase tracking-widest">
          {post.category}
        </div>
      </div>
      <div className="p-10 md:p-14 flex-1 flex flex-col justify-center">
        <h3 className="text-3xl md:text-4xl font-black mb-6 leading-[0.9] tracking-tighter text-slate-900 group-hover:text-blue-600 transition-colors">
          {post.title}
        </h3>
        <p className="text-slate-500 text-base mb-8 leading-relaxed font-medium line-clamp-3">{post.excerpt}</p>
        <div className="flex items-center justify-between pt-8 border-t border-slate-200/50">
          <span className="text-xs text-slate-400 font-black uppercase tracking-widest">{post.date}</span>
          <button className="text-blue-600 font-black uppercase tracking-widest flex items-center gap-3 group-hover:gap-5 transition-all">
            Read Story <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default HousexpertzBlog;