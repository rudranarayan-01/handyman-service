import { useEffect, useState } from 'react';
import {
    ShieldCheck,
    ShieldAlert,
    AlertTriangle,
    Globe,
    Search
} from 'lucide-react';
import { format } from 'date-fns';
import api from '@/api/api';

type Log = {
    _id: string;
    title: string;
    description: string;
    module: string;
    status: 'success' | 'warning' | 'failure';
    performer: {
        username: string;
        email: string;
    };
    ipAddress: string;
    userAgent: string;
    timestamp: string;
};

const LogsPage = () => {
    const [logs, setLogs] = useState<Log[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
            const { data } = await api.get('/admin/logs');
            setLogs(Array.isArray(data) ? data : data.logs);
        };
        fetchLogs();
    }, []);

    // 🔹 Status UI mapping
    const getStatusUI = (status: string) => {
        switch (status) {
            case 'success':
                return {
                    color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
                    icon: <ShieldCheck size={14} />,
                    label: 'Success'
                };
            case 'warning':
                return {
                    color: 'bg-yellow-50 text-yellow-600 border-yellow-200',
                    icon: <AlertTriangle size={14} />,
                    label: 'Warning'
                };
            case 'failure':
                return {
                    color: 'bg-rose-50 text-rose-600 border-rose-200',
                    icon: <ShieldAlert size={14} />,
                    label: 'Failure'
                };
            default:
                return {
                    color: 'bg-slate-100 text-slate-500',
                    icon: null,
                    label: status
                };
        }
    };

    // 🔹 Description formatter
    const formatDescription = (desc: string) => {
        try {
            if (desc.includes('Changes: {')) {
                const [text, jsonPart] = desc.split('Changes: ');
                const changes = JSON.parse(jsonPart);

                return (
                    <div>
                        <p className="text-slate-600">{text}</p>
                        <pre className="mt-2 text-[10px] bg-slate-900 text-indigo-300 p-3 rounded-xl overflow-x-auto">
                            {JSON.stringify(changes, null, 2)}
                        </pre>
                    </div>
                );
            }
            return <p>{desc}</p>;
        } catch {
            return <p>{desc}</p>;
        }
    };

    const filteredLogs = logs.filter(l =>
        l.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900">
                            Audit Logs
                        </h1>
                        <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">
                            System Activity Monitoring
                        </p>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input
                            placeholder="Search logs..."
                            className="pl-10 pr-4 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 outline-none w-64"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">

                        <thead className="bg-slate-50 text-[10px] uppercase text-slate-400 tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Event</th>
                                <th className="px-6 py-4">Performer</th>
                                <th className="px-6 py-4 text-center">Context</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Time</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">

                            {filteredLogs.map((log) => {
                                const statusUI = getStatusUI(log.status);

                                return (
                                    <tr key={log._id} className="group hover:bg-slate-50 transition">

                                        {/* Event */}
                                        <td className="px-6 py-5 max-w-md">
                                            <div className="space-y-1 relative">

                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[9px] font-bold rounded">
                                                        {log.module}
                                                    </span>

                                                    <h3 className="text-sm font-bold text-slate-800">
                                                        {log.title}
                                                    </h3>
                                                </div>

                                                {/* Hover Description */}
                                                <div className="text-xs text-slate-500 line-clamp-1 group-hover:line-clamp-none transition-all">
                                                    {formatDescription(log.description)}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Performer */}
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 bg-slate-100 rounded-xl flex items-center justify-center text-xs font-bold">
                                                    {log.performer?.username?.slice(0, 2) || 'NA'}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold">
                                                        {log.performer?.username || 'System'}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400">
                                                        {log.performer?.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Context */}
                                        <td className="px-6 py-5 text-center">
                                            <div className="flex flex-col items-center gap-1 text-xs">
                                                <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded">
                                                    <Globe size={10} />
                                                    {log.ipAddress === '::1'
                                                        ? 'Localhost'
                                                        : log.ipAddress}
                                                </div>
                                                <span className="text-[9px] text-slate-400 truncate max-w-[100px]">
                                                    {log.userAgent?.split(' ')[0]}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-5 text-center">
                                            <span
                                                className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full border ${statusUI.color}`}
                                            >
                                                {statusUI.icon}
                                                {statusUI.label}
                                            </span>
                                        </td>

                                        {/* Time */}
                                        <td className="px-6 py-5 text-right">
                                            <p className="text-xs font-bold text-slate-700">
                                                {format(new Date(log.timestamp), 'MMM dd, yyyy')}
                                            </p>
                                            <p className="text-[10px] text-indigo-500 font-semibold">
                                                {format(new Date(log.timestamp), 'hh:mm:ss a')}
                                            </p>
                                        </td>

                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {/* Empty State */}
                    {filteredLogs.length === 0 && (
                        <div className="text-center py-12 text-slate-400 text-sm">
                            No logs found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LogsPage;