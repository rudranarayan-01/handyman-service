import React, { useEffect, useState, useMemo } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Plus, Edit3, Trash2, X, Search, LayoutGrid, Globe, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/api/api';
import { Button } from '../ui/button';

// --- INTERFACES ---
interface CategoryData {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    seo?: {
        metaTitle: string;
        metaDescription: string;
        keywords: string[];
    };
}

const CategorySkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 bg-slate-100 rounded-[2rem] border border-slate-50" />
        ))}
    </div>
);

const ManageCategories = () => {
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        metaTitle: '',
        metaDescription: '',
        keywords: ''
    });

    const { getToken } = useAuth();
    const { user, isLoaded } = useUser();
    const hasAccess = user?.publicMetadata?.role === 'admin' || user?.publicMetadata?.role === 'manager';

    useEffect(() => {
        document.body.style.overflow = showModal ? 'hidden' : 'unset';
    }, [showModal]);

    // --- FETCH DATA ---
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const token = await getToken();
            const res = await api.get('/categories', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCategories(res.data);
        } catch (error) {
            toast.error("Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (isLoaded && hasAccess) fetchCategories(); }, [isLoaded, hasAccess]);

    // --- SLUG GENERATOR ---
    const generateSafeSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/&/g, 'and')
            .replace(/[\s\W-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    // --- SEARCH LOGIC ---
    const filteredCategories = useMemo(() => {
        return categories.filter(c =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [categories, searchQuery]);

    const handleOpenModal = (cat?: CategoryData) => {
        if (cat) {
            setEditingId(cat._id);
            setFormData({
                name: cat.name,
                slug: cat.slug,
                description: cat.description || '',
                metaTitle: cat.seo?.metaTitle || '',
                metaDescription: cat.seo?.metaDescription || '',
                keywords: cat.seo?.keywords?.join(', ') || ''
            });
        } else {
            setEditingId(null);
            setFormData({ name: '', slug: '', description: '', metaTitle: '', metaDescription: '', keywords: '' });
        }
        setShowModal(true);
    };

    // --- DELETE LOGIC ---
    const handleDelete = async (id: string, name: string) => {
        toast(`Delete ${name}?`, {
            description: "Checking for active services first...",
            action: {
                label: "Confirm Delete",
                onClick: async () => {
                    try {
                        const token = await getToken();
                        // Matching your router.delete('/:id')
                        await api.delete(`/categories/${id}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });

                        setCategories(prev => prev.filter(c => c._id !== id));
                        toast.success("Category removed successfully");
                    } catch (error: any) {
                        // This catches the "connectedServices > 0" error from your backend
                        const errMsg = error.response?.data?.message || "Delete failed";
                        toast.error(errMsg);
                    }
                }
            }
        });
    };

    // --- SUBMIT (CREATE/UPDATE) LOGIC ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = await getToken();

        const action = async () => {
            const payload = {
                name: formData.name,
                description: formData.description,
                slug: formData.slug || generateSafeSlug(formData.name),
                seo: {
                    metaTitle: formData.metaTitle,
                    metaDescription: formData.metaDescription,
                    keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k !== "")
                }
            };

            if (editingId) {
                // Matching your router.patch('/:id')
                const res = await api.patch(`/categories/${editingId}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCategories(prev => prev.map(c => c._id === editingId ? res.data : c));
            } else {
                // Matching your router.post('/add')
                const res = await api.post('/categories/add', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCategories([res.data, ...categories]);
            }
            setShowModal(false);
        };

        toast.promise(action(), {
            loading: 'Updating database...',
            success: 'Category saved!',
            error: (err) => err.response?.data?.message || 'Error saving category'
        });
    };

    if (!hasAccess) return <div className="h-screen flex items-center justify-center font-black text-rose-500 uppercase tracking-widest">Unauthorized Access</div>;

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-12">
            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>

            <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 md:mb-16">
                <div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-2">Categories</h1>
                    <p className="text-slate-500 font-bold text-xs md:text-sm">Manage service groupings and SEO taxonomy</p>
                </div>

                <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
                    <div className="relative flex-1 sm:min-w-75">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Filter categories..."
                            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => handleOpenModal()} className="bg-slate-900 text-white px-6 py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-xl">
                        <Plus size={20} />
                        <span>Add Category</span>
                    </Button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto">
                {loading ? (
                    <CategorySkeleton />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCategories.map(cat => (
                            <div key={cat._id} className="group bg-white p-6 rounded-[2rem] border border-slate-100 hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                                        <LayoutGrid size={24} />
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleOpenModal(cat)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                                            <Edit3 size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(cat._id, cat.name)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-1">{cat.name}</h3>
                                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                    <LinkIcon size={12} />
                                    {cat.slug}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-10">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setShowModal(false)} />
                    <div className="relative bg-white w-full max-w-2xl rounded-t-[2.5rem] md:rounded-[3rem] shadow-2xl flex flex-col max-h-[95vh] animate-in slide-in-from-bottom md:zoom-in-95 duration-300">
                        <div className="p-6 md:p-8 pb-4 flex justify-between items-center">
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                                {editingId ? 'Edit Category' : 'New Category'}
                            </h2>
                            <Button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-50 rounded-xl">
                                <X size={24} className="text-slate-400" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-8 pt-0">
                            <form onSubmit={handleSubmit} id="cat-form" className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Category Name</label>
                                        <input required className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-100 font-bold focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Custom Slug (URL Path)</label>
                                        <input placeholder="Ex: hair-care-services" className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-100 font-bold outline-none" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Description</label>
                                        <textarea rows={2} className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-100 font-medium outline-none text-sm" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                    </div>

                                    {/* SEO SECTION */}
                                    <div className="pt-4">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Globe size={16} className="text-indigo-500" />
                                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">SEO Strategy</h3>
                                        </div>
                                        <div className="space-y-4 bg-slate-50/50 p-4 rounded-3xl border border-slate-100">
                                            <div>
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Meta Title</label>
                                                <input placeholder="Browser Tab Title..." className="w-full p-3 bg-white rounded-xl border-none ring-1 ring-slate-100 font-bold text-sm outline-none" value={formData.metaTitle} onChange={e => setFormData({ ...formData, metaTitle: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Meta Description</label>
                                                <textarea placeholder="Search engine snippet..." rows={2} className="w-full p-3 bg-white rounded-xl border-none ring-1 ring-slate-100 font-medium text-sm outline-none" value={formData.metaDescription} onChange={e => setFormData({ ...formData, metaDescription: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Keywords</label>
                                                <input placeholder="wellness, grooming, spa..." className="w-full p-3 bg-white rounded-xl border-none ring-1 ring-slate-100 font-bold text-sm outline-none" value={formData.keywords} onChange={e => setFormData({ ...formData, keywords: e.target.value })} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="p-6 md:p-8 border-t border-slate-50">
                            <Button form="cat-form" type="submit" className="w-full py-4 md:py-6 bg-slate-900 text-white rounded-2xl md:rounded-3xl font-black text-lg md:text-xl hover:bg-indigo-600 transition-all">
                                {editingId ? 'Update Category' : 'Create Category'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageCategories;