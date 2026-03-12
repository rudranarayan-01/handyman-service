import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Column 1: Brand & About */}
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center gap-2 text-white">
                            <div className="flex items-center gap-2 cursor-pointer">
                                <div className="w-9 h-9 bg-black rounded-md flex items-center justify-center">
                                    <a href="/">
                                        <span className="text-white font-bold text-xl">HS</span>
                                    </a>
                                </div>
                                <div >
                                    <a href="/" className="flex flex-col leading-none sm:flex">
                                        <span className="font-bold text-[18px] tracking-tighter text-white uppercase">Housexpertz</span>
                                        <span className="font-medium text-[14px] tracking-tight text-gray-300">Service</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <p className="text-sm leading-relaxed text-gray-400">
                            Your one-stop solution for all home repairs and next-gen smart home setups. Trusted by 10k+ homeowners.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <Facebook className="w-5 h-5 cursor-pointer hover:text-blue-500 transition-colors" />
                            <Twitter className="w-5 h-5 cursor-pointer hover:text-blue-400 transition-colors" />
                            <Instagram className="w-5 h-5 cursor-pointer hover:text-pink-500 transition-colors" />
                            <Linkedin className="w-5 h-5 cursor-pointer hover:text-blue-600 transition-colors" />
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className='flex flex-col'>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-wider">Quick Links</h4>
                        <ul className="flex flex-col gap-2 text-sm text-slate-400">
                            <Link to="/blogs" className="hover:text-white transition-colors">
                                <li>About Us</li>
                            </Link>
                            <Link to="/categories" className="hover:text-white transition-colors">
                                <li>Our Services</li>
                            </Link>
                            <Link to="/areas" className="hover:text-white transition-colors">
                                <li>Service Areas</li>
                            </Link>
                            <Link to="/partner" className="hover:text-white transition-colors">
                                <li>Become a Partner</li>
                            </Link>
                            <Link to="/contact" className="hover:text-white transition-colors">
                                <li>Contact</li>
                            </Link>
                        </ul>
                    </div>

                    {/* Column 3: Top Services */}
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-wider">Top Services</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="hover:text-white cursor-pointer transition-colors">AI Appliance Repair</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Smart Home Setup</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Electrical Works</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Plumbing & Cleaning</li>
                        </ul>
                    </div>

                    {/* Column 4: Contact Info */}
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-wider">Get in Touch</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-blue-500 shrink-0" />
                                <span>9 Guru Nanak Market, Lajpat Nagar 4, New Delhi - 110024 (Near Moolchand Metro Station)</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                                <span>+91 9811797407</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                                <span>shivskukreja@gmail.com</span>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-800/60 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-bold text-slate-500">
    
    {/* 1. Copyright & Rights */}
    <div className="flex items-center gap-2 order-2 md:order-1">
        <p className="opacity-100">© 2026 Housexpertz Services Pvt Ltd.</p>
        <span className="hidden md:block w-1 h-1 rounded-full bg-slate-700" />
        <p className="hidden md:block opacity-100">All Rights Reserved</p>
    </div>

    {/* 2. Technical Signature (Your Name) */}
    <div className="order-1 md:order-2 flex items-center gap-3 group bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800/50 hover:border-indigo-500/30 transition-all duration-500 shadow-inner">
        <div className="flex items-center gap-2">
            <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-20"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500/80"></span>
            </div>
            <span className="text-slate-400 font-black tracking-widest text-[9px]">Engineered by</span>
        </div>
        <a 
            href="https://rudranarayan.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-200 hover:text-white transition-colors cursor-pointer group-hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.5)] flex items-center gap-1"
        >
            Rudranarayan Sahu
            <span className="text-indigo-500 group-hover:translate-x-0.5 transition-transform">/&gt;</span>
        </a>
    </div>

    {/* 3. Legal Links */}
    <div className="flex gap-8 order-3">
        <span className="hover:text-indigo-400 cursor-pointer transition-colors relative group">
            Privacy Policy
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-indigo-500 group-hover:w-full transition-all duration-300" />
        </span>
        <span className="hover:text-indigo-400 cursor-pointer transition-colors relative group">
            Terms of Service
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-indigo-500 group-hover:w-full transition-all duration-300" />
        </span>
    </div>
</div>
            </div>
        </footer>
    );
};

export default Footer;
