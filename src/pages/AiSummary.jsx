import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Brain, Download, Play, CheckCircle, AlertTriangle, Trash2, FileText, UploadCloud, X } from 'lucide-react';
import { CreateMLCEngine } from "@mlc-ai/web-llm";
import * as pdfjsLib from 'pdfjs-dist';

// 100% RELIABLE FIX: Let Vite bundle the worker file
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// Llama 3.2 1B - Extremely lightweight (approx 800MB)
const MODEL_ID = "Llama-3.2-1B-Instruct-q4f32_1-MLC";

const AiSummary = () => {
    const [engine, setEngine] = useState(null);
    const [progress, setProgress] = useState(null); // { text: string, progress: number }
    const [isLoadingModel, setIsLoadingModel] = useState(false);

    const [inputText, setInputText] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [summary, setSummary] = useState("");
    const [isExtractingText, setIsExtractingText] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    // Auto-scroll to bottom of summary
    const summaryRef = useRef(null);

    const loadModel = async () => {
        setIsLoadingModel(true);
        try {
            const initProgressCallback = (report) => {
                console.log("Loading:", report);
                setProgress(report);
            };

            const selectedEngine = await CreateMLCEngine(
                MODEL_ID,
                { initProgressCallback: initProgressCallback }
            );

            setEngine(selectedEngine);
            setIsLoadingModel(false);
            setProgress(null);
        } catch (err) {
            console.error("Failed to load model:", err);
            // Show the actual error message to the user for better debugging
            alert(`Failed to load AI model: ${err.message || err}. \n\nEnsure you are using a modern browser (Chrome/Edge) with WebGPU support enabled.`);
            setIsLoadingModel(false);
        }
    };

    const deleteModel = async () => {
        if (!window.confirm("Are you sure you want to delete the AI model? This will free up storage space, but you'll need to download it again next time.")) {
            return;
        }

        try {
            // WebLLM stores models in the Cache API
            const cacheKeys = await caches.keys();
            let deletedCount = 0;

            for (const key of cacheKeys) {
                // Look for WebLLM related caches
                if (key.includes("webllm") || key.includes(MODEL_ID) || key.includes("Llama")) {
                    await caches.delete(key);
                    deletedCount++;
                }
            }

            if (deletedCount > 0) {
                alert("Model successfully deleted from browser cache.");
                window.location.reload(); // Reload to reset state fully
            } else {
                alert("No model files found to delete.");
            }
        } catch (err) {
            console.error("Error deleting model:", err);
            alert("Failed to delete model: " + err.message);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    }

    const handleFile = async (file) => {
        if (file.type !== 'application/pdf') {
            alert("Please upload a PDF file.");
            return;
        }

        setIsExtractingText(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

            let fullText = "";
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += pageText + "\n\n";
            }

            // Clean up text slightly
            fullText = fullText.replace(/\s+/g, ' ').trim();
            setInputText(fullText);
        } catch (err) {
            console.error("PDF Parsing Error:", err);
            alert("Failed to extract text from PDF. " + err.message);
        } finally {
            setIsExtractingText(false);
        }
    };

    const handleSummarize = async () => {
        if (!engine || !inputText.trim()) return;

        setIsGenerating(true);
        setSummary("");

        try {
            const messages = [
                { role: "system", content: "You are a helpful study assistant. Summarize the following notes concisely. Highlight key concepts with bullet points. Keep it short." },
                { role: "user", content: inputText }
            ];

            const chunks = await engine.chat.completions.create({
                messages,
                temperature: 0.5,
                stream: true, // Enable streaming
            });

            let fullText = "";
            for await (const chunk of chunks) {
                const delta = chunk.choices[0]?.delta.content || "";
                fullText += delta;
                setSummary(fullText);

                // Auto scroll
                if (summaryRef.current) {
                    summaryRef.current.scrollTop = summaryRef.current.scrollHeight;
                }
            }

        } catch (err) {
            console.error("Generation failed:", err);
            alert("Error during summarization.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                        <Brain className="text-primary" size={32} />
                        AI Assistant (Local)
                    </h1>
                    <p className="text-muted">
                        Runs 100% offline using <span className="text-white font-bold">Llama 3.2 (1B)</span>. Fast & Private.
                    </p>
                </div>

                {/* Delete Model Option */}
                <button
                    onClick={deleteModel}
                    className="text-xs text-red-500 hover:text-red-400 hover:bg-red-500/10 px-3 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                    <Trash2 size={14} /> Delete Model Data
                </button>
            </div>

            {/* Step 1: Model Loading */}
            {!engine && (
                <div className="bg-card border border-zinc-800 rounded-2xl p-8 text-center space-y-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Download size={40} className="text-primary" />
                    </div>

                    <h2 className="text-2xl font-bold text-white">Download AI Model</h2>
                    <p className="text-zinc-400 max-w-lg mx-auto">
                        We've switched to a <strong>super lightweight model (~800MB)</strong>.
                        Download once, use forever offline.
                    </p>

                    {!isLoadingModel ? (
                        <button
                            onClick={loadModel}
                            className="px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all flex items-center gap-2 mx-auto"
                        >
                            <Download size={20} /> Load Llama-3.2-1B
                        </button>
                    ) : (
                        <div className="max-w-md mx-auto space-y-3">
                            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-300"
                                    style={{ width: `${(progress?.progress || 0) * 100}%` }}
                                ></div>
                            </div>
                            <p className="text-sm text-primary font-medium animate-pulse">
                                {progress?.text || "Initializing..."}
                            </p>
                        </div>
                    )}

                    <div className="flex items-center justify-center gap-2 text-xs text-yellow-500/80 bg-yellow-500/10 py-2 rounded-lg max-w-sm mx-auto">
                        <AlertTriangle size={14} />
                        Works best on laptops/desktops with dedicated GPU.
                    </div>
                </div>
            )}

            {/* Step 2: Interaction Area */}
            {engine && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
                    {/* Input Side */}
                    <div className="flex flex-col gap-4">
                        {/* Drag & Drop Zone */}
                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-xl p-4 transition-all text-center cursor-pointer ${dragActive ? 'border-primary bg-primary/10' : 'border-zinc-800 hover:border-zinc-600 bg-zinc-900'
                                }`}
                        >
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                className="hidden"
                                id="pdf-upload"
                            />
                            <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center gap-2">
                                <UploadCloud className={dragActive ? "text-primary" : "text-zinc-500"} size={24} />
                                <span className="text-sm text-zinc-400 font-medium">
                                    {isExtractingText
                                        ? "Extracting text..."
                                        : "Drop PDF here or click to upload"
                                    }
                                </span>
                            </label>
                        </div>

                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex-1 flex flex-col relative">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-zinc-400">Context / Notes:</label>
                                {inputText && (
                                    <button
                                        onClick={() => setInputText("")}
                                        className="text-xs text-zinc-500 hover:text-white flex items-center gap-1"
                                    >
                                        <X size={12} /> Clear
                                    </button>
                                )}
                            </div>
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Paste text or upload a PDF above..."
                                className="flex-1 bg-transparent resize-none focus:outline-none text-zinc-300 leading-relaxed custom-scrollbar text-sm"
                            />
                        </div>
                        <button
                            onClick={handleSummarize}
                            disabled={isGenerating || !inputText.trim()}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${isGenerating || !inputText.trim()
                                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                : 'bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20'
                                }`}
                        >
                            {isGenerating ? (
                                <>
                                    <Sparkles className="animate-spin" /> Thinking...
                                </>
                            ) : (
                                <>
                                    <Play fill="currentColor" /> Generate Summary
                                </>
                            )}
                        </button>
                    </div>

                    {/* Output Side */}
                    <div className="bg-card border border-zinc-800 rounded-xl p-6 flex flex-col relative overflow-hidden">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Sparkles size={18} className="text-blue-400" /> AI Output
                        </h3>

                        <div ref={summaryRef} className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                            {summary ? (
                                <div className="prose prose-invert max-w-none text-zinc-300 leading-relaxed whitespace-pre-wrap">
                                    {summary}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-zinc-600 opacity-50">
                                    <Brain size={48} className="mb-4" />
                                    <p>Ready to generate unlimited summaries.</p>
                                </div>
                            )}
                        </div>

                        {/* Status Indicator */}
                        <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            MODEL READY
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AiSummary;
