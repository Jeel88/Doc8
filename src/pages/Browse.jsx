import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { GraduationCap, Book, Laptop, Rocket, FileText, ChevronRight, ArrowLeft, Upload, Trash2, Plus, Loader2 } from 'lucide-react';
// Subject Icons
import { Code, Calculator, Atom, Globe, Briefcase, Music, Palette } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

const yearData = [
    { id: '1st Year', label: '1st Year', semesters: ['Sem 1', 'Sem 2'], icon: GraduationCap, gradient: 'from-violet-500 to-fuchsia-500' },
    { id: '2nd Year', label: '2nd Year', semesters: ['Sem 3', 'Sem 4'], icon: Book, gradient: 'from-cyan-500 to-blue-500' },
    { id: '3rd Year', label: '3rd Year', semesters: ['Sem 5', 'Sem 6'], icon: Laptop, gradient: 'from-emerald-400 to-teal-500' },
    { id: '4th Year', label: 'Final Year', semesters: ['Sem 7', 'Sem 8'], icon: Rocket, gradient: 'from-orange-400 to-red-500' },
];

const initialSubjects = [
    { id: 'cs', name: 'Computer Science', icon: Code, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 'math', name: 'Mathematics', icon: Calculator, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { id: 'phy', name: 'Physics', icon: Atom, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { id: 'lit', name: 'Literature', icon: Book, color: 'text-pink-500', bg: 'bg-pink-500/10' },
    { id: 'hist', name: 'History', icon: Globe, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { id: 'bus', name: 'Business', icon: Briefcase, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { id: 'arts', name: 'Arts', icon: Palette, color: 'text-red-500', bg: 'bg-red-500/10' },
    { id: 'mus', name: 'Music', icon: Music, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
];

const Browse = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [subjectList, setSubjectList] = useState(initialSubjects);

    // Upload & Notes State
    const [notesList, setNotesList] = useState([]);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [newNote, setNewNote] = useState({ title: '', author: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // Fetch Notes from Supabase
    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) console.error('Error fetching notes:', error);
        else setNotesList(data || []);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile || !user) return;

        setIsUploading(true);
        try {
            // 1. Upload to Cloudinary
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`,
                { method: 'POST', body: formData }
            );
            const data = await response.json();

            if (data.secure_url) {
                // 2. Insert into Supabase
                const { error } = await supabase.from('notes').insert([
                    {
                        title: newNote.title,
                        author: newNote.author,
                        file_url: data.secure_url,
                        file_size: (data.bytes / 1024 / 1024).toFixed(2) + ' MB',
                        subject_id: selectedSubject?.id || null, // Handle general uploads if any
                        user_id: user.id
                    }
                ]);

                if (error) throw error;

                // Reset and Refresh
                setNewNote({ title: '', author: '' });
                setSelectedFile(null);
                setIsUploadModalOpen(false);
                fetchNotes(); // Refresh list
                alert('Note uploaded successfully!');
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed: ' + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    // Handle Search from Header
    useEffect(() => {
        if (location.state?.searchQuery) {
            setSearchQuery(location.state.searchQuery);
            const query = location.state.searchQuery.toLowerCase();
            const results = notesList.filter(note =>
                note.title.toLowerCase().includes(query) ||
                note.author.toLowerCase().includes(query) ||
                (note.subject_id && subjectList.find(s => s.id === note.subject_id)?.name.toLowerCase().includes(query))
            );
            setSearchResults(results);
            // Clear other selections
            setSelectedYear(null);
            setSelectedSubject(null);
        } else {
            setSearchQuery('');
        }
    }, [location.state, notesList]);

    // Handle Redirection from Home (Year Selection)
    useEffect(() => {
        if (location.state?.selectedYearId && !selectedYear && !searchQuery) { // Only if not searching
            const yearToSelect = yearData.find(y => y.id === location.state.selectedYearId);
            if (yearToSelect) {
                setSelectedYear(yearToSelect);
                setSelectedSemester(yearToSelect.semesters[0]);
            }
        }
    }, [location.state, searchQuery]); // Add searchQuery dependency

    const handleYearClick = (year) => {
        if (selectedYear?.id === year.id) {
            setSelectedYear(null);
            setSelectedSemester(null);
            setSelectedSubject(null);
        } else {
            setSelectedYear(year);
            setSelectedSemester(year.semesters[0]);
            setSelectedSubject(null);
        }
    };

    return (
        <div className="space-y-8 min-h-[80vh]">
            {/* Header Section */}
            <div>
                <h1 className="text-3xl font-bold mb-2">Browse Materials</h1>
                <p className="text-muted">
                    {searchQuery ? `Search results for "${searchQuery}"` : "Select your year to get started."}
                </p>
                {searchQuery && (
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            // Clear location state to prevent re-triggering
                            window.history.replaceState({}, document.title);
                        }}
                        className="text-primary hover:underline text-sm mt-2 flex items-center gap-1"
                    >
                        <ArrowLeft size={14} /> Back to Browse
                    </button>
                )}
            </div>

            {/* Search Results View */}
            {searchQuery ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {searchResults.length === 0 ? (
                        <div className="text-center py-12 text-muted">
                            <FileText size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No results found for "{searchQuery}".</p>
                            <button onClick={() => setSearchQuery('')} className="text-primary hover:underline mt-2">View all subjects</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {searchResults.map((note) => (
                                <div key={note.id} className="bg-card border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all group flex items-start gap-4">
                                    <div className="p-3 bg-zinc-900 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                                        <FileText size={24} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-white text-lg truncate group-hover:text-primary transition-colors">{note.title}</h4>
                                        <p className="text-sm text-muted mb-3">{note.author}</p>
                                        <div className="flex items-center gap-3 text-xs text-muted">
                                            <span className="bg-zinc-800 px-2 py-1 rounded text-zinc-300">{note.size}</span>
                                            <span>• {note.time || 'Just now'}</span>
                                            {/* Show subject name if in search */}
                                            <span className="text-zinc-500">• {subjectList.find(s => s.id === note.subjectId)?.name || 'General'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {/* Year Selection Section */}
                    <section>
                        <div className={`grid gap-4 transition-all duration-500 ${selectedYear ? 'grid-cols-1 max-w-xl mx-auto' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
                            {yearData.map((year) => {
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

                    {/* Drill Down Content */}
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
                                                setSelectedSubject(null);
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

                            {/* Subject Selection Grid */}
                            {!selectedSubject && (
                                <section>
                                    <h3 className="text-lg font-semibold text-white mb-4 text-center">Select Subject for {selectedSemester}</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {subjectList.map((subject) => (
                                            <div
                                                key={subject.id}
                                                onClick={() => setSelectedSubject(subject)}
                                                className="relative bg-card border border-zinc-800 rounded-xl p-4 hover:border-zinc-600 hover:bg-zinc-800/50 transition-all text-left group cursor-pointer"
                                            >
                                                <div className={`w-10 h-10 rounded-lg ${subject.bg} ${subject.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                                    <subject.icon size={20} />
                                                </div>
                                                <h4 className="font-semibold text-white">{subject.name}</h4>
                                                <p className="text-xs text-muted">12 Notes</p>
                                            </div>
                                        ))}

                                        {/* Add Subject Placeholder */}
                                        <button className="bg-dashed border-2 border-zinc-800 rounded-xl p-4 flex flex-col items-center justify-center text-zinc-500 hover:border-zinc-600 hover:text-zinc-400 gap-2 transition-all">
                                            <Plus size={24} />
                                            <span className="text-sm font-medium">Add Subject</span>
                                        </button>
                                    </div>
                                </section>
                            )}

                            {/* Notes List */}
                            {selectedSubject && (
                                <section>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
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

                                        <button
                                            onClick={() => {
                                                if (!user) {
                                                    alert("Please sign in to upload notes!");
                                                    return;
                                                }
                                                setIsUploadModalOpen(true);
                                            }}
                                            className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
                                        >
                                            <Upload size={16} />
                                            Upload Note
                                        </button>
                                    </div>

                                    {/* Notes Grid */}
                                    {notesList.filter(n => n.subject_id === selectedSubject.id || !n.subject_id).length === 0 ? (
                                        <div className="text-center py-12 text-muted">
                                            <FileText size={48} className="mx-auto mb-4 opacity-20" />
                                            <p>No notes uploaded for this subject yet.</p>
                                            <button onClick={() => setIsUploadModalOpen(true)} className="text-primary hover:underline mt-2">Be the first to upload!</button>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {notesList.filter(n => n.subject_id === selectedSubject.id || !n.subject_id).map((note) => (
                                                <div key={note.id} className="bg-card border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all group flex items-start gap-4">
                                                    <div className="p-3 bg-zinc-900 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                                                        <FileText size={24} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        {/* Open File on Click */}
                                                        <a href={note.file_url} target="_blank" rel="noopener noreferrer" className="block group-hover:underline">
                                                            <h4 className="font-semibold text-white text-lg truncate group-hover:text-primary transition-colors">{note.title}</h4>
                                                        </a>
                                                        <p className="text-sm text-muted mb-3">{note.author}</p>
                                                        <div className="flex items-center gap-3 text-xs text-muted">
                                                            <span className="bg-zinc-800 px-2 py-1 rounded text-zinc-300">{note.file_size || note.size}</span>
                                                            <span>• {new Date(note.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>
                            )}
                        </div>
                    )}

                    {/* Upload Modal */}
                    {isUploadModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                            <div className="bg-card border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-white">Upload Note</h2>
                                    <button onClick={() => setIsUploadModalOpen(false)} className="text-zinc-500 hover:text-white">
                                        <Plus size={24} className="rotate-45" />
                                    </button>
                                </div>

                                <form onSubmit={handleUploadSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-1">Title</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Calculus Chapter 1"
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                            value={newNote.title}
                                            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-1">Author</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Your Name or Professor"
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                            value={newNote.author}
                                            onChange={(e) => setNewNote({ ...newNote, author: e.target.value })}
                                        />
                                    </div>

                                    <div className="border-2 border-dashed border-zinc-800 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-zinc-900/50 hover:border-zinc-600 transition-all relative">
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={handleFileChange}
                                            required
                                        />
                                        <Upload size={24} className={`mb-2 ${selectedFile ? 'text-primary' : 'text-zinc-500'}`} />
                                        <p className="text-sm text-zinc-400">
                                            {selectedFile ? selectedFile.name : "Click to attach PDF or Doc"}
                                        </p>
                                        <p className="text-xs text-zinc-600 mt-1">(Max 10MB)</p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isUploading}
                                        className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isUploading ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" /> Uploading...
                                            </>
                                        ) : (
                                            "Upload Note"
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Browse;
