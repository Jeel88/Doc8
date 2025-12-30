import React, { useState } from 'react';
import { UploadCloud, File, X, CheckCircle, AlertCircle } from 'lucide-react';

const UploadPage = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState([
        { name: 'Physics_Unit1_Notes.pdf', size: '2.4 MB', status: 'completed' },
        { name: 'Chemistry_Lab_Report.docx', size: '1.2 MB', status: 'uploading', progress: 65 }
    ]);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        // Logic to handle dropped files would go here
        console.log('Files dropped');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">Upload Notes</h1>
                <p className="text-muted">Share your study materials with the community.</p>
            </div>

            {/* Drag & Drop Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${isDragging
                        ? 'border-primary bg-primary/5 scale-[1.01]'
                        : 'border-zinc-700 hover:border-zinc-600 bg-card'
                    }`}
            >
                <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-6">
                    <UploadCloud size={32} className={isDragging ? 'text-primary' : 'text-muted'} />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                    {isDragging ? 'Drop files here' : 'Drag & drop files here'}
                </h3>
                <p className="text-muted mb-6">or click to browse from your computer</p>
                <button className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors">
                    Browse Files
                </button>
                <p className="text-xs text-muted mt-6">
                    Supports: PDF, DOCX, PPTX, JPG (Max 50MB)
                </p>
            </div>

            {/* Upload List */}
            <div className="bg-card border border-zinc-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
                    <h3 className="font-semibold">Recent Uploads</h3>
                </div>
                <div className="divide-y divide-zinc-800">
                    {files.map((file, index) => (
                        <div key={index} className="p-4 flex items-center justify-between hover:bg-zinc-800/20 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                                    <File size={20} />
                                </div>
                                <div>
                                    <p className="font-medium text-sm text-white">{file.name}</p>
                                    <p className="text-xs text-muted">{file.size}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {file.status === 'uploading' && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-32 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary" style={{ width: `${file.progress}%` }}></div>
                                        </div>
                                        <span className="text-xs text-muted">{file.progress}%</span>
                                    </div>
                                )}
                                {file.status === 'completed' && (
                                    <div className="flex items-center gap-1 text-green-500 text-xs font-medium bg-green-500/10 px-2 py-1 rounded-full">
                                        <CheckCircle size={12} />
                                        <span>Completed</span>
                                    </div>
                                )}

                                <button className="p-1.5 rounded-md hover:bg-red-500/10 hover:text-red-500 text-muted transition-colors">
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UploadPage;
