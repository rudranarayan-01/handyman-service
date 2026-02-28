import React, { useState } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';
import { Button } from '../ui/button';

// --- TYPES ---
interface PartnerFormData {
    name: string;
    email: string;
    phone: string;
    serviceAreas: string[];
    specializations: string[];
}

interface PartnerFormProps {
    initialData?: any;
    availableServices: any[];
    onSubmit: (data: PartnerFormData) => void;
    onCancel: () => void;
    isEditing: boolean;
    isLoadingServices?: boolean; // New prop to trigger skeleton
}

// --- SKELETON COMPONENT ---
const FormSkeleton = () => (
    <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-xl mb-10 animate-pulse">
        <div className="h-6 w-48 bg-slate-200 rounded mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                    <div className="h-3 w-20 bg-slate-100 rounded" />
                    <div className="h-12 bg-slate-50 rounded-xl border border-slate-100" />
                </div>
            ))}
        </div>
        <div className="h-20 bg-slate-50 rounded-xl mb-6" />
        <div className="flex gap-3">
            <div className="h-14 flex-1 bg-slate-200 rounded-2xl" />
            <div className="h-14 w-32 bg-slate-100 rounded-2xl" />
        </div>
    </div>
);

const PartnerForm = ({ 
    initialData, 
    availableServices, 
    onSubmit, 
    onCancel, 
    isEditing,
    isLoadingServices = false 
}: PartnerFormProps) => {
    const [formData, setFormData] = useState<PartnerFormData>({
        name: initialData?.name || '',
        email: initialData?.email || '',
        phone: initialData?.phone || '',
        serviceAreas: initialData?.serviceAreas || [],
        specializations: initialData?.specializations || []
    });

    const [areaInput, setAreaInput] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    if (isLoadingServices) return <FormSkeleton />;

    const handleAddArea = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && areaInput.trim()) {
            e.preventDefault();
            if (!formData.serviceAreas.includes(areaInput.trim())) {
                setFormData({ ...formData, serviceAreas: [...formData.serviceAreas, areaInput.trim()] });
            }
            setAreaInput("");
        }
    };

    const removeArea = (index: number) => {
        setFormData({ 
            ...formData, 
            serviceAreas: formData.serviceAreas.filter((_, i) => i !== index) 
        });
    };

    const toggleService = (serviceName: string) => {
        const current = formData.specializations;
        const next = current.includes(serviceName)
            ? current.filter((s) => s !== serviceName)
            : [...current, serviceName];
        setFormData({ ...formData, specializations: next });
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-xl mb-10 animate-in fade-in zoom-in-95 duration-300">
            <h2 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tight">
                {isEditing ? 'Update Partner Details' : 'Onboard New Partner'}
            </h2>

            <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-6">
                {/* Responsive Grid: 1 col on mobile, 3 on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormInputField label="Full Name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} placeholder="e.g. Arjan Singh" />
                    <FormInputField label="Email Address" type="email" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} placeholder="partner@company.com" />
                    <FormInputField label="Phone Number" value={formData.phone} onChange={(v) => setFormData({ ...formData, phone: v })} placeholder="+91..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Service Areas */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Service Areas (Press Enter)</label>
                        <div className="min-h-[52px] p-2 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap gap-2 focus-within:bg-white focus-within:border-indigo-500 transition-all">
                            {formData.serviceAreas.map((area, i) => (
                                <span key={`area-${i}`} className="bg-slate-900 text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 uppercase transition-all hover:bg-slate-800">
                                    {area} 
                                    <X size={12} className="cursor-pointer hover:text-rose-400" onClick={() => removeArea(i)} />
                                </span>
                            ))}
                            <input
                                className="bg-transparent outline-none text-sm font-bold flex-1 min-w-[120px] px-2 py-1"
                                value={areaInput}
                                onChange={(e) => setAreaInput(e.target.value)}
                                onKeyDown={handleAddArea}
                                placeholder="Add city..."
                            />
                        </div>
                    </div>

                    {/* Service Types Dropdown */}
                    <div className="space-y-1.5 relative">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Service Types</label>
                        <div
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="min-h-[52px] p-2 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap gap-2 cursor-pointer hover:bg-white transition-all pr-10"
                        >
                            {formData.specializations.length === 0 && <span className="text-slate-400 text-sm font-medium p-1">Select services...</span>}
                            {formData.specializations.map((spec, i) => (
                                <span key={`spec-${i}`} className="bg-indigo-600 text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 uppercase">
                                    {spec} 
                                    <X size={12} onClick={(e) => { e.stopPropagation(); toggleService(spec); }} className="hover:text-indigo-200" />
                                </span>
                            ))}
                            <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} size={18} />
                        </div>

                        {isDropdownOpen && (
                            <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-60 overflow-y-auto p-2 animate-in slide-in-from-top-2 duration-200">
                                {availableServices.length > 0 ? (
                                    availableServices.map((service) => (
                                        <div
                                            key={service._id}
                                            onClick={() => toggleService(service.name)}
                                            className={`p-3 rounded-xl text-xs font-bold uppercase cursor-pointer flex justify-between items-center mb-1 transition-colors ${formData.specializations.includes(service.name) ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-600'}`}
                                        >
                                            {service.name}
                                            {formData.specializations.includes(service.name) && <Check size={14} />}
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-slate-400 text-xs font-bold">No services available</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button type="submit" className="flex-1 py-6 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]">
                        {isEditing ? "Save Changes" : "Confirm Onboarding"}
                    </Button>
                    <Button type="button" onClick={onCancel} className="px-8 py-6 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

// --- SUB-COMPONENT ---
interface InputProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    type?: string;
    placeholder: string;
}

const FormInputField = ({ label, value, onChange, type = "text", placeholder }: InputProps) => (
    <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">{label}</label>
        <input
            type={type}
            className="w-full p-3.5 bg-slate-50 rounded-xl border border-slate-200 font-bold text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-slate-300"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required
        />
    </div>
);

export default PartnerForm;