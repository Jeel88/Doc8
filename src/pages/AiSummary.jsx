import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Brain, Send, Paperclip, FileText, Key, Loader2, Trash2 } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as pdfjsLib from 'pdfjs-dist';

// Use CDN worker for maximum compatibility (avoids local path issues)
// Use CDN worker for maximum compatibility (avoids local path issues)
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.4.530/build/pdf.worker.min.mjs`;

const AiSummary = () => {
    // State for API Key
    const [apiKey, setApiKey] = useState(localStorage.getItem("gemini_api_key") || "");
    const [showKeyInput, setShowKeyInput] = useState(!localStorage.getItem("gemini_api_key"));

    // State for PDF & Chat
    const [fileContext, setFileContext] = useState(null); // { name: string, content: string }
    const [messages, setMessages] = useState([
        { role: 'model', text: "Hello! Upload a PDF or paste text, and I'll answer questions about it." }
    ]);
    const [input, setInput] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const [isExtracting, setIsExtracting] = useState(false);

    const messagesContainerRef = useRef(null);

    // Auto-scroll to bottom of chat (Prevent whole screen jump)
    useEffect(() => {
        if (messagesContainerRef.current) {
            const { scrollHeight, clientHeight } = messagesContainerRef.current;
            messagesContainerRef.current.scrollTo({
                top: scrollHeight - clientHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, isThinking]);

    const saveApiKey = () => {
        const cleanedKey = apiKey.trim();
        if (cleanedKey) {
            localStorage.setItem("gemini_api_key", cleanedKey);
            setApiKey(cleanedKey);
            setShowKeyInput(false);
        }
    };

    const clearApiKey = () => {
        localStorage.removeItem("gemini_api_key");
        setApiKey("");
        setShowKeyInput(true);
    };

    // --- PDF Handling ---
    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const processFile = async (file) => {
        if (file.type !== 'application/pdf') {
            alert("Only PDF files are supported.");
            return;
        }

        setIsExtracting(true);
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

            setFileContext({ name: file.name, content: fullText });
            setMessages(prev => [...prev, { role: 'model', text: `I've read **"${file.name}"**. What would you like to know?` }]);
        } catch (err) {
            console.error(err);
            alert("Failed to read PDF.");
        } finally {
            setIsExtracting(false);
        }
    };

    // --- Chat Logic (Gemini) ---
    const handleSend = async () => {
        if (!input.trim() || !apiKey) return;

        const userMessage = input;
        setInput(""); // Clear input immediately
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setIsThinking(true);

        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            // Construct prompt with context
            let prompt = userMessage;
            if (fileContext) {
                prompt = `Context from document "${fileContext.name}":\n${fileContext.content}\n\nQuestion: ${userMessage}`;
            }

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            setMessages(prev => [...prev, { role: 'model', text: text }]);

        } catch (err) {
            console.error(err);
            const errStr = err.toString();
            if (errStr.includes("403") || errStr.includes("API key")) {
                setMessages(prev => [...prev, { role: 'model', text: "Error: Invalid API Key. Please update it." }]);
                clearApiKey(); // Force re-entry
            } else {
                setMessages(prev => [...prev, { role: 'model', text: "Error: Could not generate response. Please try again." }]);
            }
        } finally {
            setIsThinking(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // --- Legacy Cleanup ---
    const deleteLegacyCache = async () => {
        if (!window.confirm("Clean up old AI model files? This will free up ~1GB of space from the previous version.")) return;

        try {
            const keys = await caches.keys();
            let count = 0;
            for (const key of keys) {
                if (key.includes("webllm") || key.includes("Llama")) {
                    await caches.delete(key);
                    count++;
                }
            }
            if (count > 0) alert(`Freed space! Deleted ${count} cache files.`);
            else alert("No old model files found.");
        } catch (e) {
            console.error(e);
            alert("Error clearing cache.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Sparkles className="text-primary" size={32} />
                        AI Chat Assistant
                    </h1>
                    <p className="text-muted">Chat with your documents using Google Gemini.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={deleteLegacyCache} className="text-xs text-red-500 hover:text-red-400 hover:bg-red-500/10 px-3 py-2 rounded-lg transition-colors flex items-center gap-2">
                        <Trash2 size={14} /> Clear Old Data
                    </button>
                    {!showKeyInput && (
                        <button onClick={clearApiKey} className="text-xs text-zinc-500 hover:text-red-400 flex items-center gap-1">
                            <Key size={12} /> Change Key
                        </button>
                    )}
                </div>
            </div>

            {/* API Key Modal (if needed) */}
            {showKeyInput && (
                <div className="bg-card border border-red-500/20 p-6 rounded-xl mb-6 shadow-lg shadow-red-900/10">
                    <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                        <Key size={20} className="text-primary" /> Setup Gemini API
                    </h2>
                    <p className="text-zinc-400 text-sm mb-4">
                        To use this free feature, you need a Gemini API Key.
                        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-primary hover:underline ml-1">
                            Get one here
                        </a>.
                    </p>
                    <div className="flex gap-2">
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Paste AIzaSy..."
                            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 focus:border-primary focus:outline-none"
                        />
                        <button onClick={saveApiKey} className="bg-primary hover:bg-primary-hover px-6 py-2 rounded-lg font-bold text-white">
                            Save
                        </button>
                    </div>
                </div>
            )}

            {/* Main Chat Area */}
            <div className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col relative">

                {/* File Drop Overlay / Context Indicator */}
                <div className="bg-zinc-900 border-b border-zinc-800 p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {fileContext ? (
                            <span className="flex items-center gap-2 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full border border-primary/20">
                                <FileText size={14} />
                                {fileContext.name}
                                <button onClick={() => setFileContext(null)} className="hover:text-red-400 ml-1"><X size={12} /></button>
                            </span>
                        ) : (
                            <span className="text-xs text-muted flex items-center gap-2">
                                <Brain size={14} /> No document loaded. I'll use general knowledge.
                            </span>
                        )}
                    </div>

                    <label className="cursor-pointer text-xs flex items-center gap-1 hover:text-white text-zinc-400 transition-colors">
                        <Paperclip size={14} />
                        {isExtracting ? "Reading..." : "Upload PDF"}
                        <input type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} disabled={isExtracting} />
                    </label>
                </div>

                {/* Messages List */}
                <div
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
                >
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user'
                                    ? 'bg-primary text-white rounded-br-none'
                                    : 'bg-zinc-800 text-zinc-200 rounded-bl-none border border-zinc-700'
                                }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isThinking && (
                        <div className="flex justify-start">
                            <div className="bg-zinc-800 border border-zinc-700 rounded-2xl rounded-bl-none px-4 py-3">
                                <Loader2 className="animate-spin text-zinc-400" size={18} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-card border-t border-zinc-800">
                    <div className="relative">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={fileContext ? `Ask about "${fileContext.name}"...` : "Ask anything..."}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-4 pr-12 py-3.5 focus:outline-none focus:border-primary text-sm resize-none custom-scrollbar"
                            rows="1"
                            style={{ minHeight: '50px' }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isThinking || !apiKey}
                            className="absolute right-2 top-2 p-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:bg-zinc-700 transition-all"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                    {!apiKey && <p className="text-[10px] text-red-400 mt-2 text-center">Please set your API Key above to chat.</p>}
                </div>
            </div>
        </div>
    );
};

// Helper for X icon
const X = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

export default AiSummary;
