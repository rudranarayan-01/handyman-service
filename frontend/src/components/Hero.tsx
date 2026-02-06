import { categories } from "@/data/HeroDisplayCategories";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
// import { categories } from '../data/categories';

const HeroSection = () => {
    return (
        <section className="relative pt-24 md:pt-32 pb-16 px-6 bg-[#f9fafb] overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-blue-50/50 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">

                {/* Left Content: Text & Search */}
                <div className="flex flex-col space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-[1.1] tracking-tighter uppercase">
                            Services at Your <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500">
                                Doorstep, Instantly
                            </span>
                        </h1>
                        <p className="text-xl text-gray-500 font-medium max-w-md leading-relaxed">
                            Trusted by millions, flawless doorstep comfort delivered instantly every time.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative max-w-lg group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for 'Car wash service'..."
                            className="w-full pl-12 pr-4 py-5 bg-white border-2 border-gray-100 rounded-2xl shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-lg font-medium"
                        />
                    </div>

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
                                    <img
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
                            <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-500/20">
                                Explore
                            </button>
                            </Link>
                        </div>
                    
                </div>
            </div>
        </section>
    );
};

export default HeroSection;