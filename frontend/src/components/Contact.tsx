import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from 'lucide-react';
import api from '@/api/api';

const Contact = () => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await api.post('/contact',formData);
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <section className="min-h-screen py-20 px-4 md:px-6 bg-gray-50 mt-20">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
                
                {/* Left Side: Info */}
                <div className="space-y-8">
                    <div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">
                            Let's <span className="text-indigo-600">Connect</span>
                        </h1>
                        <p className="text-slate-500 font-medium max-w-sm">
                            Have a question about our services? Our team is here to help you 24/7.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {[
                            { icon: Mail, label: 'Email us', val: 'support@Housexpertz.com' },
                            { icon: Phone, label: 'Call us', val: '+91 98765 43210' },
                            { icon: MapPin, label: 'Visit us', val: '123 Tech Park, Bangalore, India' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                    <item.icon size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</p>
                                    <p className="text-slate-900 font-bold">{item.val}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-slate-100 relative overflow-hidden">
                    {status === 'success' ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in">
                            <CheckCircle size={64} className="text-emerald-500" />
                            <h2 className="text-2xl font-black text-slate-900">Message Sent!</h2>
                            <p className="text-slate-500 font-medium">We'll get back to you within 24 hours.</p>
                            <button onClick={() => setStatus('idle')} className="text-indigo-600 font-bold underline">Send another</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Name</label>
                                    <input required type="text" placeholder="John Doe" className="w-full px-5 py-4 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium" 
                                    onChange={(e) => setFormData({...formData, name: e.target.value})} value={formData.name} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Email</label>
                                    <input required type="email" placeholder="john@example.com" className="w-full px-5 py-4 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium"
                                    onChange={(e) => setFormData({...formData, email: e.target.value})} value={formData.email} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Subject</label>
                                <input required type="text" placeholder="Service Inquiry" className="w-full px-5 py-4 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium"
                                onChange={(e) => setFormData({...formData, subject: e.target.value})} value={formData.subject} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Message</label>
                                <textarea required rows={4} placeholder="How can we help?" className="w-full px-5 py-4 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium resize-none"
                                onChange={(e) => setFormData({...formData, message: e.target.value})} value={formData.message}></textarea>
                            </div>

                            <button disabled={status === 'loading'} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-3">
                                {status === 'loading' ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Send Message</>}
                            </button>
                            {status === 'error' && <p className="text-red-500 text-xs font-bold text-center">Something went wrong. Please try again.</p>}
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Contact;