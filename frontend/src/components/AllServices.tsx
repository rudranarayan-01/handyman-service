import { useParams, Link } from 'react-router-dom';
import { Star, Plus, ChevronLeft, ShieldCheck, Info, ShoppingBag } from 'lucide-react';
import { applianceServices } from '@/data/Service';
import { useCart } from '@/context/CartContext';
import { Button } from './ui/button';

const AllServices = () => {
    const { categoryId } = useParams();
    const { addToCart, cartItems, totalAmount } = useCart();

    const filteredServices = applianceServices.filter(
        (service) => service.category === categoryId
    );

    const pageTitle = categoryId?.replace(/-/g, ' ');

    return (
        <div className="min-h-screen bg-[#F9FBFF] pb-32 mt-20 ">
            <nav className=" top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 font-bold text-gray-800 hover:text-blue-600 transition-all">
                        <ChevronLeft className="w-5 h-5" />
                        <span className="hidden sm:inline">Back to Categories</span>
                    </Link>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-6 pt-10">
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-3">
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Verified Professional Services</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 capitalize tracking-tighter">
                        {pageTitle}
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredServices.length > 0 ? (
                        filteredServices.map((service, index) => {
                            const isItemInCart = cartItems.some(item => item.id === service.id);
                            return (
                                <div key={`${service.id}-${index}`} className="group bg-white rounded-[2.5rem] border border-gray-100 p-5 flex flex-col sm:flex-row gap-6 hover:shadow-2xl transition-all duration-300">
                                    <div className="relative w-full sm:w-44 h-44 rounded-[2rem] overflow-hidden bg-gray-50 shrink-0">
                                        <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-xl font-extrabold text-gray-900 mb-2">{service.title}</h3>
                                            <p className="text-xs font-bold text-gray-400 uppercase">{service.reviews} Bookings done</p>
                                        </div>

                                        <div className="flex items-center justify-between mt-6">
                                            <div>
                                                <span className="text-[10px] font-black text-gray-300 uppercase block">Price</span>
                                                <span className="text-2xl font-black text-gray-900">₹{service.price}</span>
                                            </div>
                                            <Button
                                                onClick={() => addToCart(service)}
                                                disabled={isItemInCart}
                                                className={`rounded-2xl font-black px-8 py-6 transition-all ${isItemInCart ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'}`}
                                            >
                                                {isItemInCart ? "Added" : "Add"} <Plus className="ml-2 w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-20 text-center text-gray-400 font-bold">No services found.</div>
                    )}
                </div>
            </main>

            {/* UC STYLE STICKY BOTTOM BAR */}
            {cartItems.length > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-lg animate-in slide-in-from-bottom-10 duration-500">
                    <div className="bg-gray-900 rounded-[2.5rem] p-4 flex items-center justify-between shadow-2xl border border-white/10 backdrop-blur-lg">
                        <div className="flex items-center gap-4 pl-3">
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                                <ShoppingBag className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-white font-black text-lg leading-none">₹{totalAmount}</p>
                                <p className="text-blue-400 text-[10px] font-bold uppercase tracking-tighter">{cartItems.length} Service Added</p>
                            </div>
                        </div>
                        <Link to="/shopping-cart" className="bg-white text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all">
                            View Cart
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllServices;