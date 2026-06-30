import { motion } from 'framer-motion';
import { MessageSquare, Quote, Star } from 'lucide-react';

const testimonials = [
    {
        name: "Dr. Ir. Hendra, M.T.",
        role: "Head of Informatics Department, ITP",
        quote: "Hafiz has consistently demonstrated an analytical approach to solving complex database and programming problems. His work ethic is outstanding and he ranks among the top of his class.",
        rating: 5
    },
    {
        name: "Rian F., S.Kom",
        role: "Lead Systems Administrator, Diskominfo",
        quote: "During his internship, Hafiz designed and built our internship journal system. He is a self-starter, communicates clearly, and produces clean, production-ready code. He will be a valuable asset to any engineering team.",
        rating: 5
    },
    {
        name: "Sarah Amanda",
        role: "Creative Director, Uspatih Studio",
        quote: "Hafiz delivered high-quality graphic assets and video edits on time. He has a unique eye for visual details and is extremely adaptable to creative briefs.",
        rating: 5
    }
];

export default function Testimonials() {
    return (
        <section id="testimonials" className="py-24 px-6 max-w-6xl mx-auto text-left">
            <motion.div 
                className="sec-header"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <div className="badge-outline mb-4">
                    <MessageSquare size={12} className="text-blue-500" />
                    <span>References</span>
                </div>
                <h2 className="sec-title">Testimonials & Feedback</h2>
                <p className="sec-subtitle">What lecturers, project managers, and creative leads say about my technical contributions and work ethic.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 mt-12">
                {testimonials.map((t, idx) => (
                    <motion.div 
                        key={idx}
                        className="premium-card p-6 flex flex-col justify-between"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                    >
                        <div>
                            {/* Stars rating */}
                            <div className="flex items-center gap-1 mb-4 text-amber-500">
                                {[...Array(t.rating)].map((_, i) => (
                                    <Star key={i} size={13} className="fill-current" />
                                ))}
                            </div>

                            <Quote className="w-8 h-8 text-blue-500/10 mb-2" />
                            
                            <blockquote className="text-xs text-gray-400 leading-relaxed mb-6 italic">
                                "{t.quote}"
                            </blockquote>
                        </div>

                        <div className="border-t border-white/5 pt-4 mt-auto">
                            <h4 className="text-sm font-bold text-white leading-tight">{t.name}</h4>
                            <p className="text-[10px] text-gray-500 font-mono mt-0.5">{t.role}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
