import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Users, ShieldAlert, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/api/api';

interface UserData {
  _id: string;
  clerkId: string;
  firstName: string;
  lastName: string;
  email: string;
  photo?: string;
  role: string;
  createdAt: string;
}

const UserDirectory = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRole, setEditingRole] = useState<string | null>(null); // Track which user is being edited
  const { getToken } = useAuth();

  const fetchUsers = async () => {
    try {
      const token = await getToken();
      const response = await api.get('/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [getToken]);

  // Update Role Handler
  const handleUpdateRole = async (clerkId: string, newRole: string) => {
    const rolePromise = async () => {
      const token = await getToken();
      await api.patch(`/admin/users/${clerkId}/role`, 
        { newRole }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(prev => prev.map(u => u.clerkId === clerkId ? { ...u, role: newRole } : u));
      setEditingRole(null);
    };

    toast.promise(rolePromise(), {
      loading: 'Updating permissions...',
      success: 'Access level modified successfully!',
      error: 'Failed to update role.',
    });
  };

  const handleDelete = async (clerkId: string, userName: string) => {
    toast(`Delete ${userName}?`, {
      description: "Permanently remove from Clerk and Database.",
      action: {
        label: "Confirm",
        onClick: async () => {
          const deletePromise = async () => {
            const token = await getToken();
            await api.delete(`/admin/users/${clerkId}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(prev => prev.filter(u => u.clerkId !== clerkId));
          };
          toast.promise(deletePromise(), {
            loading: 'Deleting...',
            success: 'User removed.',
            error: 'Delete failed.',
          });
        },
      },
    });
  };

  if (loading) return <div className="p-20 text-center animate-pulse font-bold text-slate-400">Loading Directory...</div>;

  return (
    <div className="p-4 max-w-7xl mx-auto animate-in fade-in duration-200">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-black text-slate-900">User Directory</h2>
        <div className="bg-white px-5 py-2 rounded-2xl border border-slate-100 flex items-center gap-2 shadow-sm">
          <Users size={20} className="text-indigo-500" />
          <span className="font-bold">{users.length} Users</span>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-xl shadow-slate-100">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="p-6">Identity</th>
              <th className="p-6">Access Level</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((user) => (
              <tr key={user._id} className="group hover:bg-slate-50/50 transition-all">
                <td className="p-6 flex items-center gap-4">
                  <img src={user.photo} className="w-12 h-12 rounded-2xl object-cover shadow-sm" alt="" />
                  <div>
                    <p className="font-bold text-slate-900">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-slate-400 font-medium">{user.email}</p>
                  </div>
                </td>
                <td className="p-6">
                  {editingRole === user.clerkId ? (
                    <div className="flex items-center gap-2">
                      <select 
                        className="text-xs font-bold p-1.5 border rounded-lg bg-white outline-none ring-2 ring-indigo-50"
                        defaultValue={user.role}
                        onChange={(e) => handleUpdateRole(user.clerkId, e.target.value)}
                      >
                        <option value="user">User</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button onClick={() => setEditingRole(null)} className="p-1 text-slate-400 hover:text-rose-500"><X size={16}/></button>
                    </div>
                  ) : (
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
                      user.role === 'admin' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                      user.role === 'manager' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                      'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {user.role}
                    </span>
                  )}
                </td>
                <td className="p-6 text-right flex justify-end gap-2">
                  <button 
                    onClick={() => setEditingRole(user.clerkId)}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                  >
                    <ShieldAlert size={20} />
                  </button>
                  <button 
                    onClick={() => handleDelete(user.clerkId, user.firstName)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
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