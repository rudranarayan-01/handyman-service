import { useState } from 'react';
import { Utensils, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CookingPromoProps {
    title?: string;
    subtitle?: string;
    btnText?: string;
    image?: string;
    bgColor?: string;
}

const ChefImage = ({ src, alt }: { src: string; alt: string }) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className="relative w-full h-full min-h-64 md:min-h-80 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl transform-gpu">
            {!loaded && (
                <div className="absolute inset-0 bg-orange-50 animate-pulse z-10" />
            )}
            <img
                src={src}
                alt={alt}
                loading="lazy"
                onLoad={() => setLoaded(true)}
                className={`w-full h-full object-cover transition-opacity duration-500 transform-gpu
                    ${loaded ? 'opacity-100' : 'opacity-0'}
                `}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

            {loaded && (
                <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 bg-white/95 p-3 md:p-4 rounded-xl md:rounded-2xl shadow-xl transform-gpu animate-bounce-subtle border border-white/20">
                    <p className="text-[10px] md:text-xs font-black text-slate-900">Today's Special</p>
                    <p className="text-[8px] md:text-[10px] font-bold text-orange-600">Home-style North Indian Thali</p>
                </div>
            )}
        </div>
    );
};

const CookingBanner: React.FC<CookingPromoProps> = ({
    title = "Professional Chefs at Your Doorstep",
    subtitle = "Experience restaurant-quality meals cooked right in your kitchen. Healthy, fresh, and customized to your taste.",
    btnText = "Book a Chef",
    image = "https://res.cloudinary.com/dnz67rxu0/image/upload/f_auto,q_auto/v1774159058/photo-1556910103-1c02745aae4d_j3cfk9.jpg",
    bgColor = "bg-[#FFF9F2]"
}) => {
    return (
        <>
            <style>{`
                @keyframes bounceSubtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-4px); }
                }
                .animate-bounce-subtle { animation: bounceSubtle 3s ease-in-out infinite; }
                
                .gpu-layer { transform: translateZ(0); backface-visibility: hidden; }
            `}</style>

            <section className="py-8 md:py-12 px-4 md:px-6 max-w-360 mx-auto overflow-hidden">
                <div className={`
                    ${bgColor} w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden
                    flex flex-col md:flex-row-reverse relative border border-orange-100/60
                    transition-shadow duration-300 hover:shadow-xl gpu-layer
                `}>

                    {/* GPU-Friendly Decorative Orbs (using Radial Gradients instead of Filter: Blur) */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-[radial-gradient(circle,rgba(251,146,60,0.15)_0%,transparent_70%)] pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-80 h-80 bg-[radial-gradient(circle,rgba(251,191,36,0.15)_0%,transparent_70%)] pointer-events-none" />

                    {/* Content */}
                    <div className="flex-1 p-8 sm:p-10 md:p-14 lg:p-16 flex flex-col justify-center items-start z-10">

                        <div className="flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full mb-6">
                            <Utensils size={12} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Home Cooking</span>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4 leading-tight text-slate-900">
                            {title.split(' ').map((word, i) => (
                                <span key={i} className={word === "Chefs" ? "text-orange-600" : ""}>
                                    {word}{' '}
                                </span>
                            ))}
                        </h2>

                        <p className="text-base md:text-lg font-medium text-slate-500 mb-8 max-w-lg leading-relaxed">
                            {subtitle}
                        </p>

                        <div className="flex items-center gap-8 mb-10">
                            <div className="text-center">
                                <span className="block text-xl font-black text-slate-900 leading-none">4.9</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Rating</span>
                            </div>
                            <div className="w-px h-8 bg-slate-200" />
                            <div className="text-center">
                                <span className="block text-xl font-black text-slate-900 leading-none">60m</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Fast</span>
                            </div>
                            <div className="w-px h-8 bg-slate-200" />
                            <div className="text-center">
                                <span className="block text-xl font-black text-slate-900 leading-none">50+</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Menu</span>
                            </div>
                        </div>

                        <Link to="/cooking-service" className="w-full sm:w-auto">
                            <button className="
                                promo-btn
                                btn-shimmer-effect
                                relative overflow-hidden w-full sm:w-auto
                                bg-orange-600 hover:bg-orange-700
                                text-white font-black text-xs md:text-sm
                                uppercase tracking-widest px-10 py-4 md:py-5
                                rounded-2xl flex items-center justify-center gap-3
                                transition-transform active:scale-95 shadow-lg shadow-orange-600/20
                            ">
                                <span>{btnText}</span>
                                <ArrowRight size={16} />
                            </button>
                        </Link>
                    </div>

                    {/* Image */}
                    <div className="flex-1 p-6 sm:p-8 md:p-10 lg:p-12 flex items-center justify-center">
                        <div className="w-full max-w-md md:max-w-none">
                            <ChefImage src={image} alt="Cooking Service" />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default CookingBanner;