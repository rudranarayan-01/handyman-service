import { Users, Clock } from 'lucide-react';


// ─── COMPONENT: STATUS TABS ──────────────────────────────────────────
const StatusTabs = ({ active, onChange }: { active: 'approved' | 'pending', onChange: (t: 'approved' | 'pending') => void }) => (
    <div className="flex gap-2 mb-8 bg-slate-200/50 p-1.5 rounded-[1.5rem] w-fit border border-slate-200">
        <button
            onClick={() => onChange('approved')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${active === 'approved' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
            <Users size={14} /> Active Fleet
        </button>
        <button
            onClick={() => onChange('pending')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${active === 'pending' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
            <Clock size={14} /> Approval Queue
        </button>
    </div>
);

export default StatusTabs;