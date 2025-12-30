import React, { useState } from 'react';
import { GraduationCap, Book, Laptop, Rocket, FileText, ChevronRight, ArrowLeft } from 'lucide-react';
// Subject Icons
import { Code, Calculator, Atom, Globe, Briefcase, Music, Palette } from 'lucide-react';

const yearData = [
    { id: '1st Year', label: '1st Year', semesters: ['Sem 1', 'Sem 2'], icon: GraduationCap, gradient: 'from-violet-500 to-fuchsia-500' },
    { id: '2nd Year', label: '2nd Year', semesters: ['Sem 3', 'Sem 4'], icon: Book, gradient: 'from-cyan-500 to-blue-500' },
    { id: '3rd Year', label: '3rd Year', semesters: ['Sem 5', 'Sem 6'], icon: Laptop, gradient: 'from-emerald-400 to-teal-500' },
    { id: '4th Year', label: 'Final Year', semesters: ['Sem 7', 'Sem 8'], icon: Rocket, gradient: 'from-orange-400 to-red-500' },
];

const subjects = [
    { name: 'Computer Science', icon: Code, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Mathematics', icon: Calculator, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { name: 'Physics', icon: Atom, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { name: 'Literature', icon: Book, color: 'text-pink-500', bg: 'bg-pink-500/10' },
    { name: 'History', icon: Globe, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'Business', icon: Briefcase, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { name: 'Arts', icon: Palette, color: 'text-red-500', bg: 'bg-red-500/10' },
    { name: 'Music', icon: Music, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
];

const mockNotes = [
    { id: 1, title: 'Calculus I - Limits & Derivatives', author: 'Dr. Smith', size: '2.4 MB' },
    { id: 2, title: 'Intro to Programming (Python)', author: 'Prof. Johnson', size: '1.8 MB' },
    { id: 3, title: 'Mechanics - Newton\'s Laws', author: 'Alex Chen', size: '3.1 MB' },
    { id: 4, title: 'Linear Algebra Notes', author: 'Sarah Lee', size: '4.2 MB' },
];

const Browse = () => {
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);

    const handleYearClick = (year) => {
        if (selectedYear?.id === year.id) {
            // Unclick: Reset everything
            setSelectedYear(null);
            setSelectedSemester(null);
            setSelectedSubject(null);
        } else {
            // Click: Select year, default to first semester
            setSelectedYear(year);
            setSelectedSemester(year.semesters[0]);
            setSelectedSubject(null);
        }
    };

    const handleSubjectClick = (subject) => {
        setSelectedSubject(subject);
    };

    return (
        <div className="space-y-8 min-h-[80vh]">
            <div>
                <h1 className="text-3xl font-bold mb-2">Browse Materials</h1>
                <p className="text-muted">Select your year to get started.</p>
            </div>

            {/* Year Selection Section */}
            <section>
                <div className={`grid gap-4 transition-all duration-500 ${selectedYear ? 'grid-cols-1 max-w-xl mx-auto' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
                    {yearData.map((year) => {
                        // If a year is selected, hide the others
                        if (selectedYear && selectedYear.id !== year.id) return null;

                        return (
                            <button
                                key={year.id}
                                onClick={() => handleYearClick(year)}
                                className={`group relative overflow-hidden rounded-2xl bg-card border text-left transition-all duration-500 w-full ${selectedYear?.id === year.id
                                        ? 'border-primary ring-2 ring-primary/50 shadow-2xl shadow-primary/20 scale-105'
                                        : 'border-zinc-800 hover:border-zinc-700 hover:scale-[1.02]'
                                    }`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${year.gradient} ${selectedYear?.id === year.id ? 'opacity-10' : 'opacity-0 group-hover:opacity-5'} transition-opacity duration-300`}></div>
                                <div className="p-6 flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${year.gradient} flex items-center justify-center text-white shadow-lg transition-transform duration-300 ${!selectedYear ? 'group-hover:scale-110' : ''}`}>
                                        <year.icon size={28} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-white">{year.label}</h3>
                                        <p className="text-sm text-muted">{selectedYear?.id === year.id ? 'Tap to collapse' : 'View Semesters'}</p>
                                    </div>
                                    {selectedYear?.id === year.id ? (
                                        <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center">
                                            <ArrowLeft size={16} className="text-white" />
                                        </div>
                                    ) : (
                                        <ChevronRight size={20} className="text-zinc-500 group-hover:text-white transition-colors" />
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Drill Down Content (Only visible if Year is selected) */}
            {selectedYear && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

                    {/* Semester Selector */}
                    <div className="flex justify-center">
                        <div className="bg-zinc-900/50 border border-zinc-800 p-1 rounded-xl inline-flex">
                            {selectedYear.semesters.map((sem) => (
                                <button
                                    key={sem}
                                    onClick={() => {
                                        setSelectedSemester(sem);
                                        setSelectedSubject(null); // Reset subject on sem change
                                    }}
                                    className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${selectedSemester === sem
                                            ? 'bg-zinc-800 text-white shadow-sm'
                                            : 'text-zinc-400 hover:text-white'
                                        }`}
                                >
                                    {sem}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Subject Selection Grid (Hidden if Subject is Selected) */}
                    {!selectedSubject && (
                        <section>
                            <h3 className="text-lg font-semibold text-white mb-4 text-center">Select Subject</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {subjects.map((subject) => (
                                    <button
                                        key={subject.name}
                                        onClick={() => handleSubjectClick(subject)}
                                        className="bg-card border border-zinc-800 rounded-xl p-4 hover:border-zinc-600 hover:bg-zinc-800/50 transition-all text-left group"
                                    >
                                        <div className={`w-10 h-10 rounded-lg ${subject.bg} ${subject.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                            <subject.icon size={20} />
                                        </div>
                                        <h4 className="font-semibold text-white">{subject.name}</h4>
                                        <p className="text-xs text-muted">12 Notes</p>
                                    </button>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Notes List (Only visible if Subject is Selected) */}
                    {selectedSubject && (
                        <section className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="flex items-center gap-3 mb-6">
                                <button
                                    onClick={() => setSelectedSubject(null)}
                                    className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-muted hover:text-white"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <div>
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        {selectedSubject.name} <span className="text-zinc-600">/</span> {selectedSemester}
                                    </h3>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {mockNotes.map((note) => (
                                    <div key={note.id} className="bg-card border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all group flex items-start gap-4">
                                        <div className="p-3 bg-zinc-900 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                                            <FileText size={24} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-white text-lg truncate group-hover:text-primary transition-colors">{note.title}</h4>
                                            <p className="text-sm text-muted mb-3">{note.author}</p>
                                            <div className="flex items-center gap-3 text-xs text-muted">
                                                <span className="bg-zinc-800 px-2 py-1 rounded text-zinc-300">{note.size}</span>
                                                <span>• 2 days ago</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
};

export default Browse;
