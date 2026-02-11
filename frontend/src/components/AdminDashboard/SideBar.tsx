import React from 'react'
import { Link } from 'react-router-dom';

const SidebarItem = ({ id, label, icon, activeTab, setActiveTab, url }: any) => (
    <Link to={url}>
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 font-bold text-sm ${activeTab === id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
        >
            {icon} {label}
        </button>
    </Link>
);
export default SidebarItem