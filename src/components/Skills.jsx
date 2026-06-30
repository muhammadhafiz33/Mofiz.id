import { motion } from 'framer-motion';
import { Cpu, Code2, Database, Layout, Smartphone, Cloud, PenTool } from 'lucide-react';

const skillCategories = [
    {
        title: "Frontend Development",
        icon: <Layout className="w-5 h-5 text-blue-500" />,
        skills: [
            { name: "HTML5 / CSS3", level: 95 },
            { name: "JavaScript (ES6+)", level: 90 },
            { name: "TypeScript", level: 80 },
            { name: "React JS", level: 88 },
            { name: "Tailwind CSS", level: 95 }
        ]
    },
    {
        title: "Backend Development",
        icon: <Code2 className="w-5 h-5 text-cyan-500" />,
        skills: [
            { name: "Node.js / Express", level: 85 },
            { name: "PHP", level: 88 },
            { name: "Python", level: 80 }
        ]
    },
    {
        title: "Databases & Storage",
        icon: <Database className="w-5 h-5 text-blue-400" />,
        skills: [
            { name: "MySQL", level: 90 },
            { name: "Firebase Services", level: 85 }
        ]
    },
    {
        title: "Mobile Development",
        icon: <Smartphone className="w-5 h-5 text-cyan-400" />,
        skills: [
            { name: "Flutter (Dart)", level: 78 },
            { name: "React Native", level: 75 }
        ]
    },
    {
        title: "Cloud & DevOps",
        icon: <Cloud className="w-5 h-5 text-blue-500" />,
        skills: [
            { name: "Git & GitHub", level: 90 },
            { name: "Vercel / Netlify", level: 88 }
        ]
    },
    {
        title: "Design & Workspace Tools",
        icon: <PenTool className="w-5 h-5 text-cyan-500" />,
        skills: [
            { name: "VS Code Editor", level: 95 },
            { name: "Figma UI/UX Design", level: 85 },
            { name: "Postman API client", level: 88 },
            { name: "Canva Design", level: 80 },
            { name: "Notion Planner", level: 90 }
        ]
    }
];

export default function Skills() {
    return (
        <section id="skills" className="py-24 px-6 max-w-6xl mx-auto">
            <motion.div 
                className="sec-header"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <div className="badge-outline mb-4">
                    <Cpu size={12} className="text-blue-500" />
                    <span>Skills Directory</span>
                </div>
                <h2 className="sec-title">Technical Expertise</h2>
                <p className="sec-subtitle">A categorized layout of tools, frameworks, databases, and environments I work with, rated by proficiency.</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skillCategories.map((category, catIdx) => (
                    <motion.div 
                        key={catIdx}
                        className="premium-card p-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.5, delay: catIdx * 0.05 }}
                    >
                        <div className="flex items-center gap-3 mb-6 pb-3 border-b border-white/5">
                            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                {category.icon}
                            </div>
                            <h3 className="font-semibold text-white text-sm">{category.title}</h3>
                        </div>

                        <div className="space-y-3">
                            {category.skills.map((skill, skillIdx) => (
                                <div key={skillIdx} className="flex items-center gap-2.5 text-xs text-gray-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    <span className="font-medium">{skill.name}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
