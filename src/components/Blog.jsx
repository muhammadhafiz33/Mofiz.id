import { motion } from 'framer-motion';
import { BookOpen, Calendar, Clock, ArrowUpRight } from 'lucide-react';

const articles = [
    {
        title: "Mastering React 19: Action Hooks & Transitions",
        category: "Frontend",
        readTime: "6 min read",
        date: "Jun 15, 2026",
        desc: "A comprehensive look at the new Action hooks, form statuses, and automatic pending indicator states introduced in React 19.",
        gradientClass: "from-blue-600/10 to-cyan-500/10"
    },
    {
        title: "Scaling REST APIs with Laravel 11 Cache Layers",
        category: "Backend",
        readTime: "8 min read",
        date: "May 28, 2026",
        desc: "Learn to utilize Redis and Laravel's caching facade to drastically minimize SQL query loads in high-traffic endpoints.",
        gradientClass: "from-blue-800/10 to-indigo-600/10"
    },
    {
        title: "Database Indexing Strategies for Informatics Students",
        category: "Databases",
        readTime: "5 min read",
        date: "Apr 10, 2026",
        desc: "A student-focused guide explaining B-Trees, composite indexes, query plans, and when to avoid over-indexing schemas.",
        gradientClass: "from-cyan-600/10 to-blue-900/10"
    }
];

export default function Blog() {
    return (
        <section id="blog" className="py-24 px-6 max-w-6xl mx-auto text-left">
            <motion.div 
                className="sec-header"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <div className="badge-outline mb-4">
                    <BookOpen size={12} className="text-blue-500" />
                    <span>My Blog</span>
                </div>
                <h2 className="sec-title">Latest Technical Insights</h2>
                <p className="sec-subtitle">Articles detailing programming techniques, web framework discoveries, and database optimization tips.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 mt-12">
                {articles.map((art, idx) => (
                    <motion.div 
                        key={idx}
                        className="premium-card flex flex-col h-full justify-between"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.05 }}
                    >
                        {/* Cover Image Placeholder with CSS Pattern */}
                        <div className={`h-40 w-full bg-gradient-to-br ${art.gradientClass} relative overflow-hidden flex items-center justify-center border-b`} style={{ borderColor: 'var(--border-color)' }}>
                            <div className="absolute inset-0 bg-grid-overlay opacity-20" />
                            <BookOpen className="w-8 h-8 text-blue-500/20" />
                            <span className="absolute top-3 left-4 px-2 py-0.5 rounded text-[9px] font-semibold font-mono bg-blue-500/10 border border-blue-500/20 text-blue-500 uppercase">{art.category}</span>
                        </div>

                        {/* Details */}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-white mb-2 hover:text-blue-500 transition-colors cursor-pointer line-clamp-2 leading-snug">{art.title}</h3>
                                <p className="text-[11px] text-gray-400 leading-relaxed mb-6 line-clamp-3">{art.desc}</p>
                            </div>

                            <div className="border-t border-white/5 pt-4 flex items-center justify-between text-[10px] font-mono text-gray-500">
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1"><Calendar size={11} /> {art.date}</span>
                                    <span className="flex items-center gap-1"><Clock size={11} /> {art.readTime}</span>
                                </div>
                                <a href="#" className="text-blue-500 hover:text-blue-400 flex items-center gap-0.5 transition-colors font-semibold">
                                    <span>Read</span>
                                    <ArrowUpRight size={10} />
                                </a>
                            </div>
                        </div>

                    </motion.div>
                ))}
            </div>
        </section>
    );
}
