import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, ArrowRight, Sparkles, X, Zap } from 'lucide-react';
import api from '@/api/api';
import { useNavigate } from 'react-router-dom';

interface Service {
    _id?: string;
    name: string;
    category: string;
}

const HeroSearch = () => {
    const [query, setQuery] = useState('');
    const [services, setServices] = useState<Service[]>([]);
    const [filteredResults, setFilteredResults] = useState<Service[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [dropUp, setDropUp] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1); // ✅ keyboard nav index
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await api.get('/services/allService');
                // DEBUG HERE:
                console.log("Type Check:", typeof res.data[0].name);
                console.log("Sample Data:", res.data[0]);

                setServices(res.data);
            } catch (err) {
                console.error("Failed to load services", err);
            }
        };
        fetchServices();
    }, []);

    useEffect(() => {
        if (isOpen && dropdownRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            const dropdownHeight = 320;
            setDropUp(spaceBelow < dropdownHeight && spaceAbove > dropdownHeight);
        }
    }, [isOpen]);

    useEffect(() => {
        if (query.trim().length > 0) {
            const filtered = services.filter(service =>
                service.name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredResults(filtered);
            setIsOpen(true);
            setActiveIndex(-1); // reset on new query
        } else {
            setFilteredResults([]);
            setIsOpen(false);
            setActiveIndex(-1);
        }
    }, [query, services]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setIsFocused(false);
                setActiveIndex(-1);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // ✅ Scroll active item into view
    useEffect(() => {
        if (activeIndex >= 0 && itemRefs.current[activeIndex]) {
            itemRefs.current[activeIndex]?.scrollIntoView({
                block: 'nearest',
                behavior: 'smooth'
            });
        }
    }, [activeIndex]);

    const handleClear = () => {
        setQuery('');
        setIsOpen(false);
        setActiveIndex(-1);
        inputRef.current?.focus();
    };

    const handleNavigate = useCallback((categoryName: string) => {
        if (!categoryName) return;
        const categorySlug = categoryName
            .toLowerCase()
            .trim()
            .replace(/[\s]+/g, '-')
            .replace(/-+/g, '-');
        navigate(`/categories/${categorySlug}`);
        setIsOpen(false);
        setQuery('');
        setActiveIndex(-1);
    }, [navigate]);

    // ✅ Keyboard handler
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen || filteredResults.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActiveIndex(prev =>
                    prev < filteredResults.length - 1 ? prev + 1 : 0
                );
                break;

            case 'ArrowUp':
                e.preventDefault();
                setActiveIndex(prev =>
                    prev > 0 ? prev - 1 : filteredResults.length - 1
                );
                break;

            case 'Enter':
                e.preventDefault();
                if (activeIndex >= 0 && filteredResults[activeIndex]) {
                    handleNavigate(filteredResults[activeIndex].category);
                } else if (filteredResults.length > 0) {
                    // If nothing highlighted, select first result
                    handleNavigate(filteredResults[0].category);
                }
                break;

            case 'Escape':
                e.preventDefault();
                setIsOpen(false);
                setActiveIndex(-1);
                inputRef.current?.blur();
                break;

            case 'Tab':
                setIsOpen(false);
                setActiveIndex(-1);
                break;
        }
    };

    const highlightMatch = (text: string, query: string) => {
        const index = text.toLowerCase().indexOf(query.toLowerCase());
        if (index === -1) return <span>{text}</span>;
        return (
            <>
                <span className="text-gray-700">{text.slice(0, index)}</span>
                <span className="text-blue-600 font-black">{text.slice(index, index + query.length)}</span>
                <span className="text-gray-700">{text.slice(index + query.length)}</span>
            </>
        );
    };

    return (
        <>
            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

                @keyframes dropIn {
                    from { opacity: 0; transform: translateY(-8px) scale(0.98); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes dropUp {
                    from { opacity: 0; transform: translateY(8px) scale(0.98); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-drop-in { animation: dropIn 0.2s cubic-bezier(0.16,1,0.3,1) forwards; }
                .animate-drop-up { animation: dropUp 0.2s cubic-bezier(0.16,1,0.3,1) forwards; }
            `}</style>

            <div className="relative w-full max-w-xl" ref={dropdownRef}>
                <div className={`
                    relative bg-white rounded-2xl transition-all duration-300
                    ${isFocused || isOpen
                        ? 'shadow-[0_8px_40px_rgba(59,130,246,0.18),0_2px_12px_rgba(0,0,0,0.08)] ring-2 ring-blue-500/30'
                        : 'shadow-[0_4px_24px_rgba(0,0,0,0.10)]'
                    }
                `}>

                    {/* Input */}
                    <div className="relative flex items-center">
                        <div className="absolute left-4 pointer-events-none">
                            <Search className={`h-5 w-5 transition-colors duration-200 ${isFocused ? 'text-blue-500' : 'text-gray-400'}`} />
                        </div>

                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onKeyDown={handleKeyDown}  // ✅ keyboard events
                            placeholder="Search for 'Car wash', 'Plumber'..."
                            autoComplete="off"
                            aria-autocomplete="list"
                            aria-expanded={isOpen}
                            role="combobox"
                            className={`
                                w-full pl-12 pr-12 py-4 md:py-5 bg-transparent outline-none
                                text-base md:text-lg font-semibold text-gray-800
                                placeholder:text-gray-400 placeholder:font-normal
                                ${isOpen ? 'rounded-t-2xl' : 'rounded-2xl'}
                                transition-all duration-200
                            `}
                        />

                        {query && (
                            <button
                                onClick={handleClear}
                                className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {isOpen && (
                        <div className="h-px bg-gradient-to-r from-transparent via-blue-100 to-transparent mx-4" />
                    )}

                    {/* Dropdown */}
                    {isOpen && (
                        <div className={`
                            ${dropUp
                                ? 'absolute bottom-full left-0 w-full mb-2 rounded-2xl border border-gray-100 bg-white animate-drop-up'
                                : 'rounded-b-2xl animate-drop-in'
                            }
                            overflow-hidden
                        `}
                            style={dropUp ? { boxShadow: '0 -12px 40px rgba(0,0,0,0.12)' } : {}}
                        >
                            {/* Header */}
                            <div className="px-4 pt-3 pb-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Sparkles size={13} className="text-blue-400" />
                                    <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                                        {filteredResults.length} Result{filteredResults.length !== 1 ? 's' : ''}
                                    </span>
                                </div>
                                {filteredResults.length > 0 && (
                                    <div className="flex items-center gap-1 text-[10px] text-blue-400 font-bold">
                                        <Zap size={10} />
                                        Quick Results
                                    </div>
                                )}
                            </div>

                            {/* Results list */}
                            <div ref={listRef} className="hide-scrollbar overflow-y-auto max-h-64 pb-2" role="listbox">
                                {filteredResults.length > 0 ? (
                                    filteredResults.map((service, index) => (
                                        <button
                                            key={service._id || index}
                                            ref={el => { itemRefs.current[index] = el; }}
                                            onClick={() => handleNavigate(service.category)}
                                            onMouseEnter={() => setActiveIndex(index)}
                                            onMouseLeave={() => setActiveIndex(-1)}
                                            role="option"
                                            aria-selected={activeIndex === index}
                                            className={`
                                                w-full px-4 py-3 flex items-center justify-between
                                                transition-all duration-100 group/item
                                                ${activeIndex === index
                                                    ? 'bg-blue-50'  // ✅ highlighted via keyboard or hover
                                                    : 'hover:bg-blue-50/60'
                                                }
                                            `}
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className={`
                                                    shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-colors duration-150
                                                    ${activeIndex === index ? 'bg-blue-100' : 'bg-gray-100'}
                                                `}>
                                                    <Search size={13} className={`transition-colors ${activeIndex === index ? 'text-blue-600' : 'text-gray-500'}`} />
                                                </div>
                                                <div className="flex flex-col text-left min-w-0">
                                                    <span className="font-semibold text-sm md:text-base leading-tight truncate">
                                                        {highlightMatch(service.name, query)}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mt-0.5 truncate">
                                                        in {service.category}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className={`
                                                shrink-0 ml-3 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200
                                                ${activeIndex === index ? 'bg-blue-500' : 'bg-gray-100'}
                                            `}>
                                                <ArrowRight size={13} className={`transition-all duration-200 ${activeIndex === index ? 'text-white translate-x-0.5' : 'text-gray-400'}`} />
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-4 py-8 text-center">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Search size={18} className="text-gray-400" />
                                        </div>
                                        <p className="text-gray-500 font-semibold text-sm">
                                            No results for <span className="text-gray-800">"{query}"</span>
                                        </p>
                                        <p className="text-gray-400 text-xs mt-1">Try a different keyword</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer with working key hints */}
                            {filteredResults.length > 0 && (
                                <div className="px-4 py-2.5 border-t border-gray-50 bg-gray-50/50 flex items-center gap-1.5 flex-wrap">
                                    <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono shadow-sm text-gray-500">↑</kbd>
                                    <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono shadow-sm text-gray-500">↓</kbd>
                                    <span className="text-[10px] text-gray-400 font-medium">navigate</span>
                                    <span className="text-gray-200 mx-1">|</span>
                                    <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono shadow-sm text-gray-500">↵</kbd>
                                    <span className="text-[10px] text-gray-400 font-medium">select</span>
                                    <span className="text-gray-200 mx-1">|</span>
                                    <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono shadow-sm text-gray-500">Esc</kbd>
                                    <span className="text-[10px] text-gray-400 font-medium">close</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default HeroSearch;