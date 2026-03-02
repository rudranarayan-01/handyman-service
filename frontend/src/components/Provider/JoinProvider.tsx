import React, { useState, useEffect } from 'react';
import {
    ShieldCheck,  Briefcase, User,
    MapPin, CheckCircle, ChevronDown, Loader2, Mail, Phone, X
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/api/api';
import { Button } from '../ui/button';

interface Service {
    _id: string;
    name: string;
    category: string;
}

const JoinPartner = () => {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState<Service[]>([]);
    const [fetchingServices, setFetchingServices] = useState(true);
    
    // Updated state to match your Backend Route
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        serviceAreas: '', // Mapping address to serviceAreas
        specializations: [] as string[] // Array for multiple services
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/services/allService');
                setServices(response.data);
            } catch (err) {
                toast.error("Could not load services");
            } finally {
                setFetchingServices(false);
            }
        };
        fetchCategories();
    }, []);

    const toggleService = (serviceName: string) => {
        setFormData(prev => ({
            ...prev,
            specializations: prev.specializations.includes(serviceName)
                ? prev.specializations.filter(s => s !== serviceName)
                : [...prev.specializations, serviceName]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.specializations.length === 0) return toast.error("Please select at least one service");

        setLoading(true);
        try {
            // Now matches: { name, email, phone, serviceAreas, specializations }
            await api.post('/partners/register', formData);
            toast.success("Application submitted successfully!");
            setSubmitted(true);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-xl text-center border border-slate-100">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Application Received!</h2>
                    <p className="text-slate-500 text-sm mb-8 leading-relaxed">Our team is verifying your credentials. We'll notify you via email once approved.</p>
                    <button onClick={() => window.location.href = "/"} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all">Back to Home</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 mt-15 px-4 md:py-20">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10 md:mb-16">
                    <motion.span initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.4em] block mb-2">Work with the best</motion.span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 italic tracking-tighter leading-none">Join as a Service Pro</h1>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] p-6 md:p-12 shadow-sm border border-slate-100 space-y-6 md:space-y-8">
                    
                    {/* Name & Email Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                <input required type="text" placeholder="Rahul Sharma" className="form-input-styled" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                <input required type="email" placeholder="rahul@example.com" className="form-input-styled" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    {/* Phone & Service Selector */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Phone Number</label>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                <input required type="tel" placeholder="+91 00000 00000" className="form-input-styled" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Add Specializations</label>
                            <div className="relative">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                <select 
                                    className="form-input-styled appearance-none cursor-pointer"
                                    value=""
                                    onChange={(e) => toggleService(e.target.value)}
                                    disabled={fetchingServices}
                                >
                                    <option value="">{fetchingServices ? 'Loading...' : 'Select Services (Multiple)'}</option>
                                    {services.map((s) => (
                                        <option key={s._id} value={s.name} disabled={formData.specializations.includes(s.name)}>
                                            {s.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                            </div>
                        </div>
                    </div>

                    {/* Multi-Select Chips Display */}
                    <AnimatePresence>
                        {formData.specializations.length > 0 && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                {formData.specializations.map(service => (
                                    <span key={service} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-[11px] font-black uppercase tracking-tight">
                                        {service}
                                        <X size={14} className="cursor-pointer hover:text-red-200" onClick={() => toggleService(service)} />
                                    </span>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Address Row */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Service Areas (Work Location)</label>
                        <div className="relative group">
                            <MapPin className="absolute left-4 top-4 text-slate-400" size={18} />
                            <textarea required rows={3} placeholder="Cities or areas you can provide service in..." className="form-input-styled pl-12 resize-none" value={formData.serviceAreas} onChange={(e) => setFormData({ ...formData, serviceAreas: e.target.value })} />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button disabled={loading || fetchingServices} className="w-full py-5 bg-indigo-600 text-white rounded-[1.8rem] font-black uppercase tracking-widest text-[11px] shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.97] transition-all flex items-center justify-center gap-3">
                        {loading ? <><Loader2 className="animate-spin" size={18} /> Processing...</> : <><ShieldCheck size={20} /> Submit Application</>}
                    </Button>
                </form>
            </div>
            
            <style>{`
                .form-input-styled {
                    width: 100%;
                    padding-left: 3rem;
                    padding-right: 1rem;
                    padding-top: 1rem;
                    padding-bottom: 1rem;
                    background-color: #f8fafc;
                    border: 2px solid transparent;
                    border-radius: 1rem;
                    outline: none;
                    font-size: 0.875rem;
                    font-weight: 600;
                    transition: all 0.2s;
                }
                .form-input-styled:focus {
                    background-color: white;
                    border-color: #e0e7ff;
                    box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.05);
                }
            `}</style>
        </div>
    );
};

export default JoinPartner;