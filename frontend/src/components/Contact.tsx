import { Mail, Phone, MapPin, Send, Github, Twitter, Linkedin } from 'lucide-react';

const ContactComponent = () => {
    return (
        <div className="min-h-screen bg-[#F8FAFC] py-16 px-6 md:px-12 lg:px-16 mt-10">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                {/* Left Side: Brand Info & Quick Connect */}
                <div className="lg:col-span-5 space-y-10">
                    <div>
                        <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter leading-none mb-6">
                            Let's build <br /> <span className="text-blue-600">something</span> great.
                        </h1>
                        <p className="text-lg text-gray-500 font-medium max-w-sm">
                            Have a project in mind or just want to say hi? We're always open to new ideas.
                        </p>
                    </div>

                    {/* Quick Contact Cards */}
                    <div className="space-y-4">
                        {[
                            { icon: Mail, label: "Email us", val: "hello@handyman.com", color: "bg-blue-50 text-blue-600" },
                            { icon: Phone, label: "Call us", val: "+91 98765 43210", color: "bg-emerald-50 text-emerald-600" },
                            { icon: MapPin, label: "Visit us", val: "DLF Cyber City, Gurugram", color: "bg-purple-50 text-purple-600" }
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-5 p-4 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                                <div className={`p-4 rounded-2xl ${item.color} group-hover:scale-110 transition-transform`}>
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.label}</p>
                                    <p className="font-bold text-gray-900">{item.val}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-4">
                        {[Twitter, Github, Linkedin].map((Icon, i) => (
                            <button key={i} className="p-4 bg-white rounded-2xl border border-gray-100 text-gray-400 hover:text-blue-600 hover:shadow-lg transition-all">
                                <Icon className="w-5 h-5" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Side: The Modern Form Card */}
                <div className="lg:col-span-7 relative">
                    {/* Decorative Blur Blobs */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-200/50 blur-[100px] rounded-full" />
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-200/50 blur-[100px] rounded-full" />

                    <div className="relative bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-blue-500/5 border border-gray-100">
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Send us a message</h3>
                            <p className="text-sm text-gray-400 font-medium">We typically respond within 2 hours.</p>
                        </div>

                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                                    <input type="text" placeholder="Ankit Singh" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-semibold placeholder:text-gray-300" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                                    <input type="email" placeholder="ankit@example.com" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-semibold placeholder:text-gray-300" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Service Required</label>
                                <select className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-semibold text-gray-500 appearance-none">
                                    <option>AC Repair & Service</option>
                                    <option>Home Deep Cleaning</option>
                                    <option>Electrical Works</option>
                                    <option>Others</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Your Message</label>
                                <textarea rows={4} placeholder="How can we help you?" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-semibold placeholder:text-gray-300 resize-none"></textarea>
                            </div>

                            <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                                Send Message <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ContactComponent;