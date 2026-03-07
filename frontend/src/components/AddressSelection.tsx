import React from 'react';
import { MapPin, PlusCircle, CheckCircle2, Phone } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const AddressSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map(i => (
            <div key={i} className="h-40 bg-white border border-slate-100 rounded-3xl p-6 animate-pulse">
                <div className="w-16 h-4 bg-slate-100 rounded mb-4" />
                <div className="w-3/4 h-5 bg-slate-100 rounded mb-2" />
                <div className="w-full h-10 bg-slate-50 rounded" />
            </div>
        ))}
    </div>
);

interface AddressSectionProps {
    loading: boolean;
    addresses: any[];
    selectedId: string | null;
    onSelect: (id: string) => void;
}

const AddressSection: React.FC<AddressSectionProps> = ({ loading, addresses, selectedId, onSelect }) => {
    const navigate = useNavigate();

    return (
        <section>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <MapPin className="text-blue-600" size={22} /> Service Address
                </h2>
                <Button variant="ghost" onClick={() => navigate("/edit-address")} className="text-blue-600 font-bold hover:bg-blue-50 rounded-xl">
                    <PlusCircle size={18} className="mr-2" /> Add New
                </Button>
            </div>

            {loading ? <AddressSkeleton /> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                        <div
                            key={addr._id}
                            onClick={() => onSelect(addr._id)}
                            className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer relative group ${
                                selectedId === addr._id 
                                ? 'border-blue-600 bg-blue-50/40 shadow-md ring-4 ring-blue-600/5' 
                                : 'border-white bg-white hover:border-slate-200 shadow-sm'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black uppercase text-slate-500">{addr.label || 'Home'}</div>
                                {selectedId === addr._id && <CheckCircle2 className="text-blue-600 w-6 h-6 fill-white" />}
                            </div>
                            <h4 className="font-bold text-slate-900 mb-1">{addr.fullName}</h4>
                            <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4">{addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}</p>
                            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                                <Phone size={14} className="text-slate-400" /> {addr.phoneNumber}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default AddressSection;