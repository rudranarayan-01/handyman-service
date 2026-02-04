import { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, ChevronDown, Search} from 'lucide-react';

// Step 1: Tell TypeScript that window.google exists
declare global {
  interface Window {
    google: any;
  }
}

const LocationSelector = () => {
    const [input, setInput] = useState("");
    // Step 2: Define type as 'any[]' instead of 'never[]'
    const [predictions, setPredictions] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedArea, setSelectedArea] = useState("Bengaluru Palace, KA");
    
    // Step 3: Define ref as HTMLDivElement to fix 'contains' error
    const dropdownRef = useRef<HTMLDivElement>(null);
    const GOOGLE_API_KEY = import.meta.env.GOOGLE_MAP_API_KEY;

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            // Using type casting to ensure 'contains' works
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (input.length > 2) {
            if (window.google?.maps?.places) {
                const service = new window.google.maps.places.AutocompleteService();
                service.getPlacePredictions({
                    input,
                    componentRestrictions: { country: 'in' },
                    types: ['(regions)']
                }, (results: any) => {
                    setPredictions(results || []);
                });
            }
        } else {
            setPredictions([]);
        }
    }, [input]);

    const handleCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (pos) => {
                const { latitude, longitude } = pos.coords;
                try {
                    const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`);
                    const data = await res.json();
                    const area = data.results[0]?.address_components?.find((c: any) => 
                        c.types.includes("sublocality") || c.types.includes("locality")
                    )?.long_name;
                    setSelectedArea(area || "Detected Location");
                    setIsOpen(false);
                } catch (err) {
                    console.error("Geocode error", err);
                }
            });
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Main Trigger */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-4 py-2.5 border border-gray-200 rounded-lg cursor-pointer bg-white hover:border-gray-400 transition-all min-w-60"
            >
                <MapPin className="w-5 h-5 text-gray-500 shrink-0" />
                <span className="text-[15px] font-semibold text-gray-800 truncate flex-1">
                    {selectedArea}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute top-[110%] left-0  bg-white border border-gray-100 rounded-xl shadow-2xl z-99999 animate-in fade-in zoom-in duration-150 flex flex-col">
                    <div className="p-2 border-b border-gray-50 flex items-center gap-3">
                        <Search className="w-5 h-5 text-gray-400" />
                        <input
                            autoFocus
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Search for area..."
                            className="flex-1 outline-none font-medium placeholder:text-gray-400"
                        />
                    </div>

                    <div
                        onClick={handleCurrentLocation}
                        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors group border-b border-gray-100"
                    >
                        <div className="w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center group-hover:bg-violet-100 transition-colors shrink-0">
                            <Navigation className="w-4 h-4 text-violet-600 fill-violet-600" />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-[14px] font-medium text-violet-600">Use current location</span>
                            <span className="text-[11px] text-gray-400">Using GPS</span>
                        </div>
                    </div>

                    <div className="max-h-87.5 overflow-y-auto custom-scrollbar">
                        {predictions.map((p) => (
                            <div
                                key={p.place_id}
                                onClick={() => {
                                    setSelectedArea(p.structured_formatting.main_text);
                                    setIsOpen(false);
                                    setInput("");
                                }}
                                className="flex items-start gap-3 px-4 py-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                                <div className="flex flex-col">
                                    <span className="text-[14px] text-gray-900 font-bold leading-tight">
                                        {p.structured_formatting.main_text}
                                    </span>
                                    <span className="text-[12px] text-gray-500 mt-0.5">
                                        {p.structured_formatting.secondary_text}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationSelector;