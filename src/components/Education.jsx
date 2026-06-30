import { motion } from 'framer-motion';
import { GraduationCap, Calendar, Star, Award } from 'lucide-react';

export default function Education() {
    const coursework = [
        "Operating Systems",
        "Web Programming",
        "Mobile Programming",
        "Data Structures",
        "Algorithms",
        "Software Engineering"
    ];

    const academicStats = [
        { label: "Expected Graduation", value: "May 2027" },
        { label: "Academic Term", value: "2022 — Present" }
    ];

    return (
        <section id="education" className="py-24 px-6 max-w-6xl mx-auto">
            <motion.div 
                className="sec-header"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <div className="badge-outline mb-4">
                    <GraduationCap size={12} className="text-blue-500" />
                    <span>Education</span>
                </div>
                <h2 className="sec-title">Academic Background</h2>
                <p className="sec-subtitle">My academic foundation in Computer Engineering and core computational science subjects.</p>
            </motion.div>

            <motion.div 
                className="premium-card p-8 md:p-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <div className="grid md:grid-cols-12 gap-8 items-start">
                    
                    {/* Degree & University Details */}
                    <div className="md:col-span-7 space-y-6">
                        <div>
                            <div className="flex items-center gap-2 text-xs font-mono text-blue-500 mb-2">
                                <Star size={12} className="fill-current" />
                                <span>HONORS DEGREE PROGRAM</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Institut Teknologi Padang</h3>
                            <h4 className="text-lg font-medium text-gray-300">Bachelor of Computer Science (S.Kom)</h4>
                            <p className="text-sm text-gray-500 font-mono">Major in Informatics Engineering</p>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Calendar size={15} className="text-blue-500" />
                            <span>2022 — Present (Expected Graduation in May 2027)</span>
                        </div>

                        <div className="border-t border-white/5 pt-6">
                            <h5 className="text-xs font-mono tracking-widest text-gray-500 mb-4 uppercase">RELEVANT COURSEWORK</h5>
                            <div className="flex flex-wrap gap-2">
                                {coursework.map((course, idx) => (
                                    <span 
                                        key={idx} 
                                        className="px-3 py-1.5 rounded-lg border text-xs text-gray-300 transition-colors duration-300 hover:border-blue-500/50 hover:text-white"
                                        style={{ borderColor: 'var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}
                                    >
                                        {course}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Stats & Key achievements sidebar */}
                    <div className="md:col-span-5 flex flex-col gap-4 w-full h-full justify-between">
                        <div className="grid grid-cols-2 gap-4">
                            {academicStats.map((stat, idx) => (
                                <div 
                                    key={idx} 
                                    className="p-5 rounded-2xl border text-center"
                                    style={{ borderColor: 'var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}
                                >
                                    <div className="text-[10px] font-mono text-gray-500 uppercase mb-2">{stat.label}</div>
                                    <div className="text-lg font-bold text-white font-mono">{stat.value}</div>
                                </div>
                            ))}
                            <div 
                                className="p-5 rounded-2xl border text-center bg-blue-500/5 border-blue-500/10 flex flex-col items-center justify-center"
                            >
                                <Award className="w-5 h-5 text-blue-500 mb-2" />
                                <div className="text-[10px] font-mono text-blue-400 uppercase">Scholarship</div>
                                <div className="text-[11px] font-bold text-white mt-1">Academically Outstanding</div>
                            </div>
                        </div>

                        <div 
                            className="p-6 rounded-2xl border flex flex-col justify-center gap-3"
                            style={{ borderColor: 'var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}
                        >
                            <h5 className="text-xs font-mono text-gray-400 font-semibold uppercase">Academic Highlights:</h5>
                            <ul className="text-xs text-gray-500 space-y-2 list-disc pl-4 leading-relaxed">
                                <li>Final Year Student in Informatics Engineering.</li>
                                <li>Developing an Inventory Management Information System for my Final Year Project.</li>
                                <li>Applying the ABC Analysis method to improve inventory prioritization and stock management.</li>
                                <li>Continuously expanding expertise in Full Stack Web Development and modern web technologies.</li>
                            </ul>
                        </div>
                    </div>

                </div>
            </motion.div>
        </section>
    );
}
