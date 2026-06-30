import { motion } from 'framer-motion';

export default function Setup() {
    return (
        <section id="setup" className="setup">
            <motion.div 
                className="section-header"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <div className="hero-label">
                    <span className="cursor-symbol">{'>'}</span> setup
                </div>
                <h2 className="section-title">My Setup</h2>
                <p className="section-subtitle">The hardware, operating system, and tools I use for development.</p>
            </motion.div>

            <motion.div 
                className="setup-grid"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
                }}
            >
                <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } }} className="setup-card">
                    <h3 className="s-title">Hardware</h3>
                    <p className="s-detail">Thinkpad T495</p>
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } }} className="setup-card">
                    <h3 className="s-title">Operating System</h3>
                    <p className="s-detail">Windows 11</p>
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } }} className="setup-card">
                    <h3 className="s-title">Code Editor</h3>
                    <p className="s-detail">Visual Studio Code / Copilot</p>
                </motion.div>
            </motion.div>
        </section>
    );
}
