import { Mail, Phone, Edit2, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '../ui/button';

export const PartnerRow = ({ partner, mode, onEdit, onUpdateStatus }: any) => {
    const isPending = mode === 'pending';
    
    return (
        <tr className="hover:bg-slate-50/30 transition-colors group">
            <td className="p-6">
                <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-black border uppercase ${isPending ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                        {partner.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-black text-slate-900 text-sm">{partner.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{isPending ? 'Pending Request' : 'Verified'}</p>
                    </div>
                </div>
            </td>
            <td className="p-6 text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-2 font-bold"><Mail size={12} className="text-slate-300" /> {partner.email}</div>
                <div className="flex items-center gap-2 font-bold"><Phone size={12} className="text-slate-300" /> {partner.phone}</div>
            </td>
            <td className="p-6">
                <div className="flex flex-wrap gap-1 max-w-[180px]">
                    {partner.specializations?.map((s: string, i: number) => (
                        <span key={i} className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md text-[9px] font-black uppercase border border-indigo-100/50">{s}</span>
                    ))}
                </div>
            </td>
            <td className="p-6 text-center">
                <div className="flex items-center justify-center gap-2">
                    {isPending ? (
                        <>
                            <Button onClick={() => onUpdateStatus(partner._id, 'approved')} className="h-8 px-3 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border border-emerald-100 text-[10px] font-black uppercase transition-all">
                                <CheckCircle2 size={12} className="mr-1" /> Approve
                            </Button>
                            <Button onClick={() => onUpdateStatus(partner._id, 'rejected')} className="h-8 px-3 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-100 text-[10px] font-black uppercase transition-all">
                                <XCircle size={12} className="mr-1" /> Reject
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={() => onEdit(partner)} className="p-2 rounded-lg bg-white text-slate-400 hover:text-indigo-600 border border-slate-100 shadow-sm"><Edit2 size={14} /></Button>
                            <Button className="p-2 rounded-lg bg-white text-slate-400 hover:text-rose-600 border border-slate-100 shadow-sm"><Trash2 size={14} /></Button>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
};