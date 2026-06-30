import { motion } from 'framer-motion';
import { Star, GitFork, Flame, Calendar } from 'lucide-react';
import { useState } from 'react';

const GithubIcon = ({ size = 16, className = "" }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
);

// Mock dataset for contribution graph: 52 weeks * 7 days
// We will generate a mini subset representing the last 12 weeks to fit cleanly in a card layout
const generateMockContributions = () => {
    const data = [];
    for (let w = 0; w < 24; w++) {
        const week = [];
        for (let d = 0; d < 7; d++) {
            // Random level biased towards light activity
            const rand = Math.random();
            let level = 0;
            if (rand > 0.85) level = 4;
            else if (rand > 0.65) level = 3;
            else if (rand > 0.4) level = 2;
            else if (rand > 0.2) level = 1;
            
            week.push({
                day: d,
                level: level,
                count: level * Math.floor(Math.random() * 3 + 1)
            });
        }
        data.push(week);
    }
    return data;
};

const contributionGraph = generateMockContributions();

const recentRepos = [
    {
        name: "internship-journal-laravel",
        desc: "API architecture and schema setup for tracking weekly journal submissions and administrative reviews.",
        stars: 12,
        forks: 3,
        lang: "PHP"
    },
    {
        name: "crop-disease-detector-flutter",
        desc: "Offline inference app executing CNN models on leaf pictures using TFLite. Incorporates async local database.",
        stars: 28,
        forks: 8,
        lang: "Dart"
    }
];

const languages = [
    { name: "JavaScript", percentage: 42, color: "bg-yellow-500" },
    { name: "TypeScript", percentage: 28, color: "bg-blue-500" },
    { name: "PHP", percentage: 18, color: "bg-purple-500" },
    { name: "Python", percentage: 12, color: "bg-cyan-500" }
];

export default function GitHubStats() {
    const [hoveredCell, setHoveredCell] = useState(null);

    return (
        <section id="github" className="py-24 px-6 max-w-6xl mx-auto text-left">
            <motion.div 
                className="sec-header"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <div className="badge-outline mb-4">
                    <GithubIcon size={12} className="text-blue-500" />
                    <span>Open Source Analytics</span>
                </div>
                <h2 className="sec-title">GitHub Integration</h2>
                <p className="sec-subtitle">Overview of open source contribution patterns, tech languages, and active repositories.</p>
            </motion.div>

            <div className="grid lg:grid-cols-12 gap-8 mt-12 items-stretch">
                
                {/* Left: Contributions Grid Calendar */}
                <motion.div 
                    className="lg:col-span-8 premium-card p-6 flex flex-col justify-between"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-blue-500" />
                                <h3 className="font-semibold text-white text-sm">Contribution Heatmap</h3>
                            </div>
                            <span className="text-[10px] font-mono text-gray-500">LAST 24 WEEKS</span>
                        </div>

                        {/* Graph Cells */}
                        <div className="flex gap-[3px] overflow-x-auto pb-4 justify-start">
                            {contributionGraph.map((week, wIdx) => (
                                <div key={wIdx} className="flex flex-col gap-[3px]">
                                    {week.map((day, dIdx) => {
                                        // Colors mapping matching blue accent palette
                                        const bgClasses = [
                                            'bg-slate-900 border border-white/5',
                                            'bg-blue-900/30 border border-blue-900/10',
                                            'bg-blue-800/50 border border-blue-800/10',
                                            'bg-blue-600/70 border border-blue-600/10',
                                            'bg-blue-500 border border-blue-500/10'
                                        ];
                                        return (
                                            <div 
                                                key={dIdx}
                                                className={`w-3 h-3 rounded-[2px] transition-transform hover:scale-125 cursor-pointer ${bgClasses[day.level]}`}
                                                onMouseEnter={() => setHoveredCell({ week: wIdx, day: dIdx, count: day.count })}
                                                onMouseLeave={() => setHoveredCell(null)}
                                            />
                                        );
                                    })}
                                </div>
                            ))}
                        </div>

                        {/* Interactive Tooltip area */}
                        <div className="h-6 font-mono text-[10px] text-gray-500 flex items-center">
                            {hoveredCell ? (
                                <span className="text-blue-400">
                                    {hoveredCell.count === 0 ? 'No' : hoveredCell.count} contributions on day {hoveredCell.day + 1}, week {hoveredCell.week + 1}
                                </span>
                            ) : (
                                <span>Hover over boxes to view contributions</span>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-white/5 pt-4 mt-6 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div>
                                <span className="text-[10px] font-mono text-gray-500 uppercase block">Total contributions</span>
                                <span className="text-sm font-bold text-white font-mono">1,842 commits</span>
                            </div>
                            <div>
                                <span className="text-[10px] font-mono text-gray-500 uppercase block">Average Level</span>
                                <span className="text-sm font-bold text-white font-mono">High Quality</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-[9px] font-mono text-gray-500 mr-1.5">Less</span>
                            <span className="w-2.5 h-2.5 rounded-[2px] bg-slate-900 border border-white/5" />
                            <span className="w-2.5 h-2.5 rounded-[2px] bg-blue-900/30" />
                            <span className="w-2.5 h-2.5 rounded-[2px] bg-blue-800/50" />
                            <span className="w-2.5 h-2.5 rounded-[2px] bg-blue-600/70" />
                            <span className="w-2.5 h-2.5 rounded-[2px] bg-blue-500" />
                            <span className="text-[9px] font-mono text-gray-500 ml-1.5">More</span>
                        </div>
                    </div>
                </motion.div>

                {/* Right: Language stats & streaks */}
                <motion.div 
                    className="lg:col-span-4 flex flex-col gap-6"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Streaks & overall grade */}
                    <div className="premium-card p-6 flex flex-col justify-between flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Flame size={16} className="text-orange-500" />
                                <h3 className="font-semibold text-white text-sm">Commit Streak</h3>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <span className="text-[10px] font-mono text-gray-500 uppercase block">Current streak</span>
                                <span className="text-2xl font-bold text-white font-mono">18 days</span>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-mono text-gray-500 uppercase block">Longest streak</span>
                                <span className="text-2xl font-bold text-white font-mono">84 days</span>
                            </div>
                        </div>

                        {/* Languages breakdown */}
                        <div className="border-t border-white/5 pt-4 space-y-3">
                            <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">LANGUAGES INDEX</h4>
                            <div className="space-y-2">
                                {languages.map(lang => (
                                    <div key={lang.name} className="space-y-1">
                                        <div className="flex justify-between text-[11px]">
                                            <span className="text-gray-400 font-semibold">{lang.name}</span>
                                            <span className="text-gray-500 font-mono">{lang.percentage}%</span>
                                        </div>
                                        <div className="w-full h-[4px] rounded-full bg-slate-800 overflow-hidden">
                                            <div className={`h-full ${lang.color}`} style={{ width: `${lang.percentage}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Repositories Row */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
                {recentRepos.map((repo, idx) => (
                    <motion.div 
                        key={idx}
                        className="premium-card p-6 text-left flex flex-col justify-between"
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                    >
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <GithubIcon size={14} className="text-gray-500" />
                                <h4 className="text-sm font-bold text-white hover:text-blue-500 transition-colors cursor-pointer font-mono">{repo.name}</h4>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed mb-6">{repo.desc}</p>
                        </div>
                        <div className="flex items-center justify-between border-t border-white/5 pt-4">
                            <div className="flex items-center gap-4 text-[10px] font-mono text-gray-500">
                                <span className="flex items-center gap-1.5"><Star size={12} /> {repo.stars} stars</span>
                                <span className="flex items-center gap-1.5"><GitFork size={12} /> {repo.forks} forks</span>
                            </div>
                            <span className="text-[10px] font-mono font-semibold text-blue-500 px-2 py-0.5 rounded bg-blue-500/5 border border-blue-500/10">{repo.lang}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
