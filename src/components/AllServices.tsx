import { useParams, Link } from 'react-router-dom';
import { Star, Plus, ChevronLeft, ShoppingCart, ShieldCheck, Info } from 'lucide-react';
import { applianceServices } from '@/data/Service';

const AllServices = () => {
    const { categoryId } = useParams();

    const filteredServices = applianceServices.filter(
        (service) => service.category === categoryId
    );

    const pageTitle = categoryId?.replace(/-/g, ' ');

    return (
        <div className="min-h-screen bg-[#F9FBFF] pb-20">
            {/* Sticky Header */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 font-bold text-gray-800 hover:text-blue-600 transition-all">
                        <ChevronLeft className="w-5 h-5" />
                        <span className="hidden sm:inline">Back to Categories</span>
                    </Link>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-6 mt-10">
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-3">
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Verified Professional Services</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 capitalize tracking-tighter">
                        {pageTitle}
                    </h1>
                    <p className="text-gray-500 mt-4 max-w-lg font-medium">
                        Book top-rated professionals for your home needs. Transparent pricing with 30-day post-service guarantee.
                    </p>
                </div>

                {/* 2. UPDATED GRID: Ab hum filteredServices par loop chalayenge */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredServices.length > 0 ? (
                        filteredServices.map((service, index) => (
                            <div
                                key={`${service.id}-${index}`}
                                className="group bg-white rounded-[2.5rem] border border-gray-100 p-5 flex flex-col sm:flex-row gap-6 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300"
                            >
                                {/* Service Image Container */}
                                <div className="relative w-full sm:w-44 h-44 rounded-[2rem] overflow-hidden bg-gray-50 flex-shrink-0 shadow-inner">
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                        <span className="text-[10px] font-black text-gray-900">{service.rating}</span>
                                    </div>
                                </div>

                                {/* Service Info */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-extrabold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                                                {service.title}
                                            </h3>
                                            <Info className="w-4 h-4 text-gray-300 hover:text-blue-500 cursor-pointer" />
                                        </div>
                                        <p className="text-xs font-bold text-gray-400 tracking-wide uppercase mb-3">
                                            {service.reviews} Bookings done
                                        </p>
                                        <ul className="space-y-1">
                                            <li className="text-xs text-gray-500 flex items-center gap-2 italic">
                                                <div className="w-1 h-1 bg-gray-300 rounded-full" /> Genuine spare parts used
                                            </li>
                                            <li className="text-xs text-gray-500 flex items-center gap-2 italic">
                                                <div className="w-1 h-1 bg-gray-300 rounded-full" /> 30-day warranty included
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Pricing & Add to Cart */}
                                    <div className="flex items-center justify-between mt-6">
                                        <div>
                                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block">Starts from</span>
                                            <span className="text-2xl font-black text-gray-900">₹{service.price}</span>
                                        </div>

                                        <button className="flex items-center gap-2 bg-white border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.15em] hover:bg-blue-600 hover:text-white transition-all shadow-lg shadow-blue-500/10 active:scale-95">
                                            Add <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <h2 className="text-2xl font-bold text-gray-400">No services found for "{pageTitle}"</h2>
                        </div>
                    )}
                </div>
            </main>

            {/* Floating Cart UI */}
            {/* ... (Wahi rahega jo aapka code tha) ... */}
        </div>
    );
};

export default AllServices;