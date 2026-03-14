import { useState } from 'react';
import { ShoppingCart, ChevronDown, LogOut, Package, UserCircle, Menu, X } from 'lucide-react';
import { useCart } from "@/context/CartContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import LocationSelector from './LocationSelector';
import { Button } from './ui/button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, useClerk, useUser } from "@clerk/clerk-react";

const Header = () => {
    const { cartItems } = useCart();
    const { user, isSignedIn, isLoaded } = useUser();
    const { signOut } = useClerk();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const closeMobile = () => setMobileOpen(false);

    const navLinks = [
        { label: 'Services', to: '/categories' },
        { label: 'Providers', to: '/providers' },
        { label: 'Blogs', to: '/blogs' },
        { label: 'Contact Us', to: '/contact' },
    ];

    return (
        <>
            <style>{`
                @keyframes skeletonShimmer {
                    0%   { background-position: -400px 0; }
                    100% { background-position: 400px 0; }
                }
                .shimmer-bg {
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 400px 100%;
                    animation: skeletonShimmer 1.4s ease-in-out infinite;
                }
                .drawer-transition {
                    transition: transform 0.5s cubic-bezier(0.32, 0.72, 0, 1);
                }
            `}</style>

            <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-2 md:gap-4">

                    {/* Left: Logo */}
                    <Link to="/" onClick={closeMobile} className="flex items-center gap-2 shrink-0 group">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-black group-hover:bg-blue-600 rounded-lg md:rounded-xl flex items-center justify-center transition-all duration-300">
                            <span className="text-white font-black text-sm md:text-xl">HS</span>
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="font-black text-[16px] md:text-[18px] sm:[18px] tracking-tighter text-black uppercase">Housexpertz</span>
                            <span className="font-bold text-[8px] md:text-[10px] sm:[14px] tracking-tight text-gray-400 uppercase">Service</span>
                        </div>
                    </Link>

                    {/* Center: Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-gray-500">
                        {navLinks.map(link => (
                            <Link key={link.to} to={link.to} className={`relative text-[15px] transition-colors hover:text-black group/link ${location.pathname === link.to ? 'text-blue-600' : ''}`}>
                                {link.label}
                                <span className={`absolute -bottom-1 left-0 h-0.5 bg-blue-600 rounded-full transition-all duration-300 ${location.pathname === link.to ? 'w-full' : 'w-0 group-hover/link:w-full'}`} />
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex flex-1 max-w-xs">
                        <LocationSelector />
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-2">
                        {/* Always Visible Cart (Mobile & Desktop) */}
                        {isSignedIn && (
                            <Link to="/shopping-cart" className="relative p-2 md:p-2.5 bg-gray-900 rounded-xl hover:bg-blue-600 transition-all duration-300 hover:scale-105 active:scale-95">
                                <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 text-gray-100" />
                                {cartItems.length > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[9px] md:text-[10px] font-black w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-in fade-in zoom-in">
                                        {cartItems.length}
                                    </span>
                                )}
                            </Link>
                        )}

                        {!isLoaded ? (
                            <div className="shimmer-bg w-10 h-10 rounded-full hidden md:block" />
                        ) : (
                            <>
                                <SignedOut>
                                    <SignInButton mode="modal">
                                        <Button className="bg-gray-900 text-white hover:bg-blue-600 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest px-4 md:px-6 py-4 md:py-5 h-auto">
                                            Sign In
                                        </Button>
                                    </SignInButton>
                                </SignedOut>

                                <SignedIn>
                                    <div className="hidden md:block">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="outline-none">
                                                <div className="flex items-center gap-2 pr-3 border-2 border-gray-100 rounded-2xl hover:bg-blue-50/50 transition-all cursor-pointer">
                                                    <img src={user?.imageUrl} alt="profile" className="w-10 h-10 rounded-full object-cover" />
                                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                                </div>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-64 mt-3 rounded-2xl p-2 shadow-xl border-none bg-white/95 backdrop-blur-xl" align="end">
                                                <DropdownMenuItem onClick={() => navigate('/profile')} className="rounded-xl py-3 cursor-pointer font-bold text-gray-700">
                                                    <UserCircle className="w-5 h-5 mr-3 text-blue-600" /> My Profile
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => navigate('/order-history')} className="rounded-xl py-3 cursor-pointer font-bold text-gray-700">
                                                    <Package className="w-5 h-5 mr-3 text-blue-600" /> Bookings
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => signOut()} className="rounded-xl py-3 text-red-500 font-black uppercase text-[11px] tracking-widest">
                                                    <LogOut className="w-4 h-4 mr-3" /> Logout
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </SignedIn>
                            </>
                        )}

                        {/* Hamburger Button */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="lg:hidden p-2.5 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-all active:scale-90"
                        >
                            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer Backdrop */}
            <div
                onClick={closeMobile}
                className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px] transition-opacity duration-500 lg:hidden ${
                    mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            />

            {/* Mobile Drawer Content */}
            <div className={`
                fixed top-0 right-0 h-full w-[85vw] max-w-xs z-[70]
                bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.1)] flex flex-col drawer-transition will-change-transform lg:hidden
                ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                <div className="flex items-center justify-between p-6 border-b border-gray-50">
                    <span className="font-black text-xs uppercase tracking-[0.2em] text-gray-400">Housexpertz</span>
                    <button onClick={closeMobile} className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:text-black"><X size={18} /></button>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                    <div className="px-4 space-y-2">
                        {navLinks.map(link => (
                            <Link 
                                key={link.to} 
                                to={link.to} 
                                onClick={closeMobile} 
                                className={`flex items-center px-5 py-4 rounded-2xl font-black text-sm transition-all ${
                                    location.pathname === link.to 
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="mt-8 px-4 md:hidden">
                        <p className="px-5 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Your Location</p>
                        <LocationSelector />
                    </div>
                </div>

                {/* Drawer Footer Profile Section */}
                <div className="p-4 border-t border-gray-50 bg-gray-50/30">
                    {isLoaded && (
                        <SignedIn>
                            <div className="p-4 bg-white rounded-3xl border border-gray-100 shadow-sm mb-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <img src={user?.imageUrl} className="w-12 h-12 rounded-full border-2 border-blue-100" />
                                    <div className="min-w-0">
                                        <p className="font-black text-sm text-gray-900 truncate">{user?.fullName}</p>
                                        <p className="text-[10px] font-bold text-gray-400 truncate uppercase tracking-tighter">{user?.primaryEmailAddress?.emailAddress}</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <button onClick={() => { navigate('/profile'); closeMobile(); }} className="flex items-center gap-3 w-full p-3 font-bold text-xs text-gray-600 hover:bg-gray-50 rounded-xl transition-all"><UserCircle size={18} className="text-blue-500"/> My Profile</button>
                                    <button onClick={() => { navigate('/order-history'); closeMobile(); }} className="flex items-center gap-3 w-full p-3 font-bold text-xs text-gray-600 hover:bg-gray-50 rounded-xl transition-all"><Package size={18} className="text-blue-500" /> My Bookings</button>
                                </div>
                            </div>
                            <button onClick={() => { signOut(); closeMobile(); }} className="flex items-center justify-center gap-2 w-full p-4 font-black text-red-500 uppercase tracking-widest text-[10px] hover:bg-red-50 rounded-2xl transition-all">
                                <LogOut size={16} /> Logout
                            </button>
                        </SignedIn>
                    )}
                    
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button onClick={closeMobile} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-[0.15em] text-[11px] shadow-xl active:scale-95 transition-all">
                                Sign In / Join
                            </button>
                        </SignInButton>
                    </SignedOut>
                </div>
            </div>
        </>
    );
};

export default Header;