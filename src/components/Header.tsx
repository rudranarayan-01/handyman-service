import { Search, ShoppingCart, User, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button"
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

const Header = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-100 w-full bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 h-18 flex items-center justify-between">

                {/* Left: Logo & Links */}
                <div className="flex items-center gap-10">
                    <div className="flex items-center gap-2 cursor-pointer">
                        <div className="w-9 h-9 bg-black rounded-md flex items-center justify-center">
                            <a href="/">
                                <span className="text-white font-bold text-xl">HS</span>
                            </a>
                        </div>
                        <div >
                            <a href="/" className="flex flex-col leading-none sm:flex">
                                <span className="font-bold text-[18px] tracking-tighter text-black uppercase">Handyman</span>
                                <span className="font-medium text-[14px] tracking-tight text-gray-500">Service</span>
                            </a>
                        </div>
                    </div>

                    <div className='items-center gap-6 hidden lg:flex'>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="flex items-center cursor-pointer font-bold hover:text-black transition-colors">
                                    <span>Categories</span>
                                    <ChevronDown className="w-4 h-4 inline-block ml-1 text-gray-400" />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuItem>Profile</DropdownMenuItem>
                                    <DropdownMenuItem>Billing</DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>Team</DropdownMenuItem>
                                    <DropdownMenuItem>Subscription</DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <a href="/services" className="hover:text-black transition-colors">Services</a>
                        <a href="/providers" className="hover:text-black transition-colors">Providers</a>
                        <a href="/blogs" className="hover:text-black transition-colors">Blogs</a>
                    </div>


                </div>

                {/* Center: Search & Location (Combined modern look) */}
                <div className="flex items-center gap-4 flex-1 max-w-2xl mx-8">
                    {/* Location Dropdown */}
                    <LocationSelector />

                    {/* Search Input */}
                    <div className="flex items-center flex-1 px-4 gap-3 border border-gray-200 rounded-lg bg-white shadow-sm focus-within:border-black transition-all">
                        <Search className="w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search for 'Facial', 'AC Repair'..."
                            className="w-full bg-transparent border-none py-2 text-sm focus:outline-none placeholder:text-gray-400 font-normal"
                        />
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-4">
                    <Button className="p-2.5 hover:bg-gray-100 rounded-full transition-colors border border-transparent hover:border-gray-200">
                        <a href="/shopping-cart">
                            <ShoppingCart className="w-5 h-5 text-white" />
                        </a>
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button>
                                <User className="w-5 h-5 mr-2" />
                                <span className="hidden sm:inline-block mr-2">Sign In</span>
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuGroup>
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuItem><a href="/profile">Profile</a></DropdownMenuItem>
                                <DropdownMenuItem><a href="/billing">Billing</a></DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600 font-bold"><a href="/logout">Logout</a></DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

            </div>
        </nav>
    );
};

export default Header;