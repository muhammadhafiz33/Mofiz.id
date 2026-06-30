import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';

const techItems = [
    { name: 'JavaScript', icon: 'devicon-javascript-plain', color: '#F7DF1E' },
    { name: 'React.js', icon: 'devicon-react-original', color: '#61DAFB' },
    { name: 'Tailwind CSS', icon: 'devicon-tailwindcss-plain', color: '#06B6D4' },
    { name: 'Node.js', icon: 'devicon-nodejs-plain', color: '#339933' },
    { name: 'Express.js', icon: 'devicon-express-original', color: '#828282' },
    { name: 'PHP', icon: 'devicon-php-plain', color: '#777BB4' },
    { name: 'MySQL', icon: 'devicon-mysql-plain', color: '#4479A1' },
    { name: 'Firebase', icon: 'devicon-firebase-plain', color: '#FFCA28' },
    { name: 'Git', icon: 'devicon-git-plain', color: '#F05032' },
    { name: 'Figma', icon: 'devicon-figma-plain', color: '#F24E1E' },
    { name: 'VS Code', icon: 'devicon-vscode-plain', color: '#007ACC' }
];

export default function TechStack() {
    const row1 = techItems.slice(0, 6);
    const row2 = techItems.slice(6, 11);
    
    // Duplicate items for the infinite loop
    const loopedRow1 = [...row1, ...row1];
    const loopedRow2 = [...row2, ...row2];

    return (
        <section id="tools" className="py-24 px-6 max-w-6xl mx-auto overflow-hidden">
            <motion.div 
                className="sec-header"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <div className="badge-outline mb-4">
                    <Layers size={12} className="text-blue-500" />
                    <span>Tech Stack Wall</span>
                </div>
                <h2 className="sec-title">Core Ecosystem</h2>
                <p className="sec-subtitle">A collection of tools, engines, runtimes, and languages I actively use. Hover to inspect brand palettes.</p>
            </motion.div>

            <div className="mt-16 relative w-full flex flex-col gap-4 overflow-hidden rounded-2xl">
                {/* Left/Right Fade Gradients for smooth entrance/exit */}
                <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-[var(--bg-primary)] to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-[var(--bg-primary)] to-transparent z-10 pointer-events-none"></div>
                
                {/* Row 1 - Moves Left */}
                <div className="animate-marquee flex gap-4 py-2 px-2" style={{ animationDuration: '40s' }}>
                    {loopedRow1.map((tech, index) => (
                        <div 
                            key={`r1-${tech.name}-${index}`} 
                            className="tech-wall-item group min-w-max"
                            style={{ '--hover-color': tech.color }}
                        >
                            <i 
                                className={`${tech.icon} text-xl md:text-2xl transition-colors duration-300 text-gray-500 group-hover:text-[var(--hover-color)]`}
                            />
                            <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                                {tech.name}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Row 2 - Moves Right */}
                <div className="animate-marquee flex gap-4 py-2 px-2" style={{ animationDirection: 'reverse', animationDuration: '35s' }}>
                    {loopedRow2.map((tech, index) => (
                        <div 
                            key={`r2-${tech.name}-${index}`} 
                            className="tech-wall-item group min-w-max"
                            style={{ '--hover-color': tech.color }}
                        >
                            <i 
                                className={`${tech.icon} text-xl md:text-2xl transition-colors duration-300 text-gray-500 group-hover:text-[var(--hover-color)]`}
                            />
                            <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                                {tech.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
