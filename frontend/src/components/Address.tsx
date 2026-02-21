import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';
import api from '../api/api';
import { Trash2, Plus, Loader2, Edit3, X, MapPin, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

declare global {
    interface Window {
        google: any;
    }
}

interface Address {
    _id: string;
    label: string;
    fullName: string;
    phoneNumber: string;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
}

const defaultForm = {
    label: 'Home',
    fullName: '',
    phoneNumber: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
};

// ─── City Autocomplete Input ──────────────────────────────────────────────────
const CityAutocompleteInput = ({
    value,
    onSelect,
}: {
    value: string;
    onSelect: (city: string, state: string) => void;
}) => {
    const [input, setInput] = useState(value);
    const [predictions, setPredictions] = useState<any[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const sessionTokenRef = useRef<any>(null);

    useEffect(() => { setInput(value); }, [value]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (input.length < 3) {
            setPredictions([]);
            setIsDropdownOpen(false);
            return;
        }

        const fetchSuggestions = async () => {
            try {
                const { AutocompleteSuggestion, AutocompleteSessionToken } =
                    await window.google.maps.importLibrary('places');

                if (!sessionTokenRef.current) {
                    sessionTokenRef.current = new AutocompleteSessionToken();
                }

                const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
                    input,
                    sessionToken: sessionTokenRef.current,
                    includedPrimaryTypes: ['locality'],
                    includedRegionCodes: ['in'],
                    language: 'en-IN',
                });

                setPredictions(suggestions || []);
                setIsDropdownOpen((suggestions || []).length > 0);
            } catch (err) {
                console.error('AutocompleteSuggestion error:', err);
                setPredictions([]);
            }
        };

        const timer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timer);
    }, [input]);

    const handleSelect = async (suggestion: any) => {
        const placePrediction = suggestion.placePrediction;
        const cityName = placePrediction.mainText?.text || placePrediction.text?.text || '';
        setInput(cityName);
        setIsDropdownOpen(false);
        setPredictions([]);
        sessionTokenRef.current = null;

        try {
            const place = placePrediction.toPlace();
            await place.fetchFields({ fields: ['addressComponents'] });
            let stateName = '';
            place.addressComponents?.forEach((component: any) => {
                if (component.types.includes('administrative_area_level_1')) {
                    stateName = component.longText;
                }
            });
            onSelect(cityName, stateName);
        } catch (err) {
            onSelect(cityName, '');
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <label className="text-[9px] md:text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1 block mb-1">
                Search City
            </label>
            <div className="relative flex items-center">
                <Search className="absolute left-3 w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 pointer-events-none" />
                <input
                    type="text"
                    required
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                        onSelect(e.target.value, '');
                    }}
                    placeholder="City name..."
                    className="w-full bg-white border border-slate-200 rounded-xl md:rounded-2xl px-4 py-2.5 md:py-3.5 pl-9 text-xs md:text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                />
            </div>

            {isDropdownOpen && predictions.length > 0 && (
                <div className="absolute top-[105%] left-0 w-full bg-white border border-gray-100 rounded-xl shadow-2xl z-[200] overflow-hidden">
                    {predictions.map((p, idx) => {
                        const main = p.placePrediction.mainText?.text || p.placePrediction.text?.text || '';
                        const secondary = p.placePrediction.secondaryText?.text || '';
                        return (
                            <div
                                key={idx}
                                onMouseDown={() => handleSelect(p)}
                                className="flex items-start gap-2 px-3 py-2 border-b border-gray-50 last:border-0 hover:bg-indigo-50 cursor-pointer transition-colors"
                            >
                                <MapPin className="w-3 h-3 text-indigo-400 mt-0.5 shrink-0" />
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-[11px] md:text-[13px] text-gray-900 font-bold truncate">{main}</span>
                                    <span className="text-[9px] md:text-[11px] text-gray-400 truncate">{secondary}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const AddressPage = () => {
    const { user } = useUser();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState(defaultForm);

    useEffect(() => { if (user) fetchUser(); }, [user]);

    const fetchUser = async () => {
        try {
            const res = await api.get(`/user/get-user/${user?.id}`);
            setAddresses(res.data.user.addresses || []);
        } catch { setAddresses([]); } finally { setLoading(false); }
    };

    const handleCitySelect = (city: string, state: string) => {
        setFormData((prev) => ({ ...prev, city, ...(state ? { state } : {}) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            let res;
            if (editingId) {
                res = await api.put(`/address/update/${user?.id}/${editingId}`, { updatedData: formData });
                toast.success('Updated!');
            } else {
                res = await api.post('/address/add', { clerkId: user?.id, addressData: formData });
                toast.success('Saved!');
            }
            setAddresses(res.data.addresses || []);
            closeModal();
        } catch { toast.error('Failed'); } finally { setSubmitting(false); }
    };

    const handleDelete = async (addrId: string) => {
        try {
            const res = await api.delete(`/address/delete/${user?.id}/${addrId}`);
            setAddresses(res.data.addresses || []);
            toast.success('Removed');
        } catch { toast.error('Error'); }
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingId(null);
        setFormData(defaultForm);
    };

    const openEdit = (addr: Address) => {
        setEditingId(addr._id);
        setFormData({ ...addr });
        setShowModal(true);
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-slate-50">
            <Loader2 className="animate-spin text-indigo-600" size={32} />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-12 mt-16 md:mt-20">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-row items-center justify-between mb-8 md:mb-12">
                    <div>
                        <h1 className="text-xl md:text-4xl font-black text-slate-900 tracking-tight">Saved addresses</h1>
                        <p className="text-slate-500 text-xs md:text-lg font-medium">Delivery locations</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-slate-900 hover:bg-slate-800 text-white p-2.5 md:px-8 md:py-3.5 rounded-xl md:rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95"
                    >
                        <Plus size={18} strokeWidth={3} /> 
                        <span className="hidden md:inline">Add New Address</span>
                    </button>
                </div>

                {/* Empty State */}
                {addresses.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <MapPin size={40} className="mb-4 opacity-20" />
                        <p className="text-sm font-bold">No addresses found</p>
                    </div>
                )}

                {/* Address Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                    {addresses.map((addr) => (
                        <motion.div
                            layout
                            key={addr._id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white border border-slate-100 md:border-2 rounded-2xl md:rounded-3xl p-4 md:p-6 relative hover:border-indigo-400 transition-all shadow-sm"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <span className="px-2 py-1 bg-slate-100 rounded-lg text-[9px] md:text-xs font-bold text-slate-600 uppercase">
                                    {addr.label}
                                </span>
                                <div className="flex gap-1 md:gap-2">
                                    <button onClick={() => openEdit(addr)} className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:text-indigo-600"><Edit3 size={14} /></button>
                                    <button onClick={() => handleDelete(addr._id)} className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:text-red-500"><Trash2 size={14} /></button>
                                </div>
                            </div>
                            <h3 className="text-sm md:text-lg font-bold text-slate-900 truncate">{addr.fullName}</h3>
                            <p className="text-slate-500 text-[11px] md:text-sm mt-0.5 line-clamp-1">{addr.addressLine}</p>
                            <p className="text-slate-700 text-[11px] md:text-sm font-bold mt-1">
                                {addr.city}, {addr.pincode}
                            </p>
                            {addr.isDefault && (
                                <span className="mt-2 inline-block px-1.5 py-0.5 bg-indigo-50 text-indigo-600 text-[8px] md:text-[10px] font-black uppercase rounded-md">
                                    Default
                                </span>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Modal */}
                <AnimatePresence>
                    {showModal && (
                        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-900/60 backdrop-blur-sm">
                            <motion.div
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "100%" }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                className="bg-white w-full max-w-lg rounded-t-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden"
                            >
                                <div className="px-6 py-4 md:px-8 md:py-6 border-b border-slate-100 flex justify-between items-center">
                                    <h2 className="text-lg md:text-2xl font-black text-slate-900">
                                        {editingId ? 'Update' : 'New Address'}
                                    </h2>
                                    <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20} /></button>
                                </div>

                                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4 md:space-y-5 max-h-[80vh] overflow-y-auto">
                                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                                        <div>
                                            <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Name</label>
                                            <input type="text" required placeholder="Name" className="compact-input" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Phone</label>
                                            <input type="tel" required placeholder="Phone" className="compact-input" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Address Details</label>
                                        <input type="text" required placeholder="Flat / Street / Area" className="compact-input" value={formData.addressLine} onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                                        <CityAutocompleteInput value={formData.city} onSelect={handleCitySelect} />
                                        <div>
                                            <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">State</label>
                                            <input type="text" readOnly className="compact-input bg-slate-50 text-slate-400" value={formData.state} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                                        <div>
                                            <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Pincode</label>
                                            <input type="text" required maxLength={6} className="compact-input" value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Label</label>
                                            <select className="compact-input" value={formData.label} onChange={(e) => setFormData({ ...formData, label: e.target.value })}>
                                                <option value="Home">Home</option>
                                                <option value="Office">Office</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <label className="flex items-center gap-2 py-2 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 accent-indigo-600" checked={formData.isDefault} onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })} />
                                        <span className="text-xs font-bold text-slate-600">Set as default</span>
                                    </label>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-slate-900 text-white py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-sm md:text-base hover:bg-indigo-600 transition-all shadow-xl flex items-center justify-center gap-2"
                                    >
                                        {submitting && <Loader2 size={16} className="animate-spin" />}
                                        {editingId ? 'Update' : 'Save Address'}
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            <style>{`
                .compact-input {
                    width: 100%;
                    background-color: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 0.75rem;
                    padding: 0.625rem 1rem;
                    font-size: 0.75rem;
                    transition: all 0.2s;
                    outline: none;
                }
                @media (min-width: 768px) {
                    .compact-input {
                        border-radius: 1rem;
                        padding: 0.875rem 1.25rem;
                        font-size: 0.875rem;
                    }
                }
                .compact-input:focus {
                    border-color: #6366f1;
                    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
                }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
};

export default AddressPage;