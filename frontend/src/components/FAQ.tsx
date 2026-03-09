import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

// 1. Define Types for Production
interface FAQItemProps {
    question: string;
    answer: string;
    isOpen: boolean;
    onClick: () => void;
}

const faqs = [
    {
        question: "How do I book a service with Housexpertz?",
        answer: "Booking is simple! Select your required service from our categories, choose a convenient time slot, and confirm your details. Our expert will be assigned instantly."
    },
    {
        question: "Are your professionals background verified?",
        answer: "Yes, 100%. Every professional on Housexpertz undergoes a rigorous multi-level background check and skill assessment before joining our fleet."
    },
    {
        question: "What if I am not satisfied with the service?",
        answer: "We offer a 60-day service guarantee. If you aren't happy with the work, we will send a senior expert to fix the issue at no extra cost to you."
    },
    {
        question: "How can I pay for the services?",
        answer: "We accept all major credit/debit cards, UPI (Google Pay, PhonePe), and net banking. Payment is secured via our encrypted gateway."
    }
];

// 2. Apply Types to the Item Component
const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onClick }) => {
    return (
        <motion.div
            variants={{
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 }
            }}
            className="border-b border-gray-200"
        >
            <button
                onClick={onClick}
                type="button"
                className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
            >
                <span className={`text-lg font-semibold transition-colors duration-300 ${isOpen ? 'text-blue-600' : 'text-gray-900 group-hover:text-blue-600'}`}>
                    {question}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-400"
                >
                    <ChevronDown size={24} />
                </motion.div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-gray-600 leading-relaxed max-w-3xl">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const FAQSection: React.FC = () => {
    // Use number | null for state type
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <motion.div
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    variants={{
                        initial: { opacity: 0, y: -20 },
                        animate: { opacity: 1, y: 0 }
                    }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-4 uppercase tracking-wider">
                        <HelpCircle size={16} /> FAQ
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                        Common Questions
                    </h2>
                    <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full mb-4"></div>
                </motion.div>

                <motion.div
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                        animate: { transition: { staggerChildren: 0.1 } }
                    }}
                    className="max-w-3xl mx-auto"
                >
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={openIndex === index}
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default FAQSection;