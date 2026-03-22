import { MessageSquare } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"

const ServiceFAQ = () => {
    return (

        <div className="flex flex-col gap-5">
            <section className="bg-slate-900 rounded-[2.5rem] p-8 md:p-14 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-10 opacity-10">
                    <MessageSquare size={200} />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="h-px w-12 bg-blue-500" />
                        <span className="text-blue-400 font-black uppercase tracking-[0.3em] text-[10px]">Client Feedback</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black mb-12 leading-tight">Trusted by over <span className="text-blue-500">50,000+</span> households.</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4 italic text-slate-300 border-l-2 border-blue-600 pl-6">
                            <p className="text-lg">"The professionalism was unexpected. From the uniform to the high-end tools, HouseXpertz is the gold standard."</p>
                            <p className="text-white font-bold text-sm not-italic">Ananya Rao • Mumbai</p>
                        </div>
                        <div className="hidden md:block space-y-4 italic text-slate-300 border-l-2 border-slate-700 pl-6">
                            <p className="text-lg">"Fast, reliable, and worth the price. The 30-day warranty gives me total peace of mind."</p>
                            <p className="text-white font-bold text-sm not-italic">Karan Malhotra • Delhi</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="px-2">
                <h3 className="text-2xl font-black mb-6 text-slate-900">Expert Guidance (FAQ)</h3>
                <Accordion type="single" collapsible className="space-y-3">
                    {[
                        { q: "How do I cancel or reschedule?", a: "Cancel or reschedule up to 3 hours before the slot via dashboard with no penalty." },
                        { q: "Are spare parts included?", a: "Price covers labor. Specialized parts are sourced at MRP with transparent billing." },
                        { q: "What does the 30-day warranty cover?", a: "If the issue recurs within 30 days, we fix it entirely free of charge." }
                    ].map((item, i) => (
                        <AccordionItem key={i} value={`faq-${i}`} className="border rounded-2xl px-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                            <AccordionTrigger className="font-bold text-slate-800 py-6 hover:no-underline">{item.q}</AccordionTrigger>
                            <AccordionContent className="text-slate-500 pb-6">{item.a}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </section>
        </div>
    )
}

export default ServiceFAQ