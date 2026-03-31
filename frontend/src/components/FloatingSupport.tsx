import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom'; 
import { X, MessageSquare, Send, Sparkles } from 'lucide-react';
import api from '@/api/api';

const FloatingSupport = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', text: "Hi! I'm your HouseXpertz assistant. How can I help you today?" }
    ]);

    const chatRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // const quickActions = ["Price Estimate", "Booking Status", "Emergency"];
    const whatsappUrl = `https://wa.me/919811797407?text=${encodeURIComponent("Hello HouseXpertz! I need help.")}`;

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, isTyping]);

    const handleSendMessage = async (text: string = input) => {
        const msg = text.trim();
        if (!msg) return;
        setMessages(prev => [...prev, { role: 'user', text: msg }]);
        setInput("");
        setIsTyping(true);
        try {
            const { data } = await api.post('/ai/chat', { message: msg });
            setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'ai', text: "Service temporarily offline. Try WhatsApp!" }]);
        } finally {
            setIsTyping(false);
        }
    };

    return createPortal(
        /* FIX: We removed 'flex', 'inset-0', 'items-end', and 'p-4'.
           This container now has 0px height. It starts and ends at the bottom-right.
        */
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-9999">
            
            {/* The relative wrapper ensures children (the chat window) grow UPWARDS */}
            <div className="relative flex flex-col items-end" ref={chatRef}>

                {/* --- CHAT WINDOW --- */}
                <div className={`absolute bottom-20 right-0 mb-2 w-[calc(100vw-32px)] sm:w-[380px] h-[500px] max-h-[70vh] bg-white rounded-[2rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] origin-bottom-right ${
                    showChat ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-10 pointer-events-none'
                }`}>
                    <div className="bg-slate-900 p-5 text-white flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/30">
                                <Sparkles size={20} className="text-white fill-white/20" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">HouseXpertz AI</h3>
                                <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest">Active</p>
                            </div>
                        </div>
                        <button onClick={() => setShowChat(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
                    </div>

                    <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${m.role === 'ai' ? 'bg-white border border-slate-100 shadow-sm rounded-bl-none' : 'bg-blue-600 text-white rounded-br-none'}`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Type message..."
                            className="flex-1 bg-slate-100 text-sm rounded-full px-4 py-2.5 outline-none font-medium"
                        />
                        <button onClick={() => handleSendMessage()} className="p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all active:scale-90">
                            <Send size={18} />
                        </button>
                    </div>
                </div>

                {/* --- MENU ITEMS --- */}
                <div className={`absolute bottom-20 right-0 flex flex-col gap-3 mb-2 transition-all duration-300 ${
                    isOpen && !showChat ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
                }`}>
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                        <span className="bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg uppercase">WhatsApp</span>
                        <div className="w-12 h-12 bg-[#25D366] rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform">
                            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                        </div>
                    </a>

                    <button onClick={() => { setShowChat(true); setIsOpen(false); }} className="flex items-center gap-3">
                        <span className="bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg uppercase">AI Chat</span>
                        <div className="w-12 h-12 bg-blue-600 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform">
                            <Sparkles size={22} className="text-white" />
                        </div>
                    </button>
                </div>

                {/* --- MASTER BUTTON --- */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 relative ${
                        isOpen ? 'bg-slate-900 rotate-90' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    <div className="relative z-10">
                        {isOpen ? <X size={28} className="text-white" /> : <MessageSquare size={28} className="text-white fill-white/10" />}
                    </div>
                </button>
            </div>
        </div>,
        document.body
    );
};

export default FloatingSupport;