import { motion } from 'framer-motion';
import { Briefcase, Calendar, CheckCircle2 } from 'lucide-react';

const workExperiences = [
    {
        position: "Fullstack Web Developer (Intern)",
        company: "Diskominfo Kota Bukittinggi",
        duration: "Feb 2025 — Apr 2025",
        responsibilities: [
            "Architected and deployed a web-based Internship Journal tracking platform to streamline student reporting tasks.",
            "Integrated Laravel API endpoints with a React.js client wrapper for smooth real-time data flows.",
            "Optimized database performance by designing indexed schemas, resolving slow queries, and applying input sanitizations.",
            "Coordinated with government IT administrators to deploy, test, and host the platform on secure server nodes."
        ],
        technologies: ["React.js", "Vite", "Laravel", "MySQL", "Tailwind CSS", "REST APIs"]
    },
    {
        position: "Freelance Graphic Designer & Multimedia Creator",
        company: "Uspatih Studio / Freelance",
        duration: "Oct 2020 — Jan 2024",
        responsibilities: [
            "Designed digital and print media assets representing local products, businesses, and event milestones.",
            "Created customized branding packages, logos, templates, and high-fidelity layouts in vector structures.",
            "Edited commercial promotional videos, combining sound, visuals, and textual layers into engaging deliverables.",
            "Managed client relationships, requirements gathering, drafting design feedback, and handling multiple projects."
        ],
        technologies: ["CorelDRAW", "Adobe Photoshop", "Adobe Premiere Pro", "Vector Illustration"]
    }
];

export default function Experience() {
    return (
        <section id="experience" className="py-24 px-6 max-w-6xl mx-auto text-left">
            <motion.div 
                className="sec-header"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <div className="badge-outline mb-4">
                    <Briefcase size={12} className="text-blue-500" />
                    <span>Work History</span>
                </div>
                <h2 className="sec-title">Professional Experience</h2>
                <p className="sec-subtitle">A record of my professional industry experience, engineering internships, and freelancing accomplishments.</p>
            </motion.div>

            <div className="space-y-8 mt-12">
                {workExperiences.map((job, idx) => (
                    <motion.div 
                        key={idx}
                        className="premium-card p-6 md:p-8"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/5">
                            <div>
                                <h3 className="text-lg font-bold text-white leading-tight">{job.position}</h3>
                                <h4 className="text-sm font-semibold text-blue-500 font-mono mt-1">{job.company}</h4>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono">
                                <Calendar size={13} />
                                <span>{job.duration}</span>
                            </div>
                        </div>

                        {/* Responsibilities list */}
                        <div className="space-y-3 mb-6">
                            <h5 className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">RESPONSIBILITIES & CONTRIBUTIONS</h5>
                            <ul className="space-y-2.5">
                                {job.responsibilities.map((resp, respIdx) => (
                                    <li key={respIdx} className="flex items-start gap-2.5 text-xs text-gray-400 leading-relaxed">
                                        <CheckCircle2 size={13} className="text-blue-500 flex-shrink-0 mt-0.5" />
                                        <span>{resp}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Tech Used Tags */}
                        <div className="space-y-2 pt-2">
                            <h5 className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">TECHNOLOGIES UTILIZED</h5>
                            <div className="flex flex-wrap gap-1.5">
                                {job.technologies.map(tech => (
                                    <span 
                                        key={tech} 
                                        className="px-2 py-0.5 rounded text-[10px] font-mono font-medium border bg-white/[0.01]"
                                        style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                    </motion.div>
                ))}
            </div>
        </section>
    );
}
