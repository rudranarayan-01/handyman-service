import { categories } from "@/data/HeroDisplayCategories";
import { Link } from "react-router-dom";
import HeroSearch from "./HeroSearch";
import { Button } from "./ui/button";

const HeroSection = () => {
    return (
        <section className="relative pt-24 md:pt-32 pb-16 px-6 bg-[#f9fafb] overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-blue-50/50 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">

                {/* Left Content: Text & Search */}
                <div className="flex flex-col space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-3xl lg:text-6xl font-black text-gray-900 leading-[1.1] tracking-tighter uppercase">
                            Services at Your <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500">
                                Doorstep, Instantly
                            </span>
                        </h1>
                        <p className="text-xl text-gray-500 font-medium max-w-md leading-relaxed">
                            Trusted by millions, flawless doorstep comfort delivered instantly every time.
                        </p>
                    </div>

                    <HeroSearch/>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-3">
                        {['Trusted Professionals', 'No Hidden Fees', '24/7 Support'].map((tag) => (
                            <span key={tag} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2 shadow-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Right Content: Service Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

                        {categories.map((cat, index) => (
                            <div key={index} className="group flex flex-col items-center cursor-pointer">
                                <div className={`rounded-2xl w-40 h-40 mb-3 flex items-center justify-center overflow-hidden shadow-lg transition-transform transform-gpu hover:scale-105 ${cat.color}`}>
                                    <img fetchPriority="high"
                                        src={cat.image}
                                        alt={cat.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <span className="text-[13px] font-bold text-gray-700 text-center leading-tight">
                                    {cat.name}
                                </span>
                            </div>
                        ))}

                        {/* Feature Card */}
                        <div className="col-span-2 sm:col-span-3 mt-4 p-5 bg-linear-to-r from-gray-900 via-gray-800 to-black rounded-[32px] flex items-center justify-between px-8 text-white shadow-lg">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Emergency</span>
                                <span className="text-lg font-bold">Secure & Easy Booking </span>
                            </div>
                            <Link to="categories">
                            <Button className="bg-blue-600 text-white font-black px-8 py-6 text-lg rounded-2xl
  animate-pulse
  shadow-[0_0_15px_rgba(59,130,246,0.6),0_0_40px_rgba(59,130,246,0.3)]
  hover:shadow-[0_0_25px_rgba(59,130,246,0.9),0_0_60px_rgba(59,130,246,0.5)]
  hover:scale-105 active:scale-95
  transition-all duration-300
  border border-blue-400/50">Explore</Button>
                            </Link>
                        </div>
                    
                </div>
            </div>
        </section>
    );
};

export default HeroSection;