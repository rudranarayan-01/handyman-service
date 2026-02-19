import React from 'react'
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

const SidebarItem = ({ id, label, icon, activeTab, setActiveTab, url }: any) => (
    <Link to={url}>
        <span 
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 font-bold text-sm ${activeTab === id
                    ? 'bg-indigo-100 text-gray-900 shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:bg-slate-100 hover:text-slate-800'
                }`}
        >
            {icon} {label}
        </span>
    </Link>
);
export default SidebarItem