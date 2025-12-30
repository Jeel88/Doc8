import React, { useState } from 'react';
import { UploadCloud, FileText, Sparkles, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AiSummary = () => {
    const { user } = useAuth();
    const [file, setFile] = useState(null);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [summary, setSummary] = useState(null);

    const handleFileDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type === 'application/pdf') {
            setFile(droppedFile);
            setSummary(null);
        }
    };

    const handleSummarize = () => {
        if (!user) {
            alert("Please sign in to use AI Summarizer!");
            return;
        }

        if (!file) return;
        setIsSummarizing(true);
        // Simulate API call
        setTimeout(() => {
            setIsSummarizing(false);
            setSummary("This document covers the fundamental principles of Thermodynamics, specifically focusing on the Second Law. It explains entropy as a measure of disorder and discusses heat transfer mechanisms: conduction, convection, and radiation. Key formulas for Carnot efficiency are derived, and practical applications in heat engines are explored.");
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    <Sparkles className="text-primary" />
                    AI Summarizer
                </h1>
                <p className="text-muted">Upload a PDF to generate a concise summary instantly.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upload Section */}
                <div className="space-y-6">
                    <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleFileDrop}
                        className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all ${file ? 'border-primary bg-primary/5' : 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900'
                            }`}
                    >
                        {file ? (
                            <>
                                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4">
                                    <FileText size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1">{file.name}</h3>
                                <p className="text-sm text-zinc-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                <button
                                    onClick={() => setFile(null)}
                                    className="mt-4 text-sm text-red-400 hover:text-red-300 hover:underline"
                                >
                                    Remove
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 mb-4">
                                    <UploadCloud size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Drop your PDF here</h3>
                                <p className="text-sm text-zinc-500 mb-4 max-w-xs">
                                    or click to browse from your computer. Max size 10MB.
                                </p>
                                <button className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors">
                                    Browse Files
                                </button>
                            </>
                        )}
                    </div>

                    <button
                        onClick={handleSummarize}
                        disabled={!file || isSummarizing}
                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${!file
                            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                            : isSummarizing
                                ? 'bg-primary/50 text-white cursor-wait'
                                : 'bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20'
                            }`}
                    >
                        {isSummarizing ? (
                            <>
                                <span className="animate-spin">⏳</span> Summarizing...
                            </>
                        ) : (
                            <>
                                Generate Summary
                            </>
                        )}
                    </button>
                </div>

                {/* Result Section */}
                <div className="bg-card border border-zinc-800 rounded-2xl p-6 min-h-[400px] flex flex-col">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        Summary
                        {summary && <CheckCircle size={18} className="text-green-500" />}
                    </h2>

                    {summary ? (
                        <div className="prose prose-invert max-w-none">
                            <p className="leading-relaxed text-zinc-300">
                                {summary}
                            </p>
                            <div className="mt-8 pt-6 border-t border-zinc-800">
                                <h4 className="font-semibold text-white mb-2">Key Concepts detected:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {['Thermodynamics', 'Entropy', 'Heat Transfer', 'Carnot Efficiency'].map(tag => (
                                        <span key={tag} className="text-xs bg-violet-500/10 text-violet-300 border border-violet-500/20 px-2 py-1 rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                            <Sparkles size={48} className="text-zinc-600 mb-4" />
                            <p className="text-zinc-500">
                                Summary will appear here after analysis.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AiSummary;
