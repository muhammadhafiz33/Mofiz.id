import { motion } from 'framer-motion';
import { Trophy, Sparkles, Flame, GitPullRequest } from 'lucide-react';

const achievementData = [
    {
        category: "Scholarship",
        title: "Outstanding Student Scholarship",
        issuer: "Institut Teknologi Padang",
        desc: "Awarded academic tuition scholarship for consecutive semesters in recognition of maintaining a GPA of 3.82+.",
        icon: <Sparkles className="w-5 h-5 text-blue-500" />,
        badgeClass: "bg-blue-500/10 border-blue-500/20 text-blue-400"
    },
    {
        category: "Competition",
        title: "Skills Competition (LKS) Multimedia",
        issuer: "Vocational High School Board",
        desc: "Secured top placement in regional student skills competition demonstrating speed and precision in video production and graphic design.",
        icon: <Trophy className="w-5 h-5 text-amber-500" />,
        badgeClass: "bg-amber-500/10 border-amber-500/20 text-amber-400"
    },
    {
        category: "Hackathon",
        title: "Runner-up: Regional Smart City Hackathon",
        issuer: "Local Development Agency",
        desc: "Co-developed a digital public service prototype for municipal administrative reporting workflows under a 48-hour timeline.",
        icon: <Flame className="w-5 h-5 text-red-500" />,
        badgeClass: "bg-red-500/10 border-red-500/20 text-red-400"
    },
    {
        category: "Open Source",
        title: "Active GitHub Collaborator",
        issuer: "Open Source Community",
        desc: "Contributed components, styling patches, and README documentation translations to modern web framework packages.",
        icon: <GitPullRequest className="w-5 h-5 text-cyan-500" />,
        badgeClass: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
    }
];

export default function Achievements() {
    return (
        <section id="achievements" className="py-24 px-6 max-w-6xl mx-auto text-left">
            <motion.div 
                className="sec-header"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <div className="badge-outline mb-4">
                    <Trophy size={12} className="text-blue-500" />
                    <span>Achievements</span>
                </div>
                <h2 className="sec-title">Awards & Milestones</h2>
                <p className="sec-subtitle">A review of recognitions, competition standings, scholarship milestones, and open source achievements.</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 mt-12">
                {achievementData.map((ach, idx) => (
                    <motion.div 
                        key={idx}
                        className="premium-card p-6 flex flex-col justify-between"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.05 }}
                    >
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold border ${ach.badgeClass}`}>
                                    {ach.category}
                                </span>
                                <div className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-center">
                                    {ach.icon}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-base font-bold text-white mb-1 leading-snug">{ach.title}</h3>
                                <p className="text-[11px] text-gray-500 font-mono">Issued by {ach.issuer}</p>
                            </div>

                            <p className="text-xs text-gray-400 leading-relaxed pt-2">
                                {ach.desc}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
