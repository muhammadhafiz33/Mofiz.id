import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Briefcase, Activity } from 'lucide-react';

const projects = [
    {
        id: 1,
        title: "Internship Journal System",
        category: "fullstack",
        categoryLabel: "Full-Stack",
        desc: "A web-based system for interns at Diskominfo Bukittinggi to submit daily morning attendance and create progress reports, monitored directly by mentors.",
        tags: ["React", "Laravel", "MySQL", "Tailwind CSS"],
        demo: "#",
        status: "Completed",
        year: "2025",
        graphicClass: "from-blue-600/20 to-cyan-500/20"
    },
    {
        id: 2,
        title: "UD KNS Inventory Management",
        category: "fullstack",
        categoryLabel: "Full-Stack",
        desc: "An Information System for a vegetable warehouse utilizing the ABC Analysis method to support inventory prioritization and improve stock management efficiency.",
        tags: ["React", "Node.js", "MySQL", "Tailwind CSS"],
        demo: "#",
        status: "In Progress",
        year: "2026",
        graphicClass: "from-blue-600/20 to-indigo-500/20"
    },
    {
        id: 3,
        title: "Various Academic Projects",
        category: "academic",
        categoryLabel: "Academic",
        desc: "Several mini-projects and assignments completed during my undergraduate studies, focusing on algorithms, data structures, and basic web development.",
        tags: ["C++", "HTML/CSS", "JavaScript", "Java"],
        demo: "#",
        status: "Completed",
        year: "2022-2024",
        graphicClass: "from-slate-700/20 to-blue-900/20"
    }
];

const filters = [
    { id: 'all', label: 'All Works' },
    { id: 'fullstack', label: 'Full-Stack' },
    { id: 'academic', label: 'Academic' }
];

export default function Projects() {
    const [activeFilter, setActiveFilter] = useState('all');
    const filteredProjects = projects.filter(p => activeFilter === 'all' || p.category === activeFilter);

    return (
        <section id="projects" className="py-24 px-6 max-w-6xl mx-auto">
            <motion.div 
                className="sec-header"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <div className="badge-outline mb-4">
                    <Briefcase size={12} className="text-blue-500" />
                    <span>Featured Projects</span>
                </div>
                <h2 className="sec-title">Selected Engineering Works</h2>
                <p className="sec-subtitle">A collection of full-stack products, backend services, and intelligence modules I have architected and deployed.</p>
            </motion.div>

            {/* Category Filters */}
            <motion.div 
                className="flex flex-wrap gap-2 mb-12"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
            >
                {filters.map(f => (
                    <button 
                        key={f.id}
                        className={`px-4 py-2 text-xs font-medium rounded-full border transition-all duration-300 ${activeFilter === f.id ? 'bg-blue-500/10 border-blue-500/50 text-blue-500 font-semibold' : 'border-white/5 bg-white/[0.01] text-gray-400 hover:text-white hover:border-white/10'}`}
                        onClick={() => setActiveFilter(f.id)}
                    >
                        {f.label}
                    </button>
                ))}
            </motion.div>

            {/* Grid of Projects */}
            <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="wait">
                    {filteredProjects.map((project) => (
                        <motion.div 
                            key={project.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4 }}
                            className="premium-card flex flex-col h-full text-left"
                            whileHover={{ y: -6 }}
                        >
                            {/* Decorative Minimalist CSS Thumbnail */}
                            <div className={`h-28 w-full bg-gradient-to-br ${project.graphicClass} relative overflow-hidden flex items-center justify-center border-b`} style={{ borderColor: 'var(--border-color)' }}>
                                <motion.div 
                                    className="absolute inset-0 bg-grid-overlay opacity-30"
                                    animate={{ backgroundPosition: ["0px 0px", "40px 40px"] }}
                                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                />
                                <div className="z-10 flex flex-col items-center gap-2">
                                    <motion.div 
                                        animate={{ y: [0, -4, 0] }}
                                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                        className="w-8 h-8 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg"
                                    >
                                        <Activity size={14} className="text-blue-500" />
                                    </motion.div>
                                    <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">{project.categoryLabel}</span>
                                </div>
                                <div className="absolute bottom-3 left-4 flex gap-1.5">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${project.status === 'Completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                                        {project.status}
                                    </span>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/5 text-gray-400">
                                        {project.year}
                                    </span>
                                </div>
                            </div>

                            {/* Card Details */}
                            <div className="p-5 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-2 hover:text-blue-500 transition-colors cursor-pointer">{project.title}</h3>
                                    <p className="text-[11px] text-gray-400 leading-relaxed mb-4">{project.desc}</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex flex-wrap gap-1.5">
                                        {project.tags.map(tag => (
                                            <span 
                                                key={tag} 
                                                className="px-2 py-1 rounded text-[10px] font-mono font-semibold"
                                                style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        {project.demo !== "#" ? (
                                            <a 
                                                href={project.demo} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="inline-flex items-center gap-1 text-xs font-semibold text-white hover:text-blue-500 transition-colors"
                                            >
                                                <span>Live Demo</span>
                                                <ExternalLink size={12} />
                                            </a>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500">
                                                <span>Internal / Not Deployed</span>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </section>
    );
}
