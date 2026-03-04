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
                                        <span className="font-bold text-[18px] tracking-tighter text-white uppercase">Handyman</span>
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
                                <span>123 Tech Park, Electronic City, Bengaluru, KA 560100</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                                <span>+91 6370260339</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                                <span>help@boysatwork.in</span>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[12px] uppercase tracking-widest font-medium text-gray-500">
                    <p>© 2026 Handyman Services Pvt Ltd.</p>
                    <div className="flex gap-6">
                        <span className="hover:text-gray-300 cursor-pointer">Privacy Policy</span>
                        <span className="hover:text-gray-300 cursor-pointer">Terms of Service</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;