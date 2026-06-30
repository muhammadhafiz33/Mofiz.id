import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Journey from './components/Journey';
import Education from './components/Education';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Certifications from './components/Certifications';
import Experience from './components/Experience';
import TechStack from './components/TechStack';
import Statistics from './components/Statistics';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';

import './index.css';

// Splash Loader Screen
function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 15) + 5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 500); // Wait a bit after hitting 100%
      }
      setProgress(currentProgress);
    }, 120);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="loader-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      <div className="flex flex-col items-center justify-center">
        {/* Animated Rings */}
        <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
          {/* Outer rotating dashed ring */}
          <motion.div 
            className="absolute inset-0 rounded-full border-t-2 border-r-2 border-blue-500/30"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          />
          {/* Inner rotating solid ring */}
          <motion.div 
            className="absolute inset-2 rounded-full border-b-2 border-l-2 border-blue-400"
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          />
          {/* Center Logo */}
          <motion.div 
            className="w-12 h-12 flex items-center justify-center overflow-hidden z-10"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.1, 1], opacity: 1 }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <img src="/logo.png" alt="Loading Logo" className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
          </motion.div>
        </div>

        {/* Loading Text */}
        <div className="flex flex-col items-center gap-2">
            <motion.div 
                className="text-sm font-mono tracking-[0.2em] text-gray-400"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
            >
                SYSTEM BOOTING
            </motion.div>
            
            {/* Progress Bar */}
            <div className="w-48 h-1 bg-white/5 rounded-full mt-4 overflow-hidden relative">
                <motion.div 
                    className="absolute top-0 left-0 h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut", duration: 0.2 }}
                />
            </div>
            <div className="mt-2 text-xs font-mono text-blue-500 font-bold">
                {progress}%
            </div>
        </div>
      </div>
    </motion.div>
  );
}

// Cursor Glow Overlay
function CursorGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setOpacity(1);
    };

    const handleMouseLeave = () => {
      setOpacity(0);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      className="cursor-glow-spotlight"
      style={{
        '--x': `${position.x}px`,
        '--y': `${position.y}px`,
        opacity: opacity,
      }}
    />
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Track hover spotlight variables on premium-cards
  useEffect(() => {
    const updateCardMouseCoordinates = (e) => {
      const cards = document.querySelectorAll('.premium-card');
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    };
    
    window.addEventListener('mousemove', updateCardMouseCoordinates);
    return () => window.removeEventListener('mousemove', updateCardMouseCoordinates);
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Scroll Progress Bar */}
          <motion.div className="scroll-progress-bar" style={{ scaleX }} />

          {/* Custom Mouse Spotlight Glow */}
          <CursorGlow />

          {/* Decorative Grids and Parallax blur points */}
          <div className="bg-grid-overlay"></div>
          <div className="floating-blur-1"></div>
          <div className="floating-blur-2"></div>

          {/* Navigation Bar */}
          <Navbar />

          <main className="relative z-10 w-full">
            {/* 1. Hero */}
            <Hero />
            
            {/* 2. About Me */}
            <About />

            {/* 3. Journey Timeline */}
            <Journey />

            {/* 4. Education */}
            <Education />

            {/* 5. Technical Skills */}
            <Skills />

            {/* 6. Featured Projects */}
            <Projects />

            {/* 7. Certifications */}
            <Certifications />

            {/* 8. Experience */}
            <Experience />


            {/* 10. Tech Stack Icons Wall */}
            <TechStack />

            {/* 11. Statistics Counter Section */}
            <Statistics />

            {/* 14. Services Offered */}
            <Services />


            {/* 16. Contact Form & Calendly CTA */}
            <Contact />
          </main>

          {/* 17. Footer */}
          <Footer />
        </motion.div>
      )}
    </>
  );
}
