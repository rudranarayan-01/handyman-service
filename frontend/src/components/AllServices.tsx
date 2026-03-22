import { useEffect, useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Star, ShieldCheck, Loader2, Clock, ChevronRight} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import api from '@/api/api';
import BackNavigation from './BackNavigation';

/* ---------------- TYPES ---------------- */
interface Service {
    _id?: string;
    id?: string;
    name: string;
    slug?: string;
    image?: string;
    rating?: number;
    duration?: string;
    description?: string;
    basePrice?: number;
    variants?: { price: number }[];
}

/* ---------------- UTILS ---------------- */
const generateSlug = (name: string) =>
    name?.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

const optimizeCloudinary = (url?: string) => {
    if (!url) return '/placeholder-service.jpg';
    if (!url.includes('cloudinary')) return url;

    return url.replace('/upload/', '/upload/f_auto,q_auto,w_400/');
};

/* ---------------- COMPONENT ---------------- */
const AllServices = () => {
    const { categorySlug } = useParams<{ categorySlug: string }>();
    const navigate = useNavigate();
    const { cartItems, totalAmount } = useCart();

    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const pageTitle = useMemo(
        () => categorySlug?.replace(/-/g, ' ') || 'Services',
        [categorySlug]
    );

    /* ---------------- FETCH ---------------- */
    useEffect(() => {
        if (!categorySlug) return;

        const fetchServices = async () => {
            setLoading(true);
            setError(false);

            try {
                const res = await api.get(`/services/category/slug/${categorySlug}`);

                const data =
                    res?.data?.services ||
                    res?.data?.data ||
                    (Array.isArray(res.data) ? res.data : []);

                setServices(data);
            } catch (err) {
                console.error('Service Fetch Error:', err);
                setError(true);
                setServices([]);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, [categorySlug]);

    /* ---------------- HANDLERS ---------------- */
    const handleViewDetails = (service: Service) => {
        const slug = service.slug || generateSlug(service.name);
        navigate(`/service/detail/${slug}`);
    };

    /* ---------------- UI ---------------- */
    return (
        <div className="min-h-screen bg-[#F9FBFF] pb-32 mt-20 font-sans">
            <Helmet>
                <title>{`Best ${pageTitle} Services | HouseXpertz`}</title>
                <meta
                    name="description"
                    content={`Book professional ${pageTitle} services with verified experts and transparent pricing.`}
                />
                <link
                    rel="canonical"
                    href={`${window.location.origin}/services/${categorySlug}`}
                />
            </Helmet>

            <BackNavigation />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                {/* HEADER */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                            Verified Services
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 capitalize leading-tight">
                        {pageTitle}
                    </h1>

                    <p className="mt-3 text-gray-500 max-w-lg text-sm sm:text-base">
                        Discover top-rated {pageTitle} tailored for your home.
                    </p>
                </motion.header>

                {/* LOADING */}
                {loading && (
                    <div className="flex flex-col items-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                        <p className="text-gray-400 mt-4 text-sm">Loading services...</p>
                    </div>
                )}

                {/* ERROR */}
                {!loading && error && (
                    <div className="text-center py-20">
                        <p className="text-red-500 font-semibold">Failed to load services</p>
                    </div>
                )}

                {/* SERVICES GRID */}
                {!loading && !error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6"
                    >
                        <AnimatePresence>
                            {services.length > 0 ? (
                                services.map((service, index) => {
                                    const price =
                                        service.basePrice ||
                                        service.variants?.[0]?.price ||
                                        0;

                                    return (
                                        <motion.button
                                            key={service._id || service.id}
                                            onClick={() => handleViewDetails(service)}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="text-left group bg-white rounded-3xl border p-4 sm:p-5 flex gap-4 hover:shadow-lg transition-all"
                                        >
                                            {/* IMAGE */}
                                            <img
                                                src={optimizeCloudinary(service.image)}
                                                alt={service.name}
                                                className="w-28 h-28 sm:w-36 sm:h-36 object-cover rounded-2xl"
                                                loading="lazy"
                                            />

                                            {/* CONTENT */}
                                            <div className="flex flex-col justify-between flex-1">
                                                <div>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                                        {service.rating || 4.9}
                                                        <Clock className="w-3 h-3 ml-2" />
                                                        {service.duration || '45 min'}
                                                    </div>

                                                    <h2 className="text-lg sm:text-xl font-bold mt-1 group-hover:text-blue-600">
                                                        {service.name}
                                                    </h2>

                                                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                                        {service.description ||
                                                            'Professional verified service.'}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between mt-3">
                                                    <span className="text-blue-600 text-sm font-semibold flex items-center gap-1">
                                                        View <ChevronRight size={14} />
                                                    </span>

                                                    <span className="font-bold text-gray-900">
                                                        ₹{price}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.button>
                                    );
                                })
                            ) : (
                                <div className="col-span-full text-center py-20">
                                    <p className="text-gray-400">No services found</p>
                                    <Link to="/categories" className="text-blue-600 underline">
                                        Browse categories
                                    </Link>
                                </div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </main>

            {/* CART */}
            <AnimatePresence>
                {cartItems.length > 0 && (
                    <motion.div
                        initial={{ y: 100, x: '-50%' }}
                        animate={{ y: 0, x: '-50%' }}
                        exit={{ y: 100, x: '-50%' }}
                        className="fixed bottom-5 left-1/2 w-[95%] max-w-md"
                    >
                        <div className="bg-black text-white rounded-2xl p-4 flex justify-between items-center shadow-lg">
                            <div>
                                <p className="font-bold">₹{totalAmount}</p>
                                <p className="text-xs text-gray-400">
                                    {cartItems.length} items
                                </p>
                            </div>

                            <Link
                                to="/shopping-cart"
                                className="bg-blue-600 px-4 py-2 rounded-lg text-sm"
                            >
                                Checkout
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AllServices;