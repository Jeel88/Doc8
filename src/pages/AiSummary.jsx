import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Brain, Download, Send, Trash2, FileText, UploadCloud, X, Loader2, AlertTriangle, Paperclip } from 'lucide-react';
import { CreateMLCEngine } from "@mlc-ai/web-llm";
import * as pdfjsLib from 'pdfjs-dist';

// 100% RELIABLE FIX: Let Vite bundle the worker file
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// Llama 3.2 1B - Extremely lightweight
const MODEL_ID = "Llama-3.2-1B-Instruct-q4f32_1-MLC";

const AiSummary = () => {
    // Engine State
    const [engine, setEngine] = useState(null);
    const [progress, setProgress] = useState(null);
    const [isLoadingModel, setIsLoadingModel] = useState(false);

    // Chat State
    const [messages, setMessages] = useState([
        { role: 'model', text: "Model loaded! Upload a PDF or paste text, then ask me anything." }
    ]);
    const [input, setInput] = useState("");
    const [contextText, setContextText] = useState(""); // The PDF content
    const [isGenerating, setIsGenerating] = useState(false);
    const [isExtracting, setIsExtracting] = useState(false);

    // UI Refs
    const messagesEndRef = useRef(null);

    // Initial Load Check
    useEffect(() => {
        // We could auto-load here if we wanted, but user wanted manual control
    }, []);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isGenerating]);

    // --- Engine Logic ---
    const loadModel = async () => {
        setIsLoadingModel(true);
        try {
            const selectedEngine = await CreateMLCEngine(
                MODEL_ID,
                {
                    initProgressCallback: (report) => setProgress(report),
                    logLevel: "INFO"
                }
            );
            setEngine(selectedEngine);
            setIsLoadingModel(false);
        } catch (err) {
            console.error(err);
            alert(`Failed to load model: ${err.message}. Check GPU/Browser support.`);
            setIsLoadingModel(false);
        }
    };

    const deleteModel = async () => {
        if (!window.confirm("Delete local model files?")) return;
        try {
            const keys = await caches.keys();
            for (const key of keys) {
                if (key.includes("webllm") || key.includes("Llama")) await caches.delete(key);
            }
            window.location.reload();
        } catch (e) { alert("Error deleting model"); }
    };

    // --- PDF Logic ---
    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file || file.type !== 'application/pdf') return;

        setIsExtracting(true);
        try {
            const buf = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
            let fullText = "";
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                fullText += textContent.items.map(item => item.str).join(' ') + "\n";
            }

            setContextText(fullText);
            setMessages(prev => [...prev, { role: 'model', text: `I've read **"${file.name}"**. Ask me questions about it!` }]);
        } catch (err) {
            console.error(err);
            alert("Failed to extract PDF text.");
        } finally {
            setIsExtracting(false);
        }
    };

    // --- Chat Logic ---
    const handleSend = async () => {
        if (!input.trim() || !engine || isGenerating) return;

        const userMsg = input;
        setInput("");
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsGenerating(true);

        try {
            // Construct the prompt: System + Context + User Question
            // Llama 3 format is handled by WebLLM engine usually, but we inject context manually for "Chat with PDF"
            let finalMessages = [
                { role: "system", content: "You are a helpful assistant. Use the provided Context to answer the User Question. If the answer is not in the context, say so." },
            ];

            // If we have context, inject it. 
            // Note: For long conversation history, we rely on the engine's internal state OR we send context each time.
            // With WebLLM's `chat.completions.create`, it's stateless unless we pass previous history.
            // But simple approach: Send Context + Question as one big user message (RAG style).

            const promptContent = contextText
                ? `Context:\n${contextText}\n\nQuestion: ${userMsg}`
                : userMsg;

            // We do NOT send the full 'messages' array history to save context window tokens
            // We just send this turn. (Or we could send last 2-3 turns).
            // Let's send a fresh request each time to ensure Context fits.
            // TODO: Ideally we'd maintain history, but 1B model has small context.

            const requestMessages = [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: promptContent }
            ];

            const chunks = await engine.chat.completions.create({
                messages: requestMessages,
                temperature: 0.5,
                stream: true
            });

            // Stream response
            let fullResponse = "";
            setMessages(prev => [...prev, { role: 'model', text: "" }]); // Add placeholder

            for await (const chunk of chunks) {
                const delta = chunk.choices[0]?.delta.content || "";
                fullResponse += delta;

                // Update last message
                setMessages(prev => {
                    const newMsgs = [...prev];
                    newMsgs[newMsgs.length - 1].text = fullResponse;
                    return newMsgs;
                });
            }

        } catch (err) {
            setMessages(prev => [...prev, { role: 'model', text: "Error generating response." }]);
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col">
            {/* 1. Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Brain className="text-primary" size={28} />
                        Local AI Chat
                    </h1>
                    <p className="text-xs text-muted">Runs offline on Llama 3.2 (1B).</p>
                </div>
                {engine && (
                    <button onClick={deleteModel} className="text-xs text-red-500 hover:bg-red-500/10 px-3 py-1.5 rounded-lg flex items-center gap-1">
                        <Trash2 size={12} /> Delete Model
                    </button>
                )}
            </div>

            {/* 2. Model Loader (Visible if not loaded) */}
            {!engine && (
                <div className="flex-1 flex flex-col items-center justify-center bg-card border border-zinc-800 rounded-2xl p-8 text-center space-y-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        <Download size={32} className="text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Download Model</h2>
                        <p className="text-zinc-400 text-sm mt-2 max-w-sm mx-auto">
                            ~800MB download. Required for offline chat.
                        </p>
                    </div>

                    {!isLoadingModel ? (
                        <button onClick={loadModel} className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20">
                            Load Llama-3.2-1B
                        </button>
                    ) : (
                        <div className="w-full max-w-xs space-y-2">
                            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-primary transition-all duration-300" style={{ width: `${(progress?.progress || 0) * 100}%` }}></div>
                            </div>
                            <p className="text-xs text-primary font-mono">{progress?.text || "Initializing..."}</p>
                        </div>
                    )}
                </div>
            )}

            {/* 3. Chat Interface (Visible if engine loaded) */}
            {engine && (
                <div className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col relative">

                    {/* Context Bar */}
                    <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-2 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-zinc-400">
                            {contextText ? (
                                <span className="text-green-400 flex items-center gap-1">
                                    <FileText size={12} /> Document Loaded
                                    <button onClick={() => setContextText("")} className="ml-2 hover:text-white"><X size={10} /></button>
                                </span>
                            ) : "No document loaded."}
                        </div>
                        <label className="cursor-pointer hover:text-primary flex items-center gap-1 transition-colors">
                            <Paperclip size={12} /> {isExtracting ? "Reading..." : "Upload PDF"}
                            <input type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
                        </label>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-zinc-800 text-zinc-200 rounded-bl-none'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 bg-card border-t border-zinc-800">
                        <div className="relative flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask a question..."
                                disabled={isGenerating}
                                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-sm"
                            />
                            <button
                                onClick={handleSend}
                                disabled={isGenerating || !input.trim()}
                                className="p-3 bg-primary hover:bg-primary-hover text-white rounded-xl disabled:opacity-50 disabled:bg-zinc-800"
                            >
                                {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AiSummary;
