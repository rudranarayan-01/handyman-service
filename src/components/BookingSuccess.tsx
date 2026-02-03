import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

const BookingSuccess = () => {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center">
                {/* Animated Icon Container */}
                <div className="mb-8 relative inline-block">
                    <div className="absolute inset-0 bg-emerald-100 rounded-full scale-150 blur-2xl opacity-50 animate-pulse" />
                    <CheckCircle2 className="w-24 h-24 text-emerald-500 relative z-10 mx-auto stroke-[1.5px]" />
                </div>

                <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-4">
                    Booking <span className="text-emerald-500">Confirmed!</span>
                </h1>
                <p className="text-gray-500 font-medium mb-10">
                    Your service professional will arrive at your doorstep as per the scheduled time.
                </p>

                {/* Info Card */}
                <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100 mb-10 text-left space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                            <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date & Time</p>
                            <p className="font-bold text-gray-900 text-sm">Tomorrow, 10:00 AM - 11:00 AM</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                            <MapPin className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Service Location</p>
                            <p className="font-bold text-gray-900 text-sm truncate max-w-[200px]">H-15, Green Park, New Delhi</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                    <Link to="/">
                        <Button className="w-full bg-gray-900 text-white py-7 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-gray-200">
                            Back to Home
                        </Button>
                    </Link>
                    
                </div>
            </div>
        </div>
    );
};

export default BookingSuccess;