import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Users, Trash2, X, Search, Mail, ShieldCheck, Shield, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/api/api';
import { Button } from '../ui/button';

// --- SKELETON LOADER COMPONENT ---
const DirectorySkeleton = () => (
  <div className="p-4 max-w-7xl mx-auto animate-pulse">
    <div className="flex justify-between items-center mb-10">
      <div className="h-10 w-48 bg-slate-200 rounded-xl" />
      <div className="h-10 w-24 bg-slate-200 rounded-2xl" />
    </div>
    <div className="h-12 w-full max-w-md bg-slate-200 rounded-2xl mb-6" />
    <div className="bg-white rounded-[2.5rem] border border-slate-100 h-96 shadow-sm" />
  </div>
);

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
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
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

  // --- SEARCH FILTER ---
  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

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
      success: 'Access level modified!',
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

  if (loading) return <DirectorySkeleton />;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">User Directory</h2>
          <p className="text-slate-400 text-sm font-bold mt-1 uppercase tracking-widest flex items-center gap-2">
            <Users size={14} /> Total Staff: {users.length}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-bold text-sm shadow-sm"
          />
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100 hidden md:table-header-group">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="p-6">Identity</th>
                <th className="p-6 text-center">Access Level</th>
                <th className="p-6 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="group hover:bg-slate-50/50 transition-all flex flex-col md:table-row p-4 md:p-0">
                    {/* Identity Column */}
                    <td className="p-2 md:p-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img src={user.photo} className="w-12 h-12 md:w-14 md:h-14 rounded-2xl object-cover shadow-sm border-2 border-white" alt="" />
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${user.role === 'admin' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-slate-900 text-base md:text-lg truncate">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-slate-400 font-bold flex items-center gap-1 truncate"><Mail size={12} /> {user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role Column */}
                    <td className="p-2 md:p-6 text-left md:text-center">
                      <div className="flex md:justify-center items-center h-full">
                        {editingRole === user.clerkId ? (
                          <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-300">
                            <div className="relative group">
                              <select
                                className="appearance-none text-[11px] font-bold py-2.5 pl-4 pr-10 border-2 border-indigo-100 rounded-2xl bg-white text-slate-700 outline-none ring-4 ring-indigo-50/50 hover:border-indigo-300 transition-all cursor-pointer shadow-sm"
                                defaultValue={user.role}
                                onChange={(e) => handleUpdateRole(user.clerkId, e.target.value)}
                              >
                                <option value="user">User</option>
                                <option value="manager">Manager</option>
                                <option value="admin">Admin</option>
                              </select>
                              {/* Custom Chevron for the select */}
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-400">
                                <ChevronDown size={14} strokeWidth={3} />
                              </div>
                            </div>

                            <Button
                              onClick={() => setEditingRole(null)}
                              variant="ghost"
                              className="h-10 w-10 p-0 rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-600 transition-colors"
                            >
                              <X size={18} strokeWidth={2.5} />
                            </Button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setEditingRole(user.clerkId)}
                            className={`group relative flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.12em] border-2 transition-all duration-300 hover:shadow-lg active:scale-95 ${user.role === 'admin'
                                ? 'bg-white text-rose-600 border-rose-100 hover:border-rose-300 hover:bg-rose-50/30'
                                : user.role === 'manager'
                                  ? 'bg-white text-indigo-600 border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50/30'
                                  : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                              }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${user.role === 'admin' ? 'bg-rose-500' :
                                user.role === 'manager' ? 'bg-indigo-500' : 'bg-slate-400'
                              }`} />
                            {user.role}
                            <Shield size={12} className="opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Actions Column */}
                    <td className="p-2 md:p-6">
                      <div className="flex justify-end gap-2 md:gap-3">
                        <Button
                          variant='ghost'
                          onClick={() => setEditingRole(user.clerkId)}
                          className="h-10 w-10 p-0 text-slate-800 bg-blue-100 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                          title="Modify Access"
                        >
                          <ShieldCheck size={20} />
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleDelete(user.clerkId, user.firstName)}
                          className="h-10 w-10 p-0 border-slate-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all shadow-sm"
                          title="Delete User"
                        >
                          <Trash2 size={20} className='text-rose-500' />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-4 bg-slate-50 rounded-full text-slate-300">
                        <Users size={40} />
                      </div>
                      <p className="font-black text-slate-400 uppercase tracking-widest text-xs">No users matched your search</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDirectory;