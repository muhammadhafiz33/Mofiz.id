import { Moon, Download, Sun, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'journey', label: 'Journey' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'contact', label: 'Contact' }
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [isLightMode, setIsLightMode] = useState(() => {
        // Lazy initialize theme state
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'light';
    });
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        // Sync body class with light mode state changes
        if (isLightMode) {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.remove('light-mode');
        }
    }, [isLightMode]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 30);

            // Calculate active section
            const scrollPos = window.scrollY + 160;
            for (let i = 0; i < navItems.length; i++) {
                const sec = document.getElementById(navItems[i].id);
                if (sec) {
                    const top = sec.offsetTop;
                    const height = sec.offsetHeight;
                    if (scrollPos >= top && scrollPos < top + height) {
                        setActiveSection(navItems[i].id);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleTheme = () => {
        const isCurrentlyLight = document.body.classList.contains('light-mode');
        if (isCurrentlyLight) {
            document.body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
            setIsLightMode(false);
        } else {
            document.body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
            setIsLightMode(true);
        }
    };

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
            setActiveSection(id);
            setMobileOpen(false);
        }
    };

    return (
        <>
            <nav 
                className="navbar-blur" 
                style={{
                    top: scrolled ? '1.25rem' : '2rem',
                    width: scrolled ? '92%' : '95%',
                }}
            >
                <div className="flex items-center justify-between w-full">
                    {/* Brand Logo */}
                    <a href="#home" onClick={(e) => scrollTo(e, 'home')} className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-110">
                            <img src="/logo.png" alt="Hafiz.dev Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-sm font-semibold tracking-tight text-white font-mono transition-colors duration-300 group-hover:text-blue-500 dark:text-white body-text-primary">
                            Hafiz<span className="text-blue-500">.dev</span>
                        </span>
                    </a>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center gap-2">
                        {navItems.map(item => (
                            <a 
                                key={item.id} 
                                href={`#${item.id}`} 
                                className={`nav-item-style ${activeSection === item.id ? 'active text-blue-500!' : ''}`}
                                onClick={(e) => scrollTo(e, item.id)}
                            >
                                {item.label}
                                {activeSection === item.id && (
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-500" />
                                )}
                            </a>
                        ))}
                    </div>

                    {/* Actions Area */}
                    <div className="flex items-center gap-3">
                        {/* Theme Toggle */}
                        <button 
                            id="theme-toggle" 
                            className="p-2 rounded-full border hover:bg-white/5 dark:hover:bg-white/5 transition-all duration-300"
                            style={{ borderColor: 'var(--border-color)' }}
                            onClick={toggleTheme}
                            aria-label="Toggle Theme"
                        >
                            {isLightMode ? (
                                <Sun size={15} className="text-amber-500 animate-spin-slow" />
                            ) : (
                                <Moon size={15} className="text-blue-400" />
                            )}
                        </button>

                        {/* Resume CTA */}
                        <a 
                            href="https://docs.google.com/document/d/1e0oBS8s_4iinw_Anni83W7R516gQbQuRDVnn4xZFGH4/edit?usp=sharing" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium border hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                            style={{ 
                                borderColor: 'var(--border-color)',
                                backgroundColor: 'rgba(59, 130, 246, 0.05)',
                                color: 'var(--accent-primary)' 
                            }}
                        >
                            <span>Resume</span>
                            <Download size={13} />
                        </a>

                        {/* Mobile Menu Button */}
                        <button 
                            className="lg:hidden p-2 rounded-full border hover:bg-white/5 transition-all duration-300"
                            style={{ borderColor: 'var(--border-color)' }}
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            {mobileOpen ? <X size={15} /> : <Menu size={15} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation Drawer */}
            {mobileOpen && (
                <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md lg:hidden flex justify-end">
                    <div 
                        className="w-[280px] h-full p-8 flex flex-col justify-between"
                        style={{ 
                            backgroundColor: 'var(--bg-surface)', 
                            borderLeft: '1px solid var(--border-color)' 
                        }}
                    >
                        <div className="flex flex-col gap-6 mt-16">
                            <div className="text-xs font-mono tracking-widest text-gray-500 uppercase">NAVIGATION</div>
                            <div className="flex flex-col gap-4">
                                {navItems.map(item => (
                                    <a 
                                        key={item.id} 
                                        href={`#${item.id}`} 
                                        className={`text-lg font-medium transition-colors ${activeSection === item.id ? 'text-blue-500' : 'text-gray-400 hover:text-white'}`}
                                        onClick={(e) => scrollTo(e, item.id)}
                                    >
                                        {item.label}
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div>
                            <a 
                                href="https://docs.google.com/document/d/1e0oBS8s_4iinw_Anni83W7R516gQbQuRDVnn4xZFGH4/edit?usp=sharing" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-300 bg-blue-500 hover:bg-blue-600 shadow-md shadow-blue-500/20"
                            >
                                <span>Download CV</span>
                                <Download size={14} />
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
