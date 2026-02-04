import React from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";

const AuthModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
                <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-black">
                    <X className="w-6 h-6" />
                </button>

                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <ShieldCheck className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">Welcome Back</h2>
                    <p className="text-gray-500 font-medium">Join 1M+ happy customers. Log in to manage your bookings.</p>
                </div>

                <div className="space-y-4">
                    {/* Google Button */}
                    <Button
                        className="w-full h-16 bg-white border-2 border-gray-100 text-gray-700 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 hover:border-gray-200 transition-all text-lg shadow-sm"
                        onClick={() => { /* Google Auth0 Logic */ }}
                    >
                        <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-6 h-6" alt="Google" />
                        Continue with Google
                    </Button>

                    <div className="relative my-8 text-center">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
                        <span className="relative bg-white px-4 text-[10px] font-black text-gray-300 uppercase tracking-widest">or secure email</span>
                    </div>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full h-16 px-6 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-blue-600 focus:ring-0 transition-all outline-none font-medium"
                    />

                    <Button className="w-full h-16 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all">
                        Continue
                    </Button>
                </div>

                <p className="text-center mt-8 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    By continuing, you agree to our Terms & Privacy
                </p>
            </div>
        </div>
    );
};

export default AuthModal;