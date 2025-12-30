import React from 'react';
import { GraduationCap, Book, Laptop, Rocket, ChevronRight } from 'lucide-react';

const years = [
    {
        id: 1,
        label: '1st Year',
        semesters: 'Sem 1 - 2',
        icon: GraduationCap,
        gradient: 'from-violet-500 to-fuchsia-500',
    },
    {
        id: 2,
        label: '2nd Year',
        semesters: 'Sem 3 - 4',
        icon: Book,
        gradient: 'from-cyan-500 to-blue-500',
    },
    {
        id: 3,
        label: '3rd Year',
        semesters: 'Sem 5 - 6',
        icon: Laptop,
        gradient: 'from-emerald-400 to-teal-500',
    },
    {
        id: 4,
        label: 'Final Year',
        semesters: 'Sem 7 - 8',
        icon: Rocket,
        gradient: 'from-orange-400 to-red-500',
    },
];

import { Link } from 'react-router-dom';

const SemesterGrid = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">
                        Browse by <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">Year & Semester</span>
                    </h2>
                    <p className="text-muted text-sm mt-1">Find notes organized for easy access</p>
                </div>
                <Link to="/browse" className="text-sm text-primary hover:text-white transition-colors flex items-center gap-1">
                    View All <ChevronRight size={16} />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {years.map((year) => (
                    <div key={year.id} className="group relative overflow-hidden rounded-2xl bg-card border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer">
                        <div className={`absolute inset-0 bg-gradient-to-br ${year.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                        <div className="p-6">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${year.gradient} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <year.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">{year.label}</h3>
                            <p className="text-sm text-muted mb-4">{year.semesters}</p>

                            <div className="flex items-center justify-between mt-4 md:mt-6">
                                <span className="text-xs font-medium text-muted group-hover:text-white transition-colors">Browse Materials</span>
                                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                                    <ChevronRight size={16} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SemesterGrid;
