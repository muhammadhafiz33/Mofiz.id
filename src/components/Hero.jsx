import { MapPin, ArrowRight, Download, Mail } from 'lucide-react';
import { useHackerText } from '../hooks/useHackerText';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

const LinkedinIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);

const InstagramIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

const terminalCommands = [
    'linkedin',
    'linkedin.com/in/muhammad-hafiz',
    'email',
    'hm2053276@gmail.com'
];

export default function Hero() {
    const firstName = useHackerText("Muhammad");
    const lastName = useHackerText("Hafiz");
    const [typedText, setTypedText] = useState('');
    const [commandOutput, setCommandOutput] = useState([]);
    
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });
    
    // Using pixels instead of percentages for smoother sub-pixel rendering
    const yHero = useTransform(scrollYProgress, [0, 1], [0, 250]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.9], [1, 0]);
    
    useEffect(() => {
        let commandIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 80;
        let timeout;

        const type = () => {
            const currentText = terminalCommands[commandIndex];
            
            if (isDeleting) {
                setTypedText(currentText.substring(0, charIndex - 1));
                charIndex--;
                typeSpeed = 40;
            } else {
                setTypedText(currentText.substring(0, charIndex + 1));
                charIndex++;
                typeSpeed = 80;
            }

            if (!isDeleting && charIndex === currentText.length) {
                // If it is a command (even index: whoami, instagram, email, linkedin)
                if (commandIndex % 2 === 0) {
                    typeSpeed = 1500; // Pause at typed command
                    isDeleting = false;
                    // Trigger output print immediately after command is fully typed
                    setTimeout(() => {
                        setCommandOutput(prev => {
                            const newOutput = [
                                ...prev,
                                { type: 'command', text: currentText },
                                { type: 'result', text: terminalCommands[commandIndex + 1] }
                            ];
                            // Limit output window to show last 2 executions (4 items: 2 commands, 2 results)
                            if (newOutput.length > 4) {
                                newOutput.shift();
                                newOutput.shift();
                            }
                            return newOutput;
                        });
                        
                        // Move to next step (deleting current command line to type next command)
                        isDeleting = true;
                    }, 1000);
                } else {
                    // This is an output line - we actually skip typing output lines and jump to next command
                    isDeleting = false;
                    commandIndex = (commandIndex + 1) % terminalCommands.length;
                    charIndex = 0;
                    typeSpeed = 200;
                }
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                // Move from output to next command
                commandIndex = (commandIndex + 2) % terminalCommands.length;
                typeSpeed = 300;
            }

            timeout = setTimeout(type, typeSpeed);
        };

        timeout = setTimeout(type, typeSpeed);
        return () => clearTimeout(timeout);
    }, []);

    const staggerContainer = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
        }
    };

    const itemVariant = {
        hidden: { opacity: 0, y: 25 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <section id="home" className="hero-wrapper" ref={containerRef}>
            <motion.div 
                className="max-w-6xl w-full mx-auto grid lg:grid-cols-12 gap-12 items-center"
                style={{ y: yHero, opacity: opacityHero, willChange: "transform, opacity" }}
            >
                
                {/* Hero Information */}
                <motion.div 
                    className="lg:col-span-7 flex flex-col items-start"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                >
                    <motion.div variants={itemVariant} className="badge-outline mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                        <span>Computer Engineer</span>
                    </motion.div>

                    <motion.h1 variants={itemVariant} className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
                        <span 
                            className="cursor-pointer font-sans select-none" 
                            onMouseEnter={firstName.triggerScramble}
                        >
                            {firstName.text}
                        </span>{' '}
                        <span 
                            className="text-blue-500 cursor-pointer font-sans select-none" 
                            onMouseEnter={lastName.triggerScramble}
                        >
                            {lastName.text}
                        </span>
                    </motion.h1>

                    <motion.h2 variants={itemVariant} className="text-lg md:text-xl font-medium text-gray-400 mb-6 font-mono">
                        Informatics Student <span className="text-blue-500 font-sans">|</span> Full Stack Developer <span className="text-blue-500 font-sans">|</span> UI/UX Enthusiast
                    </motion.h2>

                    <motion.p variants={itemVariant} className="text-base text-gray-400 dark:text-gray-400 max-w-xl leading-relaxed mb-6">
                        Hi, I'm Muhammad Hafiz. I study Informatics Engineering and design highly functional, clean, and interactive digital products. I combine solid backend systems with modern minimalist user interfaces.
                    </motion.p>
                    
                    <motion.div variants={itemVariant} className="flex flex-wrap items-center gap-2 mb-8 text-sm text-gray-400">
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                            <MapPin size={13} className="text-blue-500" /> Padang, Indonesia
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> I'm ready to work
                        </span>
                    </motion.div>

                    <motion.div variants={itemVariant} className="flex flex-wrap items-center gap-4 mb-8">
                        <a href="#contact" className="btn-primary-style">
                            <span>Contact Me</span>
                            <ArrowRight size={15} />
                        </a>
                        <a 
                            href="/CV_Muhammad_Hafiz.pdf" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            download="CV_Muhammad_Hafiz.pdf"
                            className="btn-secondary-style"
                        >
                            <Download size={14} />
                            <span>Download CV</span>
                        </a>
                    </motion.div>

                    <motion.div variants={itemVariant} className="flex flex-col gap-3">
                        <span className="text-xs font-mono tracking-widest text-gray-500">CONNECT WITH ME</span>
                        <div className="flex items-center gap-3">
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl border hover:border-blue-500 hover:text-blue-500 transition-all duration-300" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
                                <LinkedinIcon />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl border hover:border-blue-500 hover:text-blue-500 transition-all duration-300" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
                                <InstagramIcon />
                            </a>
                            <a href="mailto:hm2053276@gmail.com" className="p-2.5 rounded-xl border hover:border-blue-500 hover:text-blue-500 transition-all duration-300" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
                                <Mail size={16} />
                            </a>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Hero Visual Terminal & Avatar */}
                <motion.div 
                    className="lg:col-span-5 flex flex-col items-center justify-center gap-8"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {/* Avatar Display */}
                    <div className="avatar-wrapper">
                        <img 
                            src="/developer_profile.jpg" 
                            alt="Muhammad Hafiz"
                            className="w-full h-full object-cover object-top grayscale contrast-125 brightness-95 hover:grayscale-0 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                    </div>

                    {/* Developer Terminal Box */}
                    <div className="terminal-window w-full max-w-sm">
                        <div className="terminal-header-bar">
                            <div className="flex gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
                                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
                            </div>
                            <span className="text-[10px] font-mono text-gray-500 absolute left-1/2 -translate-x-1/2">
                                hafiz@workspace: ~
                            </span>
                        </div>
                        <div className="p-5 font-mono text-[11px] leading-relaxed text-gray-300">
                            {commandOutput.map((out, idx) => (
                                <div key={idx} className="mb-2">
                                    {out.type === 'command' ? (
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-blue-500">hello </span>
                                            <span>{out.text}</span>
                                        </div>
                                    ) : (
                                        <div className="text-gray-400 pl-4 border-l border-blue-500/20">{out.text}</div>
                                    )}
                                </div>
                            ))}
                            <div className="flex items-center gap-1.5 mt-2 text-white">
                                <span className="text-blue-500 font-bold">hello </span>
                                <span className="border-r border-white pr-1 animate-pulse">{typedText}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
