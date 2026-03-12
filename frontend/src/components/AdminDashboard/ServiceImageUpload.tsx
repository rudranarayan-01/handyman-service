import React, { useState } from 'react';
import { Upload, X, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface ServiceImageUploadProps {
    value: string;
    onChange: (url: string) => void;
}

const ServiceImageUpload = ({ value, onChange }: ServiceImageUploadProps) => {
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);

        formData.append('folder', 'services'); // Optional: Organize uploads in a "services" folder

        setIsUploading(true);
        setProgress(0);

        try {
            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                formData,
                {
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
                        setProgress(percentCompleted);
                    },
                }
            );

            const optimizedUrl = res.data.secure_url.replace('/upload/', '/upload/f_auto,q_auto/');
            onChange(optimizedUrl);
            toast.success("Image updated successfully!");
        } catch (err: any) {
            toast.error("Upload failed");
        } finally {
            setIsUploading(false);
            setProgress(0);
        }
    };

    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                Service Image
            </label>
            
            <div className="relative group">
                {value ? (
                    <div className="relative h-48 w-full rounded-3xl overflow-hidden border-2 border-slate-100 shadow-sm transition-all group-hover:border-indigo-200">
                        <img src={value} alt="Service" className="w-full h-full object-cover" />
                        
                        {/* Overlay for Replace/Delete */}
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <label className="p-3 bg-white text-slate-900 rounded-2xl cursor-pointer hover:scale-110 transition-transform shadow-xl">
                                <RefreshCw size={20} className={isUploading ? "animate-spin" : ""} />
                                <input type="file" className="hidden" onChange={handleUpload} accept="image/*" disabled={isUploading} />
                            </label>
                            <button 
                                type="button"
                                onClick={() => onChange('')}
                                className="p-3 bg-rose-500 text-white rounded-2xl hover:scale-110 transition-transform shadow-xl"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <label className="flex flex-col items-center justify-center w-full h-48 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl cursor-pointer hover:bg-slate-100 transition-all overflow-hidden relative">
                        {isUploading ? (
                            <div className="w-full px-10 flex flex-col items-center gap-4">
                                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-indigo-600 transition-all duration-300" 
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <span className="text-[10px] font-black text-indigo-600 uppercase animate-pulse">
                                    Uploading {progress}%
                                </span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <div className="p-4 bg-white rounded-2xl shadow-sm mb-2">
                                    <Upload size={24} className="text-slate-400" />
                                </div>
                                <span className="text-[10px] font-black text-slate-500 uppercase">Drop service image here</span>
                            </div>
                        )}
                        <input type="file" className="hidden" onChange={handleUpload} accept="image/*" disabled={isUploading} />
                    </label>
                )}
            </div>
        </div>
    );
};

export default ServiceImageUpload;