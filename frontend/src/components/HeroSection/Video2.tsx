import { useRef, useState, useEffect } from 'react';
import { PlayCircle, Sparkles, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';

const SecondVideoFeature = () => {
  const navigate = useNavigate();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Simple Intersection Observer to trigger entrance animation once
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative py-12 sm:py-24 lg:py-32 bg-[#f8f9fb] overflow-hidden"
    >
      {/* Static Background Decoration */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute -top-[10%] -right-[5%] w-[40vw] h-[40vw] bg-blue-200/20 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* VIDEO CONTAINER SIDE */}
          <div className={`relative order-2 lg:order-1 w-full max-w-[400px] lg:max-w-[460px] mx-auto transition-all duration-1000 ease-out transform-gpu ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {!isVideoLoaded && (
              <div className="absolute inset-2 z-20 rounded-[2.5rem] lg:rounded-[3.5rem] bg-slate-200 animate-pulse flex flex-col items-center justify-center border-white border-[8px]">
                <PlayCircle className="text-slate-400 w-10 h-10 mb-2 opacity-30" />
                <span className="text-[10px] uppercase tracking-tighter text-slate-400 font-bold opacity-40">Loading Video...</span>
              </div>
            )}

            <div className="relative group p-2">
              {/* Outer Shadow Glow */}
              <div className="absolute inset-4 bg-blue-500/10 blur-3xl rounded-full group-hover:bg-blue-500/20 transition-colors duration-700" />
              
              {/* Main Video Wrapper */}
              <div className="relative rounded-[2.5rem] sm:rounded-[3rem] lg:rounded-[3.5rem] overflow-hidden shadow-2xl border-[6px] sm:border-[10px] border-white bg-white z-10 isolate transform-gpu transition-transform duration-500 group-hover:scale-[1.01]">
                <div className="overflow-hidden rounded-[2.2rem] lg:rounded-[3.2rem]">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    onLoadedData={() => setIsVideoLoaded(true)}
                    className="w-full aspect-[4/5] object-cover contrast-[1.05] brightness-[1.05]"
                  >
                    <source src="https://res.cloudinary.com/dnz67rxu0/video/upload/v1773424956/6197558_ij7xyf.mp4" type="video/mp4" />
                  </video>
                </div>

                <div className="absolute top-4 right-4 p-2.5 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 z-20">
                  <Sparkles className="animate-spin-slow text-white shadow-sm" size={18} />
                </div>
              </div>

              {/* FLOATING CARD */}
              <div className={`absolute -bottom-4 -right-4 sm:-bottom-8 sm:-right-8 bg-white/95 backdrop-blur-sm p-4 sm:p-5 rounded-[1.8rem] shadow-[0_15px_40px_rgba(0,0,0,0.1)] flex items-center gap-4 border border-slate-50 z-30 transition-all duration-700 delay-300 transform-gpu ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                <div className="flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <ShieldCheck size={28} />
                </div>
                <div className="pr-4">
                  <p className="text-[10px] font-black tracking-[0.1em] text-blue-600 uppercase mb-0.5">Trust</p>
                  <p className="font-extrabold text-slate-900 text-xs sm:text-base whitespace-nowrap">Pro-Shield</p>
                </div>
              </div>
            </div>
          </div>

          {/* TEXT SIDE */}
          <div className={`space-y-8 order-1 lg:order-2 text-center lg:text-left px-2 transition-all duration-1000 delay-100 transform-gpu ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2.5 px-5 py-2 bg-white rounded-full shadow-sm border border-slate-100">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-ping" />
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">Premium Hygiene</span>
            </div>

            <h2 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-black text-slate-900 tracking-tighter leading-[0.85]">
              Cleanliness <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">Redefined.</span>
            </h2>

            <p className="text-base sm:text-lg lg:text-xl text-slate-500 font-medium leading-relaxed max-w-md mx-auto lg:mx-0">
              Medical-grade hygiene meets luxury hospitality. We don't just clean; <span className="text-slate-900 font-bold">we care for your well-being.</span>
            </p>

            <div className="flex justify-center lg:justify-start gap-12 pt-2">
              {[
                { label: 'Fast Arrival', val: '30m' },
                { label: 'Top Rating', val: '5.0' }
              ].map((stat, i) => (
                <div key={i} className="group">
                  <p className="text-3xl sm:text-4xl font-black text-slate-900 group-hover:text-blue-600 transition-colors duration-300">{stat.val}</p>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="pt-6">
              <Button onClick={()=>navigate('/categories')} className="group relative px-10 py-5 bg-slate-900 rounded-2xl overflow-hidden transition-all active:scale-95 shadow-xl shadow-slate-200 border-none">
                <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative flex items-center gap-3 text-white font-black uppercase tracking-widest text-[11px]">
                  Book Service 
                  <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .animate-spin-slow { animation: spin 12s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
};

export default SecondVideoFeature;