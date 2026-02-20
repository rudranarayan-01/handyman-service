import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, MessageSquare, Send, CheckCircle2, Trash2, Loader2 } from 'lucide-react';
import api from '@/api/api';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'sonner';

interface FeedbackProps {
    existingFeedback?: {
        rating: number;
        comment: string;
    };
    onSuccess: () => void;
}

const FeedbackSection: React.FC<FeedbackProps> = ({ existingFeedback, onSuccess }) => {
    const { id } = useParams<{ id: string }>();
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const { getToken } = useAuth();

    const handleDelete = async () => {
        toast("Delete Review?", {
            description: "Are you sure you want to remove your feedback?",
            action: {
                label: "Delete",
                onClick: async () => {
                    setLoading(true);
                    try {
                        const token = await getToken();
                        // Axios DELETE request
                        const res = await api.delete(`/orders/${id}/feedback`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });

                        if (res.status === 200) {
                            toast.success("Review deleted successfully!");
                            onSuccess();
                        }
                    } catch (err: any) {
                        console.error(err);
                        toast.error(err.response?.data?.message || "Failed to delete feedback");
                    } finally {
                        setLoading(false);
                    }
                },
            },
            cancel: {
                label: "Cancel",
                onClick: () => console.log("Delete cancelled"),
            },
        });
    };


    const handleSubmit = async () => {
        if (rating === 0) return alert("Please select a rating!");
        setLoading(true);
        try {
            const token = await getToken();
            const res = await api.patch(`/orders/${id}/feedback`,
                { rating, comment },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (res.status === 200) onSuccess();
            toast.success("Feedback added.")
        } catch (err: any) {
            console.error("Auth Error:", err.response?.data);
            toast.error(err.response?.status === 401 ? "Session expired. Please login again." : "No Token found!");
        } finally {
            setLoading(false);
        }
    };

    // --- CASE 1: Feedback Already Submitted (Flipkart Style Card) ---
    if (existingFeedback?.rating) {
        return (
            <div className="mt-8 p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm animate-in fade-in zoom-in-95 duration-500">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-100 p-2 rounded-xl">
                            <CheckCircle2 size={20} className="text-emerald-600" />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Your Review</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Submitted successfully</p>
                        </div>
                    </div>
                    <button
                        onClick={handleDelete}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Review"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                <div className="flex gap-1.5 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            size={18}
                            fill={star <= existingFeedback.rating ? "#fbbf24" : "transparent"}
                            className={star <= existingFeedback.rating ? "text-amber-400" : "text-slate-200"}
                        />
                    ))}
                    <span className="ml-2 text-sm font-black text-slate-700">{existingFeedback.rating}/5</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-slate-600 font-medium text-sm italic leading-relaxed">
                        "{existingFeedback.comment || "Bhai has left no words, just stars!"}"
                    </p>
                </div>
            </div>
        );
    }

    // --- CASE 2: Rating Form (New UI) ---
    return (
        <div className="mt-8 p-10 bg-slate-50 border border-slate-200 rounded-[3.5rem] relative overflow-hidden transition-all">
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                <Star size={120} />
            </div>

            <div className="relative z-10">
                <div className="mb-8">
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">How was the service?</h3>
                    <p className="text-slate-500 font-bold text-[11px] uppercase tracking-[0.2em] mt-2">Your feedback helps us improve for you</p>
                </div>

                {/* Stars UI - Modern Minimalist */}
                <div className="flex gap-4 mb-10">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            onClick={() => setRating(star)}
                            className={`group relative p-4 rounded-2xl transition-all duration-300 ${(hover || rating) >= star
                                ? 'bg-white shadow-xl shadow-amber-100 scale-110 ring-2 ring-amber-400'
                                : 'bg-white/50 hover:bg-white border border-slate-200'
                                }`}
                        >
                            <Star
                                size={28}
                                strokeWidth={2.5}
                                className={`transition-colors duration-300 ${(hover || rating) >= star ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                                    }`}
                            />
                            {/* Star Label Tooltip */}
                            <span className={`absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase transition-opacity ${rating === star ? 'opacity-100' : 'opacity-0'}`}>
                                {star === 1 && "Bad"}
                                {star === 2 && "Okay"}
                                {star === 3 && "Good"}
                                {star === 4 && "Great"}
                                {star === 5 && "Best"}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Comment Box */}
                <div className="relative group mb-6">
                    <div className="absolute left-5 top-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                        <MessageSquare size={20} />
                    </div>
                    <textarea
                        placeholder="Tell us what you loved or what we can fix..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-[2rem] outline-none focus:ring-4 focus:ring-indigo-50 transition-all text-sm font-medium min-h-[140px] resize-none shadow-sm"
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading || rating === 0}
                    className="group w-full md:w-auto bg-slate-900 text-white px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-2xl active:scale-95"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={18} />
                    ) : (
                        <>
                            Submit Review
                            <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default FeedbackSection;