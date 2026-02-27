import React, { useState, useEffect } from 'react';
import { 
    ShieldCheck, Upload, Briefcase, User, 
    MapPin, CheckCircle, ChevronDown, Loader2 
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
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
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        experience: '',
        address: ''
    });

    // --- Fetch Real Services ---
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/services/allService'); 
                const data = await response.data;
                setServices(data);
            } catch (err) {
                toast.error("Could not load service categories");
            } finally {
                setFetchingServices(false);
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.category) return toast.error("Please select a service category");
        
        setLoading(true);
        // Simulate API post
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
            toast.success("Application submitted successfully!");
        }, 2000);
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-xl text-center border border-slate-100"
                >
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Application Received!</h2>
                    <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                        Our team is verifying your credentials. We'll notify you via email once approved.
                    </p>
                    <button onClick={() => window.location.href = "/"} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all">
                        Back to Home
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 mt-15 px-4 md:py-20">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10 md:mb-16">
                    <motion.span 
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.4em] block mb-2"
                    >
                        Work with the best
                    </motion.span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 italic tracking-tighter leading-none">
                        Join as a Service Pro
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] p-6 md:p-12 shadow-sm border border-slate-100 space-y-6 md:space-y-8">
                    
                    {/* Basic Info Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name Input */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                <input 
                                    required 
                                    type="text" 
                                    placeholder="e.g. Rahul Sharma" 
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none text-sm font-semibold"
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                        </div>

                        {/* DYNAMIC CATEGORY DROPDOWN */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Service Category</label>
                            <div className="relative">
                                {fetchingServices ? (
                                    <div className="w-full h-[54px] bg-slate-100 animate-pulse rounded-2xl border-2 border-slate-50"></div>
                                ) : (
                                    <div className="relative group">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" size={18} />
                                        <select 
                                            required
                                            className="w-full pl-12 pr-10 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none appearance-none text-sm font-semibold cursor-pointer"
                                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                                        >
                                            <option value="">Select a Service</option>
                                            {services.map((s) => (
                                                <option key={s._id} value={s.name}>{s.name}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Experience Row */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Professional Experience</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs uppercase">Years</div>
                            <input 
                                required 
                                type="number" 
                                placeholder="Total years of work" 
                                className="w-full pl-16 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-100 transition-all outline-none text-sm font-semibold"
                                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* Address Row */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Work Location</label>
                        <div className="relative group">
                            <MapPin className="absolute left-4 top-4 text-slate-400" size={18} />
                            <textarea 
                                required 
                                rows={3} 
                                placeholder="Full address of your residence or office" 
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-100 transition-all outline-none text-sm font-semibold resize-none"
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* ID Upload */}
                    <div className="p-8 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/30 flex flex-col items-center text-center group hover:border-indigo-300 hover:bg-indigo-50/30 transition-all cursor-pointer">
                        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                            <Upload size={24} />
                        </div>
                        <p className="text-sm font-bold text-slate-800">Identity Verification</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Aadhar, Voter ID or Trade License</p>
                        <input type="file" className="hidden" id="id-upload" />
                        <label htmlFor="id-upload" className="mt-4 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase cursor-pointer hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                            Choose Document
                        </label>
                    </div>

                    {/* Submit Button */}
                    <Button 
                        disabled={loading || fetchingServices} 
                        className="w-full py-5 bg-indigo-600 text-white rounded-[1.8rem] font-black uppercase tracking-widest text-[11px] shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <><Loader2 className="animate-spin" size={18} /> Validating...</>
                        ) : (
                            <><ShieldCheck size={20} /> Register as Professional</>
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default JoinPartner;