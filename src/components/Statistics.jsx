import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { BarChart3 } from 'lucide-react';

const statsData = [
    { label: "Years of Experience", target: 2, suffix: "+" },
    { label: "Projects Completed", target: 7, suffix: "" },
    { label: "Certificates Earned", target: 5, suffix: "" }
];

function StatCell({ label, target, suffix, isVisible }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isVisible) return;
        
        let start = 0;
        const duration = 1200; // ms
        const stepTime = Math.max(Math.floor(duration / target), 15);
        
        const timer = setInterval(() => {
            start += Math.ceil(target / (duration / stepTime));
            if (start >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, stepTime);

        return () => clearInterval(timer);
    }, [target, isVisible]);

    return (
        <div 
            className="premium-card p-6 text-center flex flex-col justify-center min-h-[140px]"
        >
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">
                {label}
            </div>
            <div className="stat-value font-mono text-blue-500">
                {count.toLocaleString()}{suffix}
            </div>
        </div>
    );
}

export default function Statistics() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    return (
        <section ref={ref} id="statistics" className="py-24 px-6 max-w-6xl mx-auto">
            <motion.div 
                className="sec-header"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <div className="badge-outline mb-4">
                    <BarChart3 size={12} className="text-blue-500" />
                    <span>Statistics</span>
                </div>
                <h2 className="sec-title">Years of Experience & Completed Projects</h2>
                <p className="sec-subtitle">Membangun ekosistem web berkinerja tinggi, responsif, dan terintegrasi dengan teknologi AI modern.</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12">
                {statsData.map((stat, idx) => (
                    <StatCell 
                        key={idx} 
                        label={stat.label} 
                        target={stat.target} 
                        suffix={stat.suffix} 
                        isVisible={isInView}
                    />
                ))}
            </div>
        </section>
    );
}
