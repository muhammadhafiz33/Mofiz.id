import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Calendar, Send, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';

export default function Contact() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState('idle'); // idle, sending, success, error

    const handleInput = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.message) {
            setStatus('error');
            return;
        }
        
        // Format email content
        const targetEmail = 'hm2053276@gmail.com';
        const emailSubject = encodeURIComponent(`${form.subject ? form.subject : 'Portfolio Contact'} - from ${form.name}`);
        const emailBody = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`);
        
        // Open Gmail compose window directly in a new tab
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${targetEmail}&su=${emailSubject}&body=${emailBody}`, '_blank');
        
        setStatus('success');
        setForm({ name: '', email: '', subject: '', message: '' });
        
        // reset status back to idle after 4s
        setTimeout(() => setStatus('idle'), 4000);
    };

    return (
        <section id="contact" className="py-24 px-6 max-w-6xl mx-auto text-left">
            <motion.div 
                className="sec-header"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <div className="badge-outline mb-4">
                    <MessageSquare size={12} className="text-blue-500" />
                    <span>Contact Info</span>
                </div>
                <h2 className="sec-title">Let's Work Together</h2>
                <p className="sec-subtitle">Currently open for internship, full-time positions, or collaboration opportunities. Submit your info below.</p>
            </motion.div>

            <div className="grid lg:grid-cols-12 gap-10 mt-12 items-stretch">
                
                {/* Left: Contact Info & Calendly */}
                <motion.div 
                    className="lg:col-span-5 flex flex-col gap-6"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="premium-card p-8 flex flex-col justify-between h-full">
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-white mb-2">Connect Directly</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Have an idea, an internship opening, or a web development project? Feel free to drop a message, send an email, or schedule a quick chat with me.
                            </p>

                            <div className="space-y-4 pt-4">
                                <a 
                                    href="mailto:hm2053276@gmail.com" 
                                    className="flex items-center gap-3.5 p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-300 group"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                                        <Mail size={16} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-mono text-gray-500 block">EMAIL ADDRESS</span>
                                        <span className="text-xs font-semibold text-white font-mono">hm2053276@gmail.com</span>
                                    </div>
                                </a>

                                <a 
                                    href="https://calendly.com" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3.5 p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-300 group"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                                        <Calendar size={16} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-mono text-gray-500 block">MEETING SCHEDULE</span>
                                        <span className="text-xs font-semibold text-white">Book a 15-min call</span>
                                    </div>
                                </a>
                            </div>
                        </div>

                        <div className="border-t border-white/5 pt-6 mt-8">
                            <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Response Time</span>
                            <span className="text-xs font-semibold text-white">Usually answers within 24 hours</span>
                        </div>
                    </div>
                </motion.div>

                {/* Right: Contact Form */}
                <motion.div 
                    className="lg:col-span-7"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <form 
                        onSubmit={handleSubmit}
                        className="premium-card p-8 flex flex-col gap-5 h-full justify-between"
                    >
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white mb-2">Send a Message</h3>
                            
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-mono text-gray-500 uppercase">Your Name *</label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        value={form.name} 
                                        onChange={handleInput} 
                                        required 
                                        className="form-input-style"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-mono text-gray-500 uppercase">Your Email *</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        value={form.email} 
                                        onChange={handleInput} 
                                        required 
                                        className="form-input-style"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-mono text-gray-500 uppercase">Subject</label>
                                <input 
                                    type="text" 
                                    name="subject" 
                                    value={form.subject} 
                                    onChange={handleInput} 
                                    className="form-input-style"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-mono text-gray-500 uppercase">Message *</label>
                                <textarea 
                                    name="message" 
                                    value={form.message} 
                                    onChange={handleInput} 
                                    rows={4} 
                                    required 
                                    className="form-input-style resize-none"
                                />
                            </div>
                        </div>

                        {/* Status Message Overlay */}
                        <AnimatePresence mode="wait">
                            {status === 'success' && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex items-center gap-2 text-xs font-semibold text-green-400 bg-green-500/10 p-3 rounded-lg border border-green-500/20"
                                >
                                    <CheckCircle size={14} />
                                    <span>Thank you! Your message was sent successfully.</span>
                                </motion.div>
                            )}
                            {status === 'error' && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex items-center gap-2 text-xs font-semibold text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20"
                                >
                                    <AlertCircle size={14} />
                                    <span>Please fill in all required fields.</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button 
                                type="submit" 
                                disabled={status === 'sending'}
                                className="btn-primary-style w-full md:w-auto flex items-center justify-center gap-2 text-xs py-3 rounded-xl disabled:opacity-50"
                            >
                                <Send size={13} />
                                <span>{status === 'sending' ? 'Sending...' : 'Send Message'}</span>
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </section>
    );
}
