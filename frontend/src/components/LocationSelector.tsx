import { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, ChevronDown, Search, Loader2 } from 'lucide-react';

declare global {
    interface Window {
        google: any;
    }
}

const LocationSelector = () => {
    const [input, setInput] = useState("");
    const [predictions, setPredictions] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Loading state add ki
    const [selectedArea, setSelectedArea] = useState("Bengaluru Palace, KA");

    const dropdownRef = useRef<HTMLDivElement>(null);
    // VITE use kar rahe ho toh ensure karo variable VITE_ se start ho
    const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAP_API_KEY;

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (input.length > 2 && window.google?.maps?.places) {
            const service = new window.google.maps.places.AutocompleteService();
            service.getPlacePredictions({
                input,
                componentRestrictions: { country: 'in' },
                types: ['(regions)']
            }, (results: any) => {
                setPredictions(results || []);
            });
        } else {
            setPredictions([]);
        }
    }, [input]);

    const handleCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setIsLoading(true);

        navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude, longitude } = pos.coords;
            try {
                // Proxy ya direct fetch handle karne ke liye
                const response = await fetch(
                    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
                );
                const data = await response.json();

                if (data.status === "OK") {
                    // Sabse accurate area nikalne ke liye logic fix kiya
                    const results = data.results[0];
                    const addressComponents = results.address_components;

                    const area = addressComponents.find((c: any) =>
                        c.types.includes("sublocality_level_1") ||
                        c.types.includes("sublocality") ||
                        c.types.includes("locality")
                    )?.long_name;

                    if (area) {
                        setSelectedArea(area);
                    } else {
                        setSelectedArea(results.formatted_address.split(',')[0]);
                    }
                    setIsOpen(false);
                } else {
                    console.error("Google Geocode Error:", data.error_message || data.status);
                    alert("Could not fetch location. Check if Geocoding API is enabled in Google Console.");
                }
            } catch (err) {
                console.error("Network error while fetching location:", err);
            } finally {
                setIsLoading(false);
            }
        }, (error) => {
            setIsLoading(false);
            console.error("Geolocation error:", error);
            alert("Please enable location permissions in your browser.");
        });
    };

    return (
        <div className="relative" ref={dropdownRef}>
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


            {isOpen && (
                <div className="absolute top-[110%] left-0 w-full bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 animate-in fade-in zoom-in duration-150 flex flex-col overflow-hidden">

                    {/* Search Input Area */}
                    <div className="p-2 border-b border-gray-50 flex items-center gap-3">
                        <Search className="w-4 h-4 text-gray-400 ml-2" />
                        <input
                            autoFocus
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Search for area..."
                            className="flex-1 outline-none py-2 text-sm font-medium placeholder:text-gray-400"
                        />
                    </div>

                    {/* Current Location Button */}
                    <div
                        onClick={handleCurrentLocation}
                        className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 cursor-pointer transition-colors group border-b border-gray-100"
                    >
                        <div className="w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center group-hover:bg-violet-100 transition-colors shrink-0">
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 text-violet-600 animate-spin" />
                            ) : (
                                <Navigation className="w-4 h-4 text-violet-600 fill-violet-600" />
                            )}
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-[14px] font-bold text-violet-600">
                                {isLoading ? "Detecting..." : "Use current location"}
                            </span>
                            <span className="text-[11px] text-gray-400 font-medium tracking-tight">Using GPS</span>
                        </div>
                    </div>

                    {/* Predictions List - Scrollbar Fixed */}
                    <div className="max-h-80 overflow-y-auto scrollbar-none" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                        <style>{`
                .scrollbar-none::-webkit-scrollbar {
                    display: none;
                }
            `}</style>

                        {predictions.map((p) => (
                            <div
                                key={p.place_id}
                                onClick={() => {
                                    setSelectedArea(p.structured_formatting.main_text);
                                    setIsOpen(false);
                                    setInput("");
                                }}
                                className="flex items-start gap-3 px-4 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                <MapPin className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-[14px] text-gray-900 font-bold leading-tight truncate">
                                        {p.structured_formatting.main_text}
                                    </span>
                                    <span className="text-[12px] text-gray-500 mt-0.5 truncate pr-2">
                                        {p.structured_formatting.secondary_text}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {input.length > 2 && predictions.length === 0 && (
                            <div className="p-8 text-center text-sm text-gray-400 font-medium">
                                No area found...
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationSelector;