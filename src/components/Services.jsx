import { motion } from 'framer-motion';
import { Laptop, Layout, Server, Database, Activity, MessagesSquare, Check } from 'lucide-react';

const serviceData = [
    {
        icon: <Laptop className="w-5 h-5" />,
        title: "Web Development",
        desc: "Building highly interactive, responsive web applications using React.js, Next.js, and clean CSS styling solutions.",
        bullets: ["Client & Admin Dashboards", "Landing Pages & SEO Setup", "Modular Code Architecture"]
    },
    {
        icon: <Layout className="w-5 h-5" />,
        title: "UI/UX Design",
        desc: "Designing minimalist visual structures and interactive prototypes in Figma with strong emphasis on typography and spacing.",
        bullets: ["Interactive Figma Prototypes", "Design System Setup", "Wireframes & User Flows"]
    },
    {
        icon: <Server className="w-5 h-5" />,
        title: "API Development",
        desc: "Engineering robust server-side APIs in Node.js, Express, or Laravel, complete with rate limiting and secure tokens.",
        bullets: ["RESTful & GraphQL API", "JWT & OAuth Integration", "Request Validations & Testing"]
    },
    {
        icon: <Database className="w-5 h-5" />,
        title: "Database Design",
        desc: "Structuring relational and document-based databases, optimizing indexing schemas, and safeguarding query speeds.",
        bullets: ["Schema Normalization", "Indexed Queries Optimization", "Backup & Migration Scripts"]
    },
    {
        icon: <Activity className="w-5 h-5" />,
        title: "System Analysis",
        desc: "Deconstructing project parameters into structured block diagrams, data flow diagrams, and detailed design documents.",
        bullets: ["Data Flow Mapping", "UML Diagram Creation", "Technical Spec Drafting"]
    },
    {
        icon: <MessagesSquare className="w-5 h-5" />,
        title: "Technical Consultation",
        desc: "Collaborating to plan software architecture, select hosting options, review code quality, and establish development tasks.",
        bullets: ["Tech Stack Selection", "Performance Audit reviews", "Best Practices Coaching"]
    }
];

export default function Services() {
    return (
        <section id="services" className="py-24 px-6 max-w-6xl mx-auto text-left">
            <motion.div 
                className="sec-header"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <div className="badge-outline mb-4">
                    <Check size={12} className="text-blue-500" />
                    <span>My Services</span>
                </div>
                <h2 className="sec-title">What I Do</h2>
                <p className="sec-subtitle">Comprehensive software engineering, database planning, user design, and technical advising services.</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                {serviceData.map((svc, idx) => (
                    <motion.div 
                        key={idx}
                        className="premium-card p-6 flex flex-col justify-between"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.05 }}
                    >
                        <div>
                            {/* Icon header */}
                            <div className="service-icon-box">
                                {svc.icon}
                            </div>
                            
                            <h3 className="text-base font-bold text-white mb-2 leading-tight">{svc.title}</h3>
                            <p className="text-xs text-gray-400 leading-relaxed mb-6">{svc.desc}</p>
                        </div>

                        {/* Bullet deliverables */}
                        <div className="border-t border-white/5 pt-4 mt-auto">
                            <ul className="space-y-2">
                                {svc.bullets.map((b, bIdx) => (
                                    <li key={bIdx} className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                                        <Check size={10} className="text-blue-500" />
                                        <span>{b}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
