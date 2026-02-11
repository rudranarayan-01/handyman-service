import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Users, ShieldAlert, Trash2, Mail } from 'lucide-react';
import api from '@/api/api';

const UserDirectory = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await getToken();
        // console.log(token)
        const response = await api.get('/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("User fetched")
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [getToken]);

  if (loading) return <div className="p-10 text-center font-bold">Loading User Directory...</div>;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-slate-900">User Directory</h2>
        <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 flex items-center gap-2">
            <Users size={18} className="text-slate-400"/>
            <span className="font-bold text-slate-900">{users.length} Total Registered</span>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    <th className="p-5">User Details</th>
                    <th className="p-5">Joined On</th>
                    <th className="p-5">Role</th>
                    <th className="p-5 text-right">Management</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
                {users.map((user: any) => (
                    <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-5 flex items-center gap-4">
                            <img src={user.photo} alt="profile" className="w-10 h-10 rounded-full object-cover" />
                            <div>
                                <p className="font-bold text-slate-900">{user.firstName} {user.lastName}</p>
                                <p className="text-xs text-slate-400 flex items-center gap-1"><Mail size={12}/> {user.email}</p>
                            </div>
                        </td>
                        <td className="p-5 text-sm font-medium text-slate-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-5">
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                user.role === 'admin' ? 'bg-rose-50 text-rose-600' : 
                                user.role === 'manager' ? 'bg-indigo-50 text-indigo-600' : 
                                'bg-slate-100 text-slate-600'
                            }`}>
                                {user.role}
                            </span>
                        </td>
                        <td className="p-5 text-right space-x-2">
                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Change Role"><ShieldAlert size={18}/></button>
                            <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Delete User"><Trash2 size={18}/></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDirectory;