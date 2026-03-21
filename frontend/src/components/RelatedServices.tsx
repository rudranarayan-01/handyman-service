import React from 'react';
import { Link } from 'react-router-dom';
import { StarIcon } from 'lucide-react';

interface RelatedService {
    _id: string;
    name: string;
    slug: string;
    image?: string;
    basePrice: number;
    rating?: string;
    variants?: { price: number }[];
}

interface RelatedServicesProps {
    services: RelatedService[];
    currentServiceName: string;
}

const RelatedServices: React.FC<RelatedServicesProps> = ({ services, currentServiceName }) => {
    if (services.length === 0) return null;

    return (
        <section className="mt-24 border-t border-slate-100 pt-20">
            <div className="flex items-end justify-between mb-10">
                <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">You might also need</h3>
                    <p className="text-slate-400 font-medium">Frequently booked along with {currentServiceName}</p>
                </div>
                <Link to="/services" className="text-blue-600 font-bold text-sm hover:underline hidden md:block">
                    View all services
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {services.map((rel) => (
                    <Link 
                        to={`/services/${rel.slug}`} 
                        key={rel._id} 
                        className="bg-white rounded-[2rem] p-4 border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
                    >
                        <div className="h-48 rounded-2xl overflow-hidden mb-4">
                            <img 
                                src={rel.image || '/placeholder.jpg'} 
                                alt={rel.name} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                            />
                        </div>
                        <h4 className="font-black text-slate-800 mb-1">{rel.name}</h4>
                        <div className="flex justify-between items-center">
                            <p className="text-blue-600 font-black">Starts from ₹{rel.basePrice || rel.variants?.[0]?.price}</p>
                            <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                                <StarIcon size={12} fill="currentColor" className="text-amber-400" /> 
                                {rel.rating || '4.8'}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default RelatedServices;