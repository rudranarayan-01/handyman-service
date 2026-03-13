import { motion } from 'framer-motion';
import { Play, ShieldCheck, Star, Zap } from 'lucide-react';

const HeroVideo = () => {
    return (
        <section className="relative min-h-[90vh] flex items-center bg-slate-50 overflow-hidden px-4 py-20 pb-0 md:px-12">
            {/* Decorative Background Blur */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[120px] -z-10" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                {/* LEFT SIDE: CONTENT */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-8 text-center lg:text-left"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full font-bold text-sm">
                        <Zap size={16} fill="currentColor" />
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
                                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" />
                                </div>
                            ))}
                            <div className="pl-6 flex flex-col justify-center">
                                <div className="flex text-amber-500">
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                </div>
                                <span className="text-xs font-bold text-slate-500">500+ Happy Clients</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* RIGHT SIDE: ANIMATED VIDEO CARD */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative"
                >
                    {/* Main Video Container - Changed to aspect-video for your wide 4K clip */}
                    <div className="relative z-10 aspect-video w-full max-w-[650px] mx-auto rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] bg-slate-200 border-[6px] md:border-[8px] border-white">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover scale-105" // Slight scale to hide edge artifacts
                        >
                            <source src="https://res.cloudinary.com/dnz67rxu0/video/upload/v1773420604/7641515-uhd_4096_2160_25fps_yzdmep.mp4" type="video/mp4" />
                        </video>

                        {/* Video Overlay Info */}
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

                    {/* Floating badge 1 (Rating) */}
                    <motion.div
                        animate={{ y: [0, -12, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-4 -right-2 md:-top-6 md:-right-6 z-20 bg-white p-3 md:p-4 rounded-2xl md:rounded-3xl shadow-xl flex items-center gap-3"
                    >
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-100 text-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center">
                            <Star size={18} fill="currentColor" />
                        </div>
                        <div className="pr-2">
                            <p className="text-xs font-black text-slate-900 leading-tight">4.9/5 Rating</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Certified Quality</p>
                        </div>
                    </motion.div>

                    {/* Floating badge 2 (Insured) */}
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute -bottom-6 -left-2 md:-bottom-8 md:-left-8 z-20 bg-white p-3 md:p-4 rounded-2xl md:rounded-3xl shadow-xl flex items-center gap-3"
                    >
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-100 text-emerald-600 rounded-xl md:rounded-2xl flex items-center justify-center">
                            <ShieldCheck size={18} />
                        </div>
                        <div className="pr-2">
                            <p className="text-xs font-black text-slate-900 leading-tight">Fully Insured</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Safe & Secure</p>
                        </div>
                    </motion.div>
                </motion.div>

            </div>
        </section>
    );
};

export default HeroVideo;