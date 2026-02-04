import { Search, ShoppingCart, User, ChevronDown, LogOut, Package, UserCircle } from 'lucide-react';
import { useCart } from "@/context/CartContext"; // Import Cart hook
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
import { SignedIn, SignedOut, SignInButton, useClerk, UserButton, useUser } from "@clerk/clerk-react";

const Header = () => {
    const { cartItems } = useCart(); // Cart count ke liye
    const { user } = useUser(); // Get logged-in user details
    const { signOut } = useClerk(); // Clerk signout method
    const navigate = useNavigate();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-white border-b border-gray-100 backdrop-blur-md bg-white/90">
            <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">

                {/* Left: Logo & Links */}
                <div className="flex items-center gap-10">
                    <Link to="/" className="flex items-center gap-2 cursor-pointer group">
                        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center transition-colors">
                            <span className="text-white font-black text-xl">HS</span>
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="font-black text-[18px] tracking-tighter text-black uppercase">Handyman</span>
                            <span className="font-bold text-[12px] tracking-tight text-gray-400 uppercase">Pro Service</span>
                        </div>
                    </Link>

                    <div className='items-center gap-8 hidden lg:flex text-sm font-bold text-gray-700'>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="flex items-center px-2 py-2 cursor-pointer font-bold hover:text-black transition-colors">
                                    <span>Categories</span>
                                    <ChevronDown className="w-4 h-4 inline-block ml-1 text-gray-400" />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem><a href="/categories/home-maintenance">Home Maintenance</a></DropdownMenuItem>
                                    <DropdownMenuItem><a href="/categories/cleaning-pest-control">Cleaning & Pest Control</a></DropdownMenuItem>
                                    <DropdownMenuItem><a href="/categories/appliance-repair">Appliance Repair</a></DropdownMenuItem>
                                    <DropdownMenuItem><a href="/categories/home-renovations">Home Renovations</a></DropdownMenuItem>
                                    <DropdownMenuItem><a href="/categories/security-smart-home">Security & Smart Home</a></DropdownMenuItem>
                                    <DropdownMenuItem><a href="/categories/outdoor-lifestyle">Outdoor & Lifestyle</a></DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>

                        </DropdownMenu>
                        <Link to="/providers" className="hover:text-black transition-colors">Providers</Link>
                        <Link to="/blogs" className="hover:text-black transition-colors">Blogs</Link>
                    </div>
                </div>

                {/* Center: Search */}
                <div className="hidden md:flex items-center gap-4 flex-1 max-w-xl mx-8">
                    <LocationSelector />
                    <div className="flex items-center flex-1 px-4 gap-3 border border-gray-100 rounded-2xl bg-gray-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-50/50 transition-all">
                        <Search className="w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search for services..."
                            className="w-full bg-transparent border-none py-3 text-sm focus:outline-none placeholder:text-gray-400 font-medium"
                        />
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    {/* Cart Icon with Badge */}
                    <Link to="/shopping-cart" className="relative p-2  bg-gray-900 rounded-lg transition-all mr-2">
                        <ShoppingCart className="w-5 h-5 text-gray-100 hover:text-blue-400" />
                        {cartItems.length > 0 && (
                            <span className="absolute top-1.5 right-1.5 bg-blue-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                                {cartItems.length}
                            </span>
                        )}
                    </Link>

                    {/* Authentication Buttons */}
                    <SignedOut>
                        <SignInButton mode="modal">
                            <Button className="bg-gray-900 text-white hover:bg-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all px-6 py-6">
                                <User className="w-4 h-4 mr-2" />
                                Sign In
                            </Button>
                        </SignInButton>
                    </SignedOut>

                    <SignedIn>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="flex items-center gap-2 pr-3 border border-gray-100 rounded-2xl hover:bg-gray-100 transition-all outline-none">
                                    <img
                                        src={user?.imageUrl}
                                        alt="profile"
                                        className="w-8 h-8 rounded-2xl border border-gray-100 object-cover"
                                    />
                                    <ChevronDown className="w-4 h-4 text-gray-600" />
                                </div>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="w-64 mt-2 rounded-[1.5rem] p-3 shadow-2xl border-gray-100" align="end">
                                <DropdownMenuLabel className="px-3">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Account</p>
                                    <p className="text-sm font-black text-gray-900 truncate">{user?.fullName || user?.primaryEmailAddress?.emailAddress}</p>
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator className="bg-gray-50" />

                                <DropdownMenuGroup className="">
                                    {/* Direct Redirect to /profile */}
                                    <DropdownMenuItem
                                        onClick={() => navigate('/profile')}
                                        className="rounded-xl py-1 cursor-pointer group"
                                    >
                                        <UserCircle className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-600" />
                                        <span className="font-bold text-gray-700">My Profile</span>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() => navigate('/order-history')}
                                        className="rounded-xl py-3 cursor-pointer group"
                                    >
                                        <Package className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-600" />
                                        <span className="font-bold text-gray-700">Bookings</span>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>

                                <DropdownMenuSeparator className="bg-gray-50" />

                                <DropdownMenuItem
                                    onClick={() => signOut()}
                                    className="rounded-xl py-2 cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600 group"
                                >
                                    <LogOut className="w-5 h-5 mr-3" />
                                    <span className="font-black uppercase text-[11px] tracking-widest">Logout</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SignedIn>
                </div>
            </div>
        </nav>
    );
};

export default Header;