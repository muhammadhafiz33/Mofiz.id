import { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Code, GraduationCap, Laptop, Building, Compass as TargetIcon, Languages } from 'lucide-react';

const timelineSteps = [
    {
        year: "2022",
        title: "Started Learning Programming",
        titleId: "Mulai Belajar Pemrograman",
        subtitle: "The Beginning",
        subtitleId: "Awal Mula",
        desc: "Started my journey in software development after entering the Informatics Engineering program. Learned the fundamentals of HTML, CSS, and C++, while building logical thinking and problem-solving skills through programming exercises and academic projects.",
        descId: "Memulai perjalanan saya dalam pengembangan perangkat lunak setelah masuk program studi Teknik Informatika. Mempelajari dasar-dasar HTML, CSS, dan C++, sambil membangun pemikiran logis dan keterampilan pemecahan masalah melalui latihan pemrograman dan proyek akademis.",
        icon: <Code className="w-5 h-5" />,
    },
    {
        year: "2022",
        title: "Began Informatics Engineering",
        titleId: "Mulai Teknik Informatika",
        subtitle: "Higher Education",
        subtitleId: "Pendidikan Tinggi",
        desc: "Started pursuing a Bachelor's degree in Informatics Engineering. Studied core computer science subjects including algorithms, data structures, object-oriented programming, databases, computer networks, and software engineering.",
        descId: "Mulai menempuh pendidikan S1 Teknik Informatika. Mempelajari mata kuliah inti ilmu komputer termasuk algoritma, struktur data, pemrograman berorientasi objek, basis data, jaringan komputer, dan rekayasa perangkat lunak.",
        icon: <GraduationCap className="w-5 h-5" />,
    },
    {
        year: "2023",
        title: "Built First Web Projects",
        titleId: "Membangun Proyek Web Pertama",
        subtitle: "Web Development",
        subtitleId: "Pengembangan Web",
        desc: "Developed several academic and personal web applications to improve frontend and backend development skills. Learned responsive design, database integration, and modern web development practices.",
        descId: "Mengembangkan beberapa aplikasi web akademis dan pribadi untuk meningkatkan keterampilan pengembangan frontend dan backend. Mempelajari desain responsif, integrasi basis data, dan praktik pengembangan web modern.",
        icon: <Laptop className="w-5 h-5" />,
    },
    {
        year: "Sep – Oct 2025",
        title: "Web Developer Intern",
        titleId: "Magang Pengembang Web",
        subtitle: "Kominfo Kota Bukittinggi",
        subtitleId: "Kominfo Kota Bukittinggi",
        desc: "Developed a web-based system for interns during my time at Diskominfo Bukittinggi. The system allows interns to submit daily morning attendance and create progress reports, which are then monitored directly by their respective mentors. It is intended to be a permanent solution for managing future intern intakes.",
        descId: "Membangun sistem berbasis web untuk peserta magang di Diskominfo Bukittinggi. Sistem ini memungkinkan anak magang untuk melakukan absensi rutin setiap pagi dan membuat laporan progres yang kemudian dipantau langsung oleh mentor masing-masing. Sistem ini diharapkan dapat menjadi platform permanen untuk penerimaan peserta magang selanjutnya.",
        icon: <Building className="w-5 h-5" />,
    },
    {
        year: "2026 – Present",
        title: "Undergraduate Final Project (Skripsi)",
        titleId: "Tugas Akhir S1 (Skripsi)",
        subtitle: "Skripsi",
        subtitleId: "Skripsi",
        desc: "Currently developing an Inventory Management Information System for a vegetable warehouse as part of my undergraduate final project. The application utilizes the ABC Analysis method to support inventory prioritization and improve stock management efficiency",
        descId: "Saat ini sedang mengembangkan Sistem Informasi Manajemen Persediaan untuk gudang sayuran sebagai bagian dari tugas akhir S1 saya. Aplikasi ini menggunakan metode Analisis ABC untuk mendukung penentuan prioritas persediaan dan meningkatkan efisiensi manajemen stok",
        icon: <TargetIcon className="w-5 h-5" />,
    },
    {
        year: "Expected May 2027",
        title: "Graduation & Career Goals",
        titleId: "Kelulusan & Tujuan Karier",
        subtitle: "Looking Forward",
        subtitleId: "Menatap ke Depan",
        desc: "Expected to graduate with a Bachelor's degree in Informatics Engineering in May 2027. Currently seeking opportunities as a Full Stack Developer or Software Engineer while learning React, Next.js, and Cloud architectures.",
        descId: "Diharapkan lulus dengan gelar Sarjana Teknik Informatika pada Mei 2027. Saat ini mencari peluang sebagai Full Stack Developer atau Software Engineer sambil mempelajari arsitektur React, Next.js, dan Cloud.",
        icon: <GraduationCap className="w-5 h-5" />,
    }
];

export default function Journey() {
    const [isTranslated, setIsTranslated] = useState(false);

    return (
        <section id="journey" className="py-24 px-6 max-w-6xl mx-auto overflow-hidden">
            <motion.div 
                className="sec-header"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <div className="badge-outline mb-4">
                    <Compass size={12} className="text-blue-500" />
                    <span>My Journey</span>
                </div>
                <h2 className="sec-title">
                    Development Timeline
                    <button 
                        onClick={() => setIsTranslated(!isTranslated)}
                        className="inline-flex items-center justify-center ml-2 p-1 rounded hover:bg-white/5 text-gray-500 hover:text-blue-400 transition-colors align-middle"
                        title="Translate Timeline"
                    >
                        <Languages size={18} />
                    </button>
                </h2>
                <p className="sec-subtitle">A chronological record of my path, technical development, and academic benchmarks.</p>
            </motion.div>

            <div className="relative mt-16 max-w-full">
                {/* Horizontal Timeline Track */}
                <div className="absolute top-[23px] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--border-color)] to-transparent" />

                {/* Horizontal Scrolling Container */}
                <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-6 pb-12 pt-4 px-4 md:px-8">
                    {timelineSteps.map((step, idx) => (
                        <div 
                            key={idx} 
                            className="snap-center shrink-0 w-[85vw] md:w-[400px] flex flex-col relative group"
                        >
                            {/* Timeline Dot */}
                            <div className="w-[16px] h-[16px] rounded-full border-4 border-blue-500 bg-[var(--bg-surface)] mb-8 ml-8 relative z-10 transition-all duration-300 group-hover:scale-125 group-hover:shadow-[0_0_12px_rgba(59,130,246,0.6)]" />

                            <motion.div 
                                className="premium-card p-6 flex-1 text-left relative overflow-hidden"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                            >
                                {/* Connector line from dot to card */}
                                <div className="absolute top-0 left-[31px] w-[2px] h-6 bg-gradient-to-b from-[var(--border-color)] to-transparent -translate-y-full" />
                                
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                                        {step.icon}
                                    </div>
                                    <div>
                                        <span className="text-xs font-mono text-blue-500 font-bold">{step.year}</span>
                                        <h3 className="text-base font-bold text-white leading-tight">{isTranslated ? step.titleId : step.title}</h3>
                                    </div>
                                </div>
                                <div className="text-xs font-semibold text-gray-500 mb-3 font-mono uppercase tracking-wider">{isTranslated ? step.subtitleId : step.subtitle}</div>
                                <p className="text-sm text-gray-400 leading-relaxed">{isTranslated ? step.descId : step.desc}</p>
                            </motion.div>
                        </div>
                    ))}
                </div>
                
                {/* Scroll Indicators */}
                <div className="flex items-center justify-center gap-1.5 mt-6">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500/30"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500/10"></div>
                </div>
            </div>
        </section>
    );
}
