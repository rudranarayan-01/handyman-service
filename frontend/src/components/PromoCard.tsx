import React from 'react';

// 1. Define types for your props
interface PromoCardProps {
    title: string;
    subtitle: string;
    btnText: string;
    image: string;
    bgColor: string;
    textColor?: string; // Optional (default value niche di hai)
    btnBg?: string;     // Optional
}

const PromoCard: React.FC<PromoCardProps> = ({
    title,
    subtitle,
    btnText,
    image,
    bgColor,
    textColor = "text-black",
    btnBg = "bg-[#5c4033]"
}) => {
    return (
        <div className={`${bgColor} w-full rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row min-h-87.5 relative border border-gray-100/50`}>

            {/* Left Section: Content */}
            <div className={`flex-1 p-10 md:p-14 flex flex-col justify-center items-start ${textColor} z-10`}>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-3 leading-[1.1]">
                    {title}
                </h2>
                <p className="text-lg md:text-xl font-medium opacity-80 mb-10">
                    {subtitle}
                </p>

                <button className={`${btnBg} text-white px-10 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-black/10`}>
                    {btnText}
                </button>
            </div>

            {/* Right Section: Image with that "Floating" look */}
            <div className="flex-1 p-6 md:p-8 flex items-center justify-center">
                <div className="w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl ring-8 ring-white/10">
                    <img
                        loading='lazy'
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                    />
                </div>
            </div>
        </div>
    );
};

export default PromoCard;