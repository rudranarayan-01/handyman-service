import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { X, Loader2, ChevronDown, Search, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = "https://countriesnow.space/api/v0.1/countries";

interface AddressFormProps {
    initialData: {
        fullName: string;
        phoneNumber: string;
        addressLine: string;
        city: string;
        state: string;
        pincode: string;
        label: string;
        isDefault: boolean;
        _id?: string; // Optional for new addresses
    };
    isEditing: boolean;
    submitting: boolean;
    onClose: () => void;
    onSubmit: (formData: any) => void;
}

// ─── Custom Dropdown Component ──────────────────────────────────────────────
const CustomSelect = ({ 
    label, 
    options, 
    value, 
    onChange, 
    placeholder, 
    loading, 
    disabled 
}: { 
    label: string, 
    options: string[], 
    value: string, 
    onChange: (val: string) => void, 
    placeholder: string, 
    loading?: boolean, 
    disabled?: boolean 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const filteredOptions = options.filter(opt => 
        opt.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="space-y-1 relative" ref={containerRef}>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">{label}</label>
            <button
                type="button"
                disabled={disabled || loading}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between bg-white border-2 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all outline-none
                    ${isOpen ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-slate-100'}
                    ${disabled ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:border-slate-200'}
                `}
            >
                <span className={!value ? 'text-slate-400' : ''}>{loading ? 'Loading...' : (value || placeholder)}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 5, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute z-[110] w-full bg-white border border-slate-100 shadow-2xl rounded-2xl overflow-hidden"
                    >
                        <div className="p-2 border-b border-slate-50 bg-slate-50/50 flex items-center gap-2">
                            <Search size={14} className="text-slate-400 ml-2" />
                            <input 
                                className="bg-transparent text-sm w-full py-1 outline-none font-medium" 
                                placeholder="Search..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                            {filteredOptions.length > 0 ? filteredOptions.map((opt) => (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={() => { onChange(opt); setIsOpen(false); setSearchTerm(''); }}
                                    className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between transition-colors"
                                >
                                    {opt}
                                    {value === opt && <Check size={14} className="text-indigo-600" />}
                                </button>
                            )) : (
                                <div className="px-4 py-8 text-center text-slate-400 text-xs">No results found</div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ─── Main Form Component ──────────────────────────────────────────────────
const AddressForm = ({ initialData, isEditing, submitting, onClose, onSubmit }: AddressFormProps) => {
    const [formData, setFormData] = useState(initialData);
    const [states, setStates] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [loadingStates, setLoadingStates] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);

    useEffect(() => {
        const fetchStates = async () => {
            setLoadingStates(true);
            try {
                const res = await axios.post(`${API_BASE}/states`, { country: "India" });
                setStates(res.data.data.states.map((s: any) => s.name));
            } catch { setStates([]); } finally { setLoadingStates(false); }
        };
        fetchStates();
    }, []);

    useEffect(() => {
        const fetchCities = async () => {
            if (!formData.state) { setCities([]); return; }
            setLoadingCities(true);
            try {
                const res = await axios.post(`${API_BASE}/state/cities`, { country: "India", state: formData.state });
                setCities(res.data.data || []);
            } catch { setCities([]); } finally { setLoadingCities(false); }
        };
        fetchCities();
    }, [formData.state]);

    return (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-900/40 backdrop-blur-[2px]">
            <motion.div
                initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                className="bg-white w-full max-w-lg rounded-t-[2.5rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="px-8 py-7 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 leading-none">
                            {isEditing ? 'Edit Address' : 'Add New Address'}
                        </h2>
                        <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-2">Delivery Details</p>
                    </div>
                    <button onClick={onClose} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all"><X size={20} /></button>
                </div>

                {/* Form Body */}
                <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="px-8 pb-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Recipient Name</label>
                            <input type="text" required className="compact-input" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} placeholder="e.g. Rahul Sharma" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Contact Number</label>
                            <input type="tel" required className="compact-input" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} placeholder="10-digit mobile" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Street Address</label>
                        <textarea rows={2} required className="compact-input resize-none py-4" value={formData.addressLine} onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })} placeholder="House No, Building Name, Landmark..." />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CustomSelect 
                            label="State" 
                            options={states} 
                            value={formData.state} 
                            onChange={(val) => setFormData({ ...formData, state: val, city: '' })} 
                            placeholder="Select State"
                            loading={loadingStates}
                        />
                        <CustomSelect 
                            label="City" 
                            options={cities} 
                            value={formData.city} 
                            onChange={(val) => setFormData({ ...formData, city: val })} 
                            placeholder="Select City"
                            loading={loadingCities}
                            disabled={!formData.state}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Pincode</label>
                            <input type="text" required maxLength={6} className="compact-input" value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} placeholder="400001" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Address Type</label>
                            <div className="flex gap-2">
                                {['Home', 'Office', 'Other'].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, label: type })}
                                        className={`flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border-2 
                                            ${formData.label === type ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}
                                        `}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <label className="flex items-center gap-3 p-5 bg-indigo-50/50 rounded-[2rem] cursor-pointer group transition-all hover:bg-indigo-50">
                        <input 
                            type="checkbox" 
                            className="w-5 h-5 accent-indigo-600 rounded-lg cursor-pointer" 
                            checked={formData.isDefault} 
                            onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })} 
                        />
                        <span className="text-[13px] font-bold text-indigo-900">Set as default delivery address</span>
                    </label>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-base hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-[0.98] disabled:bg-slate-300"
                    >
                        {submitting ? <Loader2 size={20} className="animate-spin" /> : (isEditing ? 'Update Address' : 'Save Address')}
                    </button>
                </form>
            </motion.div>

            <style>{`
                .compact-input {
                    width: 100%;
                    background-color: white;
                    border: 2px solid #f8fafc;
                    border-radius: 1.25rem;
                    padding: 0.875rem 1.25rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                    transition: all 0.2s ease-in-out;
                    outline: none;
                    color: #1e293b;
                }
                .compact-input:focus {
                    border-color: #6366f1;
                    background-color: white;
                    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
                }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default AddressForm;