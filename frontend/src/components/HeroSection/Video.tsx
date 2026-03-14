import { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Star, Zap } from 'lucide-react';

const HeroVideo = () => {
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        // Trigger entrance animations immediately on mount
        setIsVisible(true);
        
        // Speed hack: If the video is already in cache, fire loaded state
        if (videoRef.current?.readyState === 4) {
            setIsVideoLoaded(true);
        }
    }, []);

    return (
        <section className="relative min-h-[90vh] flex items-center bg-slate-50 overflow-hidden px-4 py-20 pb-0 md:px-12">
            {/* Static Background Blur - No animation for performance */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[120px] -z-10" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                {/* LEFT SIDE: CONTENT */}
                <div className={`space-y-8 text-center lg:text-left transition-all duration-1000 ease-out transform-gpu ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full font-bold text-sm">
                        <Zap size={16} fill="currentColor" className="animate-pulse" />
                        <span>Top Rated Home Services in Mumbai</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[0.95]">
                        We handle the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">
                            Dirty Work.
                        </span>
                    </h1>

                    <p className="text-lg text-slate-600 font-medium max-w-lg mx-auto lg:mx-0">
                        Professional home maintenance and cleaning services delivered to your doorstep within 60 minutes.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" loading="lazy" />
                                </div>
                            ))}
                            <div className="pl-6 flex flex-col justify-center">
                                <div className="flex text-amber-500">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                </div>
                                <span className="text-xs font-bold text-slate-500">500+ Happy Clients</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: VIDEO CARD */}
                <div className={`relative transition-all duration-1000 delay-200 ease-out transform-gpu ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                    
                    {/* Video Loading Skeleton */}
                    {!isVideoLoaded && (
                        <div className="absolute inset-0 z-20 rounded-[2rem] md:rounded-[3rem] bg-slate-200 animate-pulse flex items-center justify-center border-[6px] md:border-[8px] border-white">
                             <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}

                    <div className="relative z-10 aspect-video w-full max-w-[650px] mx-auto rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] bg-slate-200 border-[6px] md:border-[8px] border-white transform-gpu">
                        <video
                            ref={videoRef}
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="metadata"
                            onLoadedData={() => setIsVideoLoaded(true)}
                            className={`w-full h-full object-cover scale-105 transition-opacity duration-700 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <source src="https://res.cloudinary.com/dnz67rxu0/video/upload/v1773420604/7641515-uhd_4096_2160_25fps_yzdmep.mp4" type="video/mp4" />
                        </video>

                        {/* Video Overlay */}
                        <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 p-4 md:p-6 bg-black/20 backdrop-blur-md rounded-[1.5rem] md:rounded-[2rem] border border-white/20 text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                                    <ShieldCheck size={18} className="md:size-5" />
                                </div>
                                <div>
                                    <p className="text-[8px] md:text-[10px] uppercase font-black tracking-widest opacity-80">Verified Expert</p>
                                    <p className="font-bold text-xs md:text-sm">Deep Cleaning in Progress...</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating badge 1 (Rating) - CSS Animation only */}
                    <div className="absolute -top-4 -right-2 md:-top-6 md:-right-6 z-20 bg-white p-3 md:p-4 rounded-2xl md:rounded-3xl shadow-xl flex items-center gap-3 animate-float-slow">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-100 text-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center">
                            <Star size={18} fill="currentColor" />
                        </div>
                        <div className="pr-2 text-left">
                            <p className="text-xs font-black text-slate-900 leading-tight">4.9/5 Rating</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Certified Quality</p>
                        </div>
                    </div>

                    {/* Floating badge 2 (Insured) - CSS Animation only */}
                    <div className="absolute -bottom-6 -left-2 md:-bottom-8 md:-left-8 z-20 bg-white p-3 md:p-4 rounded-2xl md:rounded-3xl shadow-xl flex items-center gap-3 animate-float-delayed">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-100 text-emerald-600 rounded-xl md:rounded-2xl flex items-center justify-center">
                            <ShieldCheck size={18} />
                        </div>
                        <div className="pr-2 text-left">
                            <p className="text-xs font-black text-slate-900 leading-tight">Fully Insured</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Safe & Secure</p>
                        </div>
                    </div>
                </div>

            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float-slow { animation: float 4s ease-in-out infinite; }
                .animate-float-delayed { animation: float 5s ease-in-out infinite 1s; }
            `}</style>
        </section>
    );
};

export default HeroVideo;