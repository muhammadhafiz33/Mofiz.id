import { motion } from 'framer-motion';
import { Award, ShieldCheck, ExternalLink, Calendar, Key } from 'lucide-react';

const KominfoIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        <path d="M2 12h20"/>
    </svg>
);

const DicodingIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3 14h-2v-1.2c-.6.9-1.5 1.4-2.5 1.4-2.2 0-4-1.8-4-4s1.8-4 4-4c1 0 1.9.5 2.5 1.4V8h2v8zm-2.5-1.5c1.4 0 2.5-1.1 2.5-2.5S13.9 9.5 12.5 9.5 10 10.6 10 12s1.1 2.5 2.5 2.5z"/>
    </svg>
);

const CiscoIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <rect x="1" y="11" width="2.5" height="4" />
        <rect x="5.5" y="8" width="2.5" height="7" />
        <rect x="10" y="5" width="2.5" height="10" />
        <rect x="14.5" y="2" width="2.5" height="13" />
        <rect x="19" y="6" width="2.5" height="9" />
    </svg>
);

const getIconForOrganization = (org, colorClass) => {
    if (org.includes('Diskominfo')) return <KominfoIcon className={`w-5 h-5 ${colorClass}`} />;
    if (org.includes('Dicoding')) return <DicodingIcon className={`w-5 h-5 ${colorClass}`} />;
    if (org.includes('Cisco')) return <CiscoIcon className={`w-5 h-5 ${colorClass}`} />;
    return <Award className={`w-5 h-5 ${colorClass}`} />;
};

const certifications = [
    {
        title: "Praktek Kerja Lapangan (PKL) / Magang (Nilai: 96.83)",
        organization: "Diskominfo Kota Bukittinggi",
        date: "Sep 2025",
        credentialId: "400.14.5.4/29/PKL-DISKOMINFO/2025",
        verifyUrl: "https://drive.google.com/file/d/1LsjcAzhGbN1JiW8b3wjwnHvH80699kl0/view?usp=drive_link",
        colorClass: "text-blue-500",
        badgeBg: "bg-blue-500/10"
    },
    {
        title: "Memulai Pemrograman dengan Python (60 Jam)",
        organization: "Dicoding Indonesia",
        date: "Jun 2026",
        credentialId: "N9ZONKGQ8XG5",
        verifyUrl: "https://dicoding.com/certificates/N9ZONKGQ8XG5",
        colorClass: "text-yellow-500",
        badgeBg: "bg-yellow-500/10"
    },
    {
        title: "Belajar Dasar Cloud dan Gen AI di AWS",
        organization: "Dicoding Indonesia",
        date: "May 2026",
        credentialId: "72ZDJJJ66ZYW",
        verifyUrl: "https://dicoding.com/certificates/72ZDJJJ66ZYW",
        colorClass: "text-amber-500",
        badgeBg: "bg-amber-500/10"
    },
    {
        title: "Spec-Driven Development dengan Kiro",
        organization: "Dicoding Indonesia",
        date: "May 2026",
        credentialId: "72ZDJJJ99ZYW",
        verifyUrl: "https://dicoding.com/certificates/72ZDJJJ99ZYW",
        colorClass: "text-indigo-500",
        badgeBg: "bg-indigo-500/10"
    },
    {
        title: "Introduction to Data Science",
        organization: "Cisco Networking Academy",
        date: "Mar 2026",
        credentialId: "2da72500-e84d-4796-9f0d-36c3de7bef04",
        verifyUrl: "https://www.netacad.com",
        colorClass: "text-cyan-500",
        badgeBg: "bg-cyan-500/10"
    }
];

export default function Certifications() {
    return (
        <section id="certifications" className="py-24 px-6 max-w-6xl mx-auto">
            <motion.div 
                className="sec-header"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <div className="badge-outline mb-4">
                    <Award size={12} className="text-blue-500" />
                    <span>Credentials</span>
                </div>
                <h2 className="sec-title">Certifications & Accreditations</h2>
                <p className="sec-subtitle">Verified professional credentials demonstrating technical knowledge across Cloud, Web Development, and Systems.</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 mt-12">
                {certifications.map((cert, idx) => (
                    <motion.div 
                        key={idx}
                        className="premium-card p-6 flex flex-col justify-between"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.05 }}
                    >
                        <div className="space-y-4">
                            {/* Card Header: Org Badge & Check Icon */}
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl ${cert.badgeBg} flex items-center justify-center`}>
                                        {getIconForOrganization(cert.organization, cert.colorClass)}
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold text-white font-mono uppercase tracking-wider">{cert.organization}</h4>
                                        <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                            <Calendar size={10} />
                                            <span>Issued: {cert.date}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px] font-semibold border border-green-500/20">
                                    <ShieldCheck size={10} />
                                    <span>Verified</span>
                                </div>
                            </div>

                            {/* Cert Title */}
                            <h3 className="text-base font-bold text-white leading-snug">{cert.title}</h3>
                        </div>

                        {/* ID & Verification Button */}
                        <div className="border-t border-white/5 pt-4 mt-6 flex items-center justify-between text-[11px] font-mono">
                            <div className="flex items-center gap-1.5 text-gray-500">
                                <Key size={11} />
                                <span>ID: <span className="text-gray-400">{cert.credentialId}</span></span>
                            </div>
                            <a 
                                href={cert.verifyUrl}
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-400 transition-colors font-semibold"
                            >
                                <span>Verify</span>
                                <ExternalLink size={11} />
                            </a>
                        </div>

                    </motion.div>
                ))}
            </div>
        </section>
    );
}
