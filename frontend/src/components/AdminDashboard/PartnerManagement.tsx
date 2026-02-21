import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '@/api/api';
import { useAuth } from '@clerk/clerk-react';
import {
    Plus, Search, MapPin, Mail, Phone,
    X, Check, Edit2, Trash2, ChevronDown, Loader2
} from 'lucide-react';
import { toast } from 'sonner';

declare global {
    interface Window {
        google: any;
    }
}

// ─── AREA AUTOCOMPLETE TAG INPUT ──────────────────────────────────────────────
const AreaTagInput = ({
    areas,
    onChange,
}: {
    areas: string[];
    onChange: (areas: string[]) => void;
}) => {
    const [inputVal, setInputVal] = useState('');
    const [predictions, setPredictions] = useState<any[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const sessionTokenRef = useRef<any>(null);
    const placesLibRef = useRef<any>(null);

    useEffect(() => {
        const loadLib = async () => {
            if (window.google) placesLibRef.current = await window.google.maps.importLibrary('places');
        };
        loadLib();
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (inputVal.length < 3 || !placesLibRef.current) {
            setPredictions([]);
            setIsDropdownOpen(false);
            return;
        }

        const fetchSuggestions = async () => {
            try {
                const { AutocompleteSuggestion, AutocompleteSessionToken } = placesLibRef.current;
                if (!sessionTokenRef.current) sessionTokenRef.current = new AutocompleteSessionToken();

                const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
                    input: inputVal,
                    sessionToken: sessionTokenRef.current,
                    includedPrimaryTypes: ['locality', 'sublocality'],
                    includedRegionCodes: ['in'],
                    language: 'en-IN',
                });

                // Filter duplicates from API results before setting state
                const uniqueOnes = suggestions?.filter((v: any, i: number, a: any[]) => 
                    a.findIndex(t => (t.placePrediction.mainText?.text === v.placePrediction.mainText?.text)) === i
                );

                setPredictions(uniqueOnes || []);
                setIsDropdownOpen((uniqueOnes || []).length > 0);
            } catch (err) { console.error(err); }
        };

        const timer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timer);
    }, [inputVal]);

    const addArea = (area: string) => {
        const trimmed = area.trim();
        // Prevent duplicates (case-insensitive)
        if (trimmed && !areas.some(a => a.toLowerCase() === trimmed.toLowerCase())) {
            onChange([...areas, trimmed]);
        } else if (trimmed) {
            toast.error("Area already added");
        }
        setInputVal('');
        setPredictions([]);
        setIsDropdownOpen(false);
        sessionTokenRef.current = null;
    };

    return (
        <div className="space-y-1.5 text-left relative" ref={dropdownRef}>
            <label className="text-[11px] font-black uppercase text-slate-400 ml-1">Service Areas</label>
            <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-transparent rounded-2xl min-h-[56px] focus-within:bg-white focus-within:border-indigo-500 transition-all shadow-inner">
                {areas.map((area, idx) => (
                    <span key={`${area}-${idx}`} className="bg-slate-900 text-white px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-2 uppercase tracking-wider animate-in zoom-in-50">
                        {area}
                        <X size={12} className="cursor-pointer hover:text-rose-400" onClick={() => onChange(areas.filter((_, i) => i !== idx))} />
                    </span>
                ))}
                <input
                    className="bg-transparent outline-none text-sm p-1 flex-1 font-bold min-w-[120px]"
                    placeholder="Type area..."
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            if (inputVal.trim()) addArea(inputVal);
                        }
                    }}
                />
            </div>

            {isDropdownOpen && (
                <div className="absolute top-[100%] left-0 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl z-[200] overflow-hidden mt-2">
                    {predictions.map((p, idx) => (
                        <div
                            key={`pred-${idx}`}
                            onMouseDown={(e) => { e.preventDefault(); addArea(p.placePrediction.mainText?.text); }}
                            className="flex items-start gap-3 px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-indigo-50 cursor-pointer"
                        >
                            <MapPin className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-[13px] text-gray-900 font-bold truncate">{p.placePrediction.mainText?.text}</span>
                                <span className="text-[11px] text-gray-400 truncate">{p.placePrediction.secondaryText?.text}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const PartnerManagement = () => {
    const { getToken } = useAuth();
    const [partners, setPartners] = useState([]);
    const [availableServices, setAvailableServices] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [serviceSearch, setServiceSearch] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: '', email: '', phone: '',
        serviceAreas: [] as string[],
        specializations: [] as string[]
    });

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const token = await getToken();
            const [pRes, sRes] = await Promise.all([
                api.get(`/admin/partners?search=${searchQuery}`, { headers: { Authorization: `Bearer ${token}` } }),
                api.get('/admin/service-list', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setPartners(pRes.data);
            setAvailableServices(sRes.data);
        } catch (err) { toast.error("Sync failed"); } finally { setLoading(false); }
    }, [getToken, searchQuery]);

    useEffect(() => {
        const timer = setTimeout(fetchData, 400);
        return () => clearTimeout(timer);
    }, [fetchData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.specializations.length === 0) return toast.error("Select at least one service");
        if (formData.serviceAreas.length === 0) return toast.error("Add at least one service area");

        try {
            const token = await getToken();
            const config = { headers: { Authorization: `Bearer ${token}` } };
            if (editingId) {
                await api.patch(`/admin/partners/${editingId}`, formData, config);
                toast.success("Profile updated");
            } else {
                await api.post('/admin/partners', formData, config);
                toast.success("Partner onboarded");
            }
            resetForm();
            fetchData();
        } catch (err: any) { toast.error(err.response?.data?.message || "Error"); }
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({ name: '', email: '', phone: '', serviceAreas: [], specializations: [] });
    };

    return (
        <div className="p-6 md:p-10 bg-[#F8FAFC] min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Partner Fleet</h1>
                        <p className="text-slate-500 font-medium">Manage professional service providers.</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                className="pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl w-full md:w-72 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm font-medium shadow-sm"
                                placeholder="Search partners..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => (showForm ? resetForm() : setShowForm(true))}
                            className={`${showForm ? 'bg-slate-200 text-slate-600' : 'bg-indigo-600 text-white'} px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg text-sm`}
                        >
                            {showForm ? <X size={18} /> : <Plus size={18} />} {showForm ? "Cancel" : "Add Partner"}
                        </button>
                    </div>
                </div>

                {showForm && (
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-2xl mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormInput label="Full Name" value={formData.name} onChange={(v: any) => setFormData({...formData, name: v})} />
                                <FormInput label="Email Address" type="email" value={formData.email} onChange={(v: any) => setFormData({...formData, email: v})} />
                                <FormInput label="Phone Number" value={formData.phone} onChange={(v: any) => setFormData({...formData, phone: v})} />
                                <AreaTagInput areas={formData.serviceAreas} onChange={a => setFormData({...formData, serviceAreas: a})} />
                            </div>

                            <div className="space-y-1.5 relative">
                                <label className="text-[11px] font-black uppercase text-slate-400 ml-1">Specializations</label>
                                <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full p-4 bg-slate-50 rounded-2xl border flex justify-between items-center cursor-pointer hover:bg-slate-100">
                                    <span className="text-sm font-bold text-slate-700 truncate">
                                        {formData.specializations.length > 0 ? formData.specializations.join(", ") : "Select Services"}
                                    </span>
                                    <ChevronDown size={18} className={`${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </div>
                                {isDropdownOpen && (
                                    <div className="absolute z-[100] mt-2 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden">
                                        <div className="p-3 bg-slate-50 border-b">
                                            <input className="w-full p-2 bg-white rounded-lg outline-none text-xs border font-bold" placeholder="Filter..." value={serviceSearch} onChange={e => setServiceSearch(e.target.value)} />
                                        </div>
                                        <div className="max-h-60 overflow-y-auto p-2">
                                            {availableServices.filter(s => s.toLowerCase().includes(serviceSearch.toLowerCase())).map(service => (
                                                <div key={service} onClick={() => {
                                                    const exists = formData.specializations.includes(service);
                                                    setFormData({...formData, specializations: exists ? formData.specializations.filter(s => s !== service) : [...formData.specializations, service]});
                                                }} className="flex items-center justify-between p-3 hover:bg-indigo-50 rounded-xl cursor-pointer">
                                                    <span className={`text-xs font-bold ${formData.specializations.includes(service) ? 'text-indigo-600' : 'text-slate-600'}`}>{service}</span>
                                                    {formData.specializations.includes(service) && <Check size={14} className="text-indigo-600" />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button type="submit" className="md:col-span-3 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl">
                                {editingId ? "Update Professional" : "Confirm Onboarding"}
                            </button>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Partner</th>
                                    <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Contact</th>
                                    <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Coverage</th>
                                    <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Expertise</th>
                                    <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {partners.map((p: any) => (
                                    <tr key={p._id} className="hover:bg-slate-50/30 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black border border-indigo-100 uppercase">{p.name.charAt(0)}</div>
                                                <div><p className="font-black text-slate-900 text-sm">{p.name}</p></div>
                                            </div>
                                        </td>
                                        <td className="p-6 text-xs text-slate-600 space-y-1">
                                            <div className="flex items-center gap-2 font-bold"><Mail size={12} className="text-slate-300" /> {p.email}</div>
                                            <div className="flex items-center gap-2 font-bold"><Phone size={12} className="text-slate-300" /> {p.phone}</div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                {p.serviceAreas?.map((a: string, idx: number) => (
                                                    <span key={`${p._id}-area-${idx}`} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase">{a}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                {p.specializations?.map((s: string, idx: number) => (
                                                    <span key={`${p._id}-spec-${idx}`} className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md text-[9px] font-black uppercase border border-indigo-100/50">{s}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-6 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => {
                                                    setEditingId(p._id);
                                                    setFormData({
                                                        name: p.name, email: p.email, phone: p.phone,
                                                        serviceAreas: Array.isArray(p.serviceAreas) ? p.serviceAreas : [],
                                                        specializations: Array.isArray(p.specializations) ? p.specializations : []
                                                    });
                                                    setShowForm(true);
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }} className="p-2 rounded-lg bg-white text-slate-400 hover:text-indigo-600 border border-slate-100"><Edit2 size={14} /></button>
                                                <button onClick={() => {/* Delete Logic */}} className="p-2 rounded-lg bg-white text-slate-400 hover:text-rose-600 border border-slate-100"><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FormInput = ({ label, type = "text", value, onChange }: any) => (
    <div className="space-y-1.5 text-left">
        <label className="text-[11px] font-black uppercase text-slate-400 ml-1">{label}</label>
        <input type={type} value={value} onChange={e => onChange(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl border outline-none focus:bg-white focus:border-indigo-500 transition-all text-sm font-bold" required />
    </div>
);

export default PartnerManagement;