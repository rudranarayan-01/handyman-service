import { useState } from 'react';
import { ShoppingCart, User, ChevronDown, LogOut, Package, UserCircle, Menu, X } from 'lucide-react';
import { useCart } from "@/context/CartContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import LocationSelector from './LocationSelector';
import { Button } from './ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, useClerk, useUser } from "@clerk/clerk-react";

// ── Skeleton pulse for right side while Clerk loads ──
const NavSkeleton = () => (
    <div className="flex items-center gap-3 animate-pulse">
        {/* Cart skeleton */}
        <div className="w-9 h-9 bg-gray-200 rounded-xl" />
        {/* Avatar skeleton */}
        <div className="flex items-center gap-2 pr-3 border border-gray-100 rounded-2xl">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="w-3 h-3 bg-gray-200 rounded-full" />
        </div>
    </div>
);

const Header = () => {
    const { cartItems } = useCart();
    const { user, isSignedIn, isLoaded } = useUser(); // ✅ isLoaded is the key
    const { signOut } = useClerk();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const closeMobile = () => setMobileOpen(false);

    const navLinks = [
        { label: 'Services',  to: '/categories' },
        { label: 'Providers', to: '/providers' },
        { label: 'Blogs',     to: '/blogs' },
    ];

    return (
        <>
            <style>{`
                @keyframes fadeSlideIn {
                    from { opacity: 0; transform: translateY(-6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .nav-fade-in {
                    animation: fadeSlideIn 0.35s ease forwards;
                }
                @keyframes skeletonShimmer {
                    0%   { background-position: -400px 0; }
                    100% { background-position: 400px 0; }
                }
                .shimmer-bg {
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 400px 100%;
                    animation: skeletonShimmer 1.4s ease-in-out infinite;
                }
            `}</style>

            {/* ── Main Nav ── */}
            <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-[0_1px_20px_rgba(0,0,0,0.06)]">
                <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-4">

                    {/* Left: Logo */}
                    <Link to="/" onClick={closeMobile} className="flex items-center gap-2 shrink-0 group">
                        <div className="w-9 h-9 md:w-10 md:h-10 bg-black group-hover:bg-blue-600 rounded-xl flex items-center justify-center transition-colors duration-300">
                            <span className="text-white font-black text-lg md:text-xl">HS</span>
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="font-black text-[16px] md:text-[18px] tracking-tighter text-black uppercase">Handyman</span>
                            <span className="font-bold text-[10px] md:text-[12px] tracking-tight text-gray-400 uppercase">Pro Service</span>
                        </div>
                    </Link>

                    {/* Center: Desktop Nav Links */}
                    <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-gray-500">
                        {navLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="relative text-[15px] transition-colors hover:text-black group/link"
                            >
                                {link.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 rounded-full group-hover/link:w-full transition-all duration-300" />
                            </Link>
                        ))}
                    </div>

                    {/* Center: Location Selector */}
                    <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm xl:max-w-md">
                        <LocationSelector />
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 md:gap-3">

                        {/* ✅ Show skeleton until Clerk is ready */}
                        {!isLoaded ? (
                            <div className="hidden md:flex items-center gap-3">
                                <div className="shimmer-bg w-9 h-9 rounded-xl" />
                                <div className="flex items-center gap-2 pr-3 border border-gray-100 rounded-2xl overflow-hidden">
                                    <div className="shimmer-bg w-10 h-10 rounded-full" />
                                    <div className="shimmer-bg w-3 h-3 rounded-full mr-1" />
                                </div>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center gap-3 nav-fade-in">

                                {/* Cart */}
                                {isSignedIn && (
                                    <Link
                                        to="/shopping-cart"
                                        className="relative p-2.5 bg-gray-900 rounded-xl hover:bg-blue-600 group transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                                    >
                                        <ShoppingCart className="w-5 h-5 text-gray-100 group-hover:text-white transition-colors" />
                                        {cartItems.length > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-bounce">
                                                {cartItems.length}
                                            </span>
                                        )}
                                    </Link>
                                )}

                                {/* Sign In */}
                                <SignedOut>
                                    <SignInButton mode="modal">
                                        <Button className="bg-gray-900 text-white hover:bg-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 px-5 py-5 hover:scale-105 hover:shadow-[0_0_20px_rgba(59,130,246,0.35)]">
                                            <User className="w-4 h-4 mr-2" />
                                            Sign In
                                        </Button>
                                    </SignInButton>
                                </SignedOut>

                                {/* User Dropdown */}
                                <SignedIn>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <div className="flex items-center gap-2 pr-3 border-2 border-gray-100 hover:border-blue-200 rounded-2xl hover:bg-blue-50/50 transition-all duration-300 outline-none cursor-pointer group/avatar">
                                                <div className="relative">
                                                    <img
                                                        src={user?.imageUrl}
                                                        alt="profile"
                                                        className="w-10 h-10 rounded-full border-2 border-transparent group-hover/avatar:border-blue-400 object-cover transition-all duration-300"
                                                    />
                                                    {/* Online dot */}
                                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                                                </div>
                                                <ChevronDown className="w-4 h-4 text-gray-400 group-hover/avatar:text-blue-500 transition-colors duration-300" />
                                            </div>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent className="w-64 mt-2 rounded-[1.5rem] p-3 shadow-2xl border-gray-100" align="end">
                                            <DropdownMenuLabel className="px-3">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <img src={user?.imageUrl} alt="profile" className="w-10 h-10 rounded-full object-cover" />
                                                    <div className="flex flex-col min-w-0">
                                                        <p className="text-sm font-black text-gray-900 truncate">{user?.fullName}</p>
                                                        <p className="text-[11px] text-gray-400 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                                                    </div>
                                                </div>
                                            </DropdownMenuLabel>

                                            <DropdownMenuSeparator className="bg-gray-50" />

                                            <DropdownMenuGroup>
                                                <DropdownMenuItem onClick={() => navigate('/profile')} className="rounded-xl py-2.5 cursor-pointer group">
                                                    <UserCircle className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-600" />
                                                    <span className="font-bold text-gray-700">My Profile</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => navigate('/order-history')} className="rounded-xl py-2.5 cursor-pointer group">
                                                    <Package className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-600" />
                                                    <span className="font-bold text-gray-700">Bookings</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>

                                            <DropdownMenuSeparator className="bg-gray-50" />

                                            <DropdownMenuItem onClick={() => signOut()} className="rounded-xl py-2 cursor-pointer text-red-500 focus:bg-red-50 focus:text-red-600 group">
                                                <LogOut className="w-5 h-5 mr-3" />
                                                <span className="font-black uppercase text-[11px] tracking-widest">Logout</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </SignedIn>
                            </div>
                        )}

                        {/* Hamburger */}
                        <button
                            onClick={() => setMobileOpen(prev => !prev)}
                            className="lg:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all"
                            aria-label="Toggle menu"
                        >
                            {mobileOpen
                                ? <X size={20} className="text-gray-800" />
                                : <Menu size={20} className="text-gray-800" />
                            }
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── Mobile Drawer ── */}
            {/* Backdrop */}
            <div
                onClick={closeMobile}
                className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
                    mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
            />

            {/* Slide-in Panel */}
            <div className={`
                fixed top-0 right-0 h-full w-[80vw] max-w-sm z-50
                bg-white shadow-2xl flex flex-col
                transition-transform duration-300 ease-in-out lg:hidden
                ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>

                {/* Drawer Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                            <span className="text-white font-black text-sm">HS</span>
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="font-black text-sm tracking-tighter text-black uppercase">Handyman</span>
                            <span className="font-bold text-[9px] tracking-tight text-gray-400 uppercase">Pro Service</span>
                        </div>
                    </div>
                    <button onClick={closeMobile} className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
                        <X size={18} className="text-gray-700" />
                    </button>
                </div>

                {/* Location */}
                <div className="px-5 py-4 border-b border-gray-50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Your Location</p>
                    <LocationSelector />
                </div>

                {/* Nav Links */}
                <div className="flex flex-col px-3 py-4 gap-1 border-b border-gray-50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-3 mb-2">Menu</p>
                    {navLinks.map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            onClick={closeMobile}
                            className="flex items-center px-3 py-3 rounded-xl font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all text-[15px]"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* User Section */}
                <div className="flex flex-col px-3 py-4 gap-1 flex-1">

                    {/* Mobile skeleton while Clerk loads */}
                    {!isLoaded ? (
                        <div className="flex items-center gap-3 px-3 py-3 bg-gray-50 rounded-2xl mb-3 animate-pulse">
                            <div className="shimmer-bg w-10 h-10 rounded-full" />
                            <div className="flex flex-col gap-1.5 flex-1">
                                <div className="shimmer-bg h-3 w-24 rounded-full" />
                                <div className="shimmer-bg h-2 w-32 rounded-full" />
                            </div>
                        </div>
                    ) : (
                        <>
                            <SignedIn>
                                <div className="flex items-center gap-3 px-3 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl mb-3 border border-blue-100">
                                    <div className="relative">
                                        <img src={user?.imageUrl} alt="profile" className="w-10 h-10 rounded-full object-cover border-2 border-blue-200" />
                                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <p className="text-sm font-black text-gray-900 truncate">{user?.fullName}</p>
                                        <p className="text-[11px] text-gray-400 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                                    </div>
                                </div>

                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-3 mb-2">Account</p>

                                <button onClick={() => { navigate('/profile'); closeMobile(); }}
                                    className="flex items-center gap-3 px-3 py-3 rounded-xl font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all w-full text-left">
                                    <UserCircle size={18} className="text-gray-400" />
                                    My Profile
                                </button>

                                <button onClick={() => { navigate('/order-history'); closeMobile(); }}
                                    className="flex items-center gap-3 px-3 py-3 rounded-xl font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all w-full text-left">
                                    <Package size={18} className="text-gray-400" />
                                    Bookings
                                </button>
                            </SignedIn>

                            <SignedOut>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-3 mb-2">Account</p>
                                <SignInButton mode="modal">
                                    <button onClick={closeMobile}
                                        className="flex items-center gap-3 px-3 py-3 rounded-xl font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all w-full text-left">
                                        <User size={18} className="text-gray-400" />
                                        Sign In
                                    </button>
                                </SignInButton>
                            </SignedOut>
                        </>
                    )}
                </div>

                {/* Logout */}
                <SignedIn>
                    <div className="px-3 pb-6 pt-2 border-t border-gray-50">
                        <button
                            onClick={() => { signOut(); closeMobile(); }}
                            className="flex items-center gap-3 px-3 py-3 rounded-xl font-black text-red-500 hover:bg-red-50 transition-all w-full text-left text-[12px] uppercase tracking-widest"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                </SignedIn>
            </div>
        </>
    );
};

export default Header;