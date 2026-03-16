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

// --- UPDATED LIST SKELETON ---
const CategoryListSkeleton = () => (
    <div className="space-y-4 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-white rounded-2xl border border-slate-100 flex items-center px-6 space-x-4">
                <div className="w-10 h-10 bg-slate-100 rounded-xl" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-100 rounded w-1/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/6" />
                </div>
            </div>
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

    const generateSafeSlug = (text: string) => {
        return text
            .toLowerCase()
            .trim()
            .replace(/&/g, 'and')
            .replace(/[\s\W-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

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

    const handleDelete = async (id: string, name: string) => {
        toast(`Delete ${name}?`, {
            description: "Confirming will remove this category.",
            action: {
                label: "Delete",
                onClick: async () => {
                    try {
                        const token = await getToken();
                        await api.delete(`/categories/${id}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        setCategories(prev => prev.filter(c => c._id !== id));
                        toast.success("Category removed");
                    } catch (error: any) {
                        toast.error(error.response?.data?.message || "Delete failed");
                    }
                }
            }
        });
    };

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
                const res = await api.patch(`/categories/${editingId}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCategories(prev => prev.map(c => c._id === editingId ? res.data : c));
            } else {
                const res = await api.post('/categories/add', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCategories([res.data, ...categories]);
            }
            setShowModal(false);
        };

        toast.promise(action(), {
            loading: 'Saving changes...',
            success: 'Category updated!',
            error: (err) => err.response?.data?.message || 'Error saving'
        });
    };

    if (!hasAccess) return <div className="h-screen flex items-center justify-center font-black text-rose-500 uppercase">Unauthorized</div>;

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-12">
            <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Categories</h1>
                    <p className="text-slate-500 font-bold text-xs mt-1">Manage groupings and site taxonomy</p>
                </div>

                <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full sm:w-64 pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => handleOpenModal()} className="bg-slate-900 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                        <Plus size={18} />
                        <span>Add New</span>
                    </Button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto">
                {loading ? (
                    <CategoryListSkeleton />
                ) : (
                    <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
                        {/* Desktop Header */}
                        <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-5 border-b border-slate-50 bg-slate-50/30 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <div className="col-span-5">Category Name</div>
                            <div className="col-span-4">URL Slug</div>
                            <div className="col-span-3 text-right">Actions</div>
                        </div>

                        {/* List Items */}
                        <div className="divide-y divide-slate-50">
                            {filteredCategories.length > 0 ? (
                                filteredCategories.map(cat => (
                                    <div key={cat._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 md:px-8 py-5 items-center hover:bg-slate-50/50 transition-colors">
                                        <div className="col-span-5 flex items-center gap-4">
                                            <div className="hidden sm:flex p-3 bg-slate-100 text-slate-600 rounded-xl">
                                                <LayoutGrid size={18} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 leading-tight">{cat.name}</h3>
                                                {cat.description && <p className="text-xs text-slate-400 font-medium truncate max-w-[200px]">{cat.description}</p>}
                                            </div>
                                        </div>
                                        
                                        <div className="col-span-4 flex items-center gap-2 text-slate-400">
                                            <LinkIcon size={12} className="shrink-0" />
                                            <span className="text-xs font-bold tracking-tight truncate">{cat.slug}</span>
                                        </div>

                                        <div className="col-span-3 flex justify-end gap-2">
                                            <button onClick={() => handleOpenModal(cat)} className="p-2.5 bg-slate-50 text-slate-600 hover:bg-slate-900 hover:text-white rounded-lg transition-all">
                                                <Edit3 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(cat._id, cat.name)} className="p-2.5 bg-slate-50 text-slate-600 hover:bg-rose-500 hover:text-white rounded-lg transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-20 text-center">
                                    <p className="text-slate-400 font-bold">No categories found matching your search.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* Modal Logic Remains the same as previous version */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-10">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative bg-white w-full max-w-xl rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                        <div className="p-8 pb-4 flex justify-between items-center">
                            <h2 className="text-2xl font-black text-slate-900">{editingId ? 'Edit Category' : 'New Category'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 pt-0 no-scrollbar">
                            <form onSubmit={handleSubmit} id="cat-form" className="space-y-5">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Name</label>
                                    <input required className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-100 font-bold focus:ring-2 focus:ring-slate-900 outline-none mt-1" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Custom Slug</label>
                                    <input className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-100 font-bold outline-none mt-1" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Description</label>
                                    <textarea rows={2} className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-100 font-medium outline-none mt-1" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                </div>
                                <div className="p-5 bg-slate-50/50 rounded-3xl border border-slate-100 space-y-4">
                                    <div className="flex items-center gap-2"><Globe size={14} className="text-slate-400" /><span className="text-[10px] font-black uppercase tracking-widest text-slate-400">SEO Settings</span></div>
                                    <input placeholder="Meta Title" className="w-full p-3 bg-white rounded-xl border border-slate-100 font-bold text-sm outline-none" value={formData.metaTitle} onChange={e => setFormData({ ...formData, metaTitle: e.target.value })} />
                                    <textarea placeholder="Meta Description" className="w-full p-3 bg-white rounded-xl border border-slate-100 font-medium text-sm outline-none" value={formData.metaDescription} onChange={e => setFormData({ ...formData, metaDescription: e.target.value })} />
                                    <input placeholder="Keywords (comma separated)" className="w-full p-3 bg-white rounded-xl border border-slate-100 font-bold text-sm outline-none" value={formData.keywords} onChange={e => setFormData({ ...formData, keywords: e.target.value })} />
                                </div>
                            </form>
                        </div>
                        <div className="p-8 border-t border-slate-50">
                            <Button form="cat-form" type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                                {editingId ? 'Save Changes' : 'Create Category'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageCategories;