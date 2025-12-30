import React from 'react';
import { Book, Code, Calculator, Atom, Globe, Briefcase, Music, Palette } from 'lucide-react';

const subjects = [
    { name: 'Computer Science', icon: Code, count: '1.2k notes', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Mathematics', icon: Calculator, count: '850 notes', color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { name: 'Physics', icon: Atom, count: '640 notes', color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { name: 'Literature', icon: Book, count: '420 notes', color: 'text-pink-500', bg: 'bg-pink-500/10' },
    { name: 'History', icon: Globe, count: '300 notes', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'Business', icon: Briefcase, count: '550 notes', color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { name: 'Arts', icon: Palette, count: '210 notes', color: 'text-red-500', bg: 'bg-red-500/10' },
    { name: 'Music', icon: Music, count: '150 notes', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
];

const Browse = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">Browse Subjects</h1>
                <p className="text-muted">Explore notes from various departments and fields.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {subjects.map((subject) => (
                    <div key={subject.name} className="bg-card border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 hover:bg-zinc-800/30 transition-all cursor-pointer group">
                        <div className={`w-12 h-12 rounded-lg ${subject.bg} ${subject.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <subject.icon size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">{subject.name}</h3>
                        <p className="text-sm text-muted">{subject.count}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Browse;
