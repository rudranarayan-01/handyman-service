import React from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../data/Categories';
import { ChevronRight, Search } from 'lucide-react';

const CategoriesPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-12 px-6 mt-10">
            <div className="max-w-6xl mx-auto">

                {/* Header Section */}
                <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="max-w-xl">
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                            What do you <span className="text-blue-600 font-black">need help</span> with?
                        </h1>
                        <p className="text-gray-500 font-medium mt-2">Choose a category to see available experts.</p>
                    </div>

                    <div className="relative group w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search services..."
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 bg-white shadow-sm transition-all text-sm font-semibold"
                        />
                    </div>
                </header>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => navigate(`/categories/${cat.id}`)}
                            className="group relative h-64 w-full rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-2xl  transition-all duration-500"
                        >
                            {/* Background Image */}
                            <img
                                src={cat.image}
                                alt={cat.name}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />

                            {/* Dark Gradient Overlay for Readability */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent group-hover:from-blue-900/90 transition-colors ease-in-out duration-500" />

                            {/* Content Box */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-end items-start text-white">
                                <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl mb-4 group-hover:bg-black group-hover:text-blue-600 transition-all duration-300">
                                    <cat.icon className="w-6 h-6 text-white hover:text-black stroke-[2.5px]" />
                                </div>

                                <h3 className="text-2xl font-black tracking-tight">{cat.name}</h3>
                                <div className="flex items-center justify-between w-full mt-1">
                                    <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">{cat.count}</p>
                                    <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all" />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Support Section */}
                <div className="mt-16 bg-[#1A1C1E] rounded-[3rem] p-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="z-10 text-center md:text-left">
                        <h2 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight">Can't find what you're looking for?</h2>
                        <p className="text-gray-400 font-medium">Our support team is available 24/7 to help you out.</p>
                    </div>
                    <button className="z-10 bg-white text-gray-100 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-50 transition-all shadow-xl active:scale-95">
                        <a href="/contact">
                            Chat with us
                        </a>
                    </button>

                    {/* Abstract Background Element */}
                    <div className="absolute -right-10 -bottom-10 w-94 h-64 bg-blue-600/50 blur-[100px] rounded-full" />
                </div>

            </div>
        </div>
    );
};

export default CategoriesPage;