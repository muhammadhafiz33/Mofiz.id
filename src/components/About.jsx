import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Globe, BookOpen, Target, Languages } from 'lucide-react';

export default function About() {
    const [isQuoteTranslated, setIsQuoteTranslated] = useState(false);
    const [isBioTranslated, setIsBioTranslated] = useState(false);
    
    const cardData = [
        {
            icon: <Globe className="w-5 h-5 text-blue-500" />,
            title: "Web Development",
            desc: "Designing and developing modern, responsive websites that combine elegant layouts with robust backend functionality."
        },
        {
            icon: <BookOpen className="w-5 h-5 text-cyan-500" />,
            title: "Continuous Learning",
            desc: "Constantly exploring modern web frameworks and technologies to apply them in academic and personal projects."
        },
        {
            icon: <Target className="w-5 h-5 text-blue-400" />,
            title: "Career Vision",
            desc: "Aspiring to build reliable, high-impact web systems while collaborating in professional teams and taking on new challenges."
        }
    ];

    return (
        <section id="about" className="py-24 px-6 max-w-6xl mx-auto">
            <motion.div 
                className="sec-header"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <div className="badge-outline mb-4">
                    <User size={12} className="text-blue-500" />
                    <span>About Me</span>
                </div>
                <h2 className="sec-title">My Story & Professional Philosophy</h2>
                <p className="sec-subtitle">A final-year Informatics Engineering student bridging the gap between sophisticated software engineering and beautiful user interfaces.</p>
            </motion.div>

            <div className="grid lg:grid-cols-12 gap-10 items-stretch">
                
                {/* Left Panel: High Quality Minimal Photo & Basic info */}
                <motion.div 
                    className="lg:col-span-5 flex flex-col gap-6"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="premium-card p-6 flex flex-col justify-between h-full min-h-[300px]">
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                    <span className="font-mono text-blue-500 font-bold text-base">MH</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Muhammad Hafiz</h3>
                                    <p className="text-xs text-gray-500 font-mono">Informatics Engineering</p>
                                </div>
                            </div>
                            
                            <blockquote className="text-sm text-gray-400 italic leading-relaxed mb-6">
                                "{isQuoteTranslated 
                                    ? "Setiap bug adalah pelajaran. Setiap proyek adalah kemajuan. Pengembang hebat dibangun melalui rasa ingin tahu, konsistensi, dan baris kode yang tak terhitung jumlahnya."
                                    : "Every bug is a lesson. Every project is progress. Great developers are built through curiosity, consistency, and countless lines of code."}"
                                <button 
                                    onClick={() => setIsQuoteTranslated(!isQuoteTranslated)}
                                    className="inline-flex items-center justify-center ml-2 p-1 rounded hover:bg-white/5 text-gray-500 hover:text-blue-400 transition-colors align-middle"
                                    title="Translate quote"
                                >
                                    <Languages size={14} />
                                </button>
                            </blockquote>
                        </div>
                        
                        <div className="border-t border-white/5 pt-4 space-y-2.5 text-xs font-mono text-gray-400">
                            <div className="flex justify-between"><span className="text-gray-500">UNIVERSITY</span><span className="text-white">Institut Teknologi Padang</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">MAJOR</span><span className="text-white">Informatics Engineering</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">INTERESTS</span><span className="text-white">Full-Stack, UI/UX, AI Integrations</span></div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Panel: Narrative Biography & Core Values */}
                <motion.div 
                    className="lg:col-span-7 flex flex-col gap-6"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="premium-card p-8 flex flex-col justify-between h-full">
                        <div className="space-y-4 text-sm text-gray-400 leading-relaxed mb-8">
                            {isBioTranslated ? (
                                <>
                                    <p>Perjalanan saya di dunia teknologi berawal dari rasa ingin tahu ketika saya menyadari bahwa pemrograman dapat mengubah logika abstrak menjadi alat yang fungsional.</p>
                                    <p>Saat ini, saya adalah mahasiswa tingkat akhir jurusan Teknik Informatika. Sepanjang perjalanan akademis saya, saya telah mendedikasikan diri untuk menguasai framework modern, arsitektur sistem, dan desain. Saya senang bekerja di berbagai lapisan — mengembangkan frontend React yang responsif, API backend Node/PHP yang tangguh, dan menyiapkan lingkungan pengembangan yang aman.</p>
                                    <p>Saat saya tidak sedang coding, saya suka mendesain tata letak di Figma dan mengikuti standar web terbaru. Saya berusaha membuat aplikasi web yang benar-benar memberikan dampak dan berharap dapat berkembang menjadi pemimpin teknik senior yang membangun sistem dan platform cloud yang terukur.</p>
                                    <p>Dan dengan kemajuan teknologi AI, ini dapat membantu saya mengembangkan kreativitas di bidang saya.
                                        <button 
                                            onClick={() => setIsBioTranslated(!isBioTranslated)}
                                            className="inline-flex items-center justify-center ml-2 p-1 rounded hover:bg-white/5 text-gray-500 hover:text-blue-400 transition-colors align-middle"
                                            title="Translate bio"
                                        >
                                            <Languages size={14} />
                                        </button>
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p>My journey into the world of technology started out of curiosity when I realized that programming could turn abstract logic into functional tools.</p>
                                    <p>Currently, I am a final-year student majoring in Informatics Engineering. Throughout my academic career, I have dedicated myself to mastering modern frameworks, system architecture, and design. I enjoy working across different layers — developing responsive React frontends, robust Node/PHP backend APIs, and setting up secure development environments.</p>
                                    <p>When I’m not coding, I love designing layouts in Figma and keeping up with the latest web standards. I strive to create web applications that truly make an impact and hope to grow into a senior engineering leader building scalable systems and cloud platforms.</p>
                                    <p>And with the advancement of AI technology, it can help me develop creativity in my field.
                                        <button 
                                            onClick={() => setIsBioTranslated(!isBioTranslated)}
                                            className="inline-flex items-center justify-center ml-2 p-1 rounded hover:bg-white/5 text-gray-500 hover:text-blue-400 transition-colors align-middle"
                                            title="Translate bio"
                                        >
                                            <Languages size={14} />
                                        </button>
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Values Grid */}
                        <div className="grid md:grid-cols-3 gap-4">
                            {cardData.map((val, i) => (
                                <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:border-white/10 transition-colors">
                                    <div className="mb-3">{val.icon}</div>
                                    <h4 className="text-xs font-semibold text-white mb-1.5">{val.title}</h4>
                                    <p className="text-[11px] text-gray-500 leading-normal">{val.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
