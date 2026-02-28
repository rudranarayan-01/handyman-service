import { Link } from 'react-router-dom';

// --- SIDEBAR SKELETON ---
export const SidebarItemSkeleton = () => (
    <div className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-200/50 animate-pulse mb-2">
        <div className="w-5 h-5 bg-slate-300 rounded-md" />
        <div className="h-4 bg-slate-300 rounded-md w-24" />
    </div>
);

const SidebarItem = ({ id, label, icon, activeTab, setActiveTab, url = "#", onItemClick }: any) => {
    const isActive = activeTab === id;

    const handleClick = () => {
        setActiveTab(id);
        if (onItemClick) onItemClick(); 
    };

    return (
        <Link to={url} onClick={handleClick} className="relative group block no-underline">
            <div className={`
                relative w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 font-black text-sm overflow-hidden
                ${isActive 
                    ? 'text-slate-900 shadow-[0_10px_20px_-5px_rgba(79,70,229,0.3)] scale-[1.02]' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
                }
            `}>
                {isActive && (
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-white" />
                        {/* Mesh Animation */}
                        <div className="absolute inset-0 opacity-40 bg-[length:200%_200%] bg-gradient-to-r from-indigo-200 via-purple-100 to-indigo-200 animate-mesh-slow" />
                    </div>
                )}

                <span className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-110 text-indigo-600' : 'group-hover:translate-x-1'}`}>
                    {icon}
                </span>
                <span className="relative z-10 uppercase tracking-widest text-[10px]">
                    {label}
                </span>
            </div>
        </Link>
    );
};

export default SidebarItem;