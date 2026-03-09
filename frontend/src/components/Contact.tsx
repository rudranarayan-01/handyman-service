import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle, Clock, ShieldCheck } from 'lucide-react';
import api from '@/api/api';

const Contact = () => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        // Debugging: Check this in your browser console (F12)
        console.log("Sending Data:", formData);

        try {
            // Ensure you are using the correct endpoint path
            // Since Thunder Client uses /api/v1/contact, make sure 'api' instance
            // doesn't already include /api or /v1 in its baseURL
            await api.post('/contact', {
                name: formData.name,
                email: formData.email,
                subject: formData.subject,
                message: formData.message
            });

            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error: any) {
            console.error("Frontend Error:", error.response?.data || error.message);
            setStatus('error');
        }
    };

    return (
        <div className="bg-white min-h-screen font-sans overflow-x-hidden">
            {/* --- HERO SECTION (MATCHES BLOG STYLE) --- */}
            <header className="bg-gray-900 text-white py-16 mb-12 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Get in Touch</h1>
                    <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                        Whether you have a question about services, pricing, or a recent booking, our team is ready to assist you.
                    </p>
                </div>
            </header>

            {/* --- MAIN CONTENT CONTAINER --- */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* LEFT SIDE: INFO (4 Columns) */}
                    <div className="lg:col-span-5 space-y-10">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">How can we help?</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Housexpertz provides 24/7 support for emergency home repairs across Bangalore. Fill out the form and we'll respond within 2 hours.
                            </p>
                        </div>

                        {/* Contact Info Cards */}
                        <div className="space-y-4">
                            {[
                                { icon: Mail, label: 'Email us', val: 'support@housexpertz.in' },
                                { icon: Phone, label: 'Call us', val: '+91 9811797407' },
                                { icon: MapPin, label: 'Visit us', val: '9 Guru Nanak Market, Lajpat Nagar 4, New Delhi - 110024 (Near Moolchand Metro Station)' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-all">
                                    <div className="p-3 bg-white text-blue-600 rounded-lg shadow-sm">
                                        <item.icon size={22} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{item.label}</p>
                                        <p className="text-gray-900 font-bold">{item.val}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Trust Badges */}
                        <div className="pt-6 border-t border-gray-100 flex gap-8">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="text-blue-600" size={20} />
                                <span className="text-sm font-medium text-gray-600">Secure Handling</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="text-blue-600" size={20} />
                                <span className="text-sm font-medium text-gray-600">24/7 Response</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: FORM (7 Columns) */}
                    <div className="lg:col-span-7 bg-white rounded-3xl p-8 md:p-10 shadow-2xl shadow-blue-900/5 border border-gray-100 relative">
                        {status === 'success' ? (
                            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-500">
                                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-2">
                                    <CheckCircle size={48} className="text-green-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Message Sent Successfully!</h2>
                                <p className="text-gray-500 max-w-xs mx-auto">One of our service experts will call or email you shortly.</p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="mt-4 text-blue-600 font-bold hover:underline underline-offset-4"
                                >
                                    Submit another request
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Your Name</label>
                                        <input required type="text" placeholder="Full Name"
                                            className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-0 transition-all text-gray-900 font-medium placeholder:text-gray-400"
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })} value={formData.name} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Email Address</label>
                                        <input required type="email" placeholder="email@example.com"
                                            className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-0 transition-all text-gray-900 font-medium placeholder:text-gray-400"
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })} value={formData.email} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Subject</label>
                                    <input required type="text" placeholder="e.g. Plumbing Service Inquiry"
                                        className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-0 transition-all text-gray-900 font-medium placeholder:text-gray-400"
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })} value={formData.subject} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Message</label>
                                    <textarea required rows={5} placeholder="Tell us how we can help..."
                                        className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-0 transition-all text-gray-900 font-medium resize-none placeholder:text-gray-400"
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })} value={formData.message}></textarea>
                                </div>

                                <button
                                    disabled={status === 'loading'}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-widest py-5 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70"
                                >
                                    {status === 'loading' ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            <span>Send Inquiry</span>
                                        </>
                                    )}
                                </button>
                                {status === 'error' && (
                                    <p className="text-red-500 text-sm font-bold text-center animate-bounce">
                                        Failed to connect. Please check your internet or try again later.
                                    </p>
                                )}
                            </form>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Contact;