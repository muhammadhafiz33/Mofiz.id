import { Mail, Phone, MapPin } from 'lucide-react';

const LinkedinIcon = () => (
    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);

const InstagramIcon = () => (
    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

const footerNavs = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'journey', label: 'Journey' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contact' }
];

export default function Footer() {
    const scrollTo = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const offset = 90;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <footer className="footer bg-gray-950/45 dark:bg-gray-950/45 border-t py-12 px-6" style={{ borderColor: 'var(--border-color)' }}>
            <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-8 items-start text-left">
                
                {/* Brand Column */}
                <div className="md:col-span-5 space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                            <img src="/logo.png" alt="Hafiz.dev Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-sm font-bold text-white font-mono">Hafiz.dev</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
                        Informatics Engineering student building high-performance, responsive fullstack web environments and AI-based integrations.
                    </p>
                    <div className="space-y-2 pt-2 text-[11px] text-gray-400 font-mono">
                        <div className="flex items-center gap-2">
                            <Mail size={12} className="text-blue-500" />
                            <span>hm2053276@gmail.com</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone size={12} className="text-blue-500" />
                            <span>+62 822-xxxx-xxxx</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin size={12} className="text-blue-500" />
                            <span>Padang, West Sumatra, Indonesia</span>
                        </div>
                    </div>
                </div>

                {/* Navigation Links Column */}
                <div className="md:col-span-3 space-y-4">
                    <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">LINKS</h4>
                    <ul className="grid grid-cols-2 gap-2 text-xs">
                        {footerNavs.map(nav => (
                            <li key={nav.id}>
                                <a 
                                    href={`#${nav.id}`} 
                                    onClick={(e) => scrollTo(e, nav.id)}
                                    className="text-gray-400 hover:text-blue-500 transition-colors"
                                >
                                    {nav.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Social Profiles Column */}
                <div className="md:col-span-4 space-y-4">
                    <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">CONNECT</h4>
                    <div className="flex items-center gap-3">
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl border hover:border-blue-500 hover:text-blue-500 transition-all duration-300" style={{ borderColor: 'var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
                            <LinkedinIcon />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl border hover:border-blue-500 hover:text-blue-500 transition-all duration-300" style={{ borderColor: 'var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
                            <InstagramIcon />
                        </a>
                    </div>
                    <div className="text-[10px] text-gray-500 leading-normal pt-2">
                        Designed with focus on speed, typography, and clean spacing.
                    </div>
                </div>

            </div>

            {/* Bottom Row */}
            <div className="max-w-6xl mx-auto border-t mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: 'var(--border-color)' }}>
                <p className="text-[11px] text-gray-500">&copy; {new Date().getFullYear()} Muhammad Hafiz. All rights reserved.</p>
                <div className="flex items-center gap-4 text-[10px] font-mono text-gray-500">
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <span>&middot;</span>
                    <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
}
