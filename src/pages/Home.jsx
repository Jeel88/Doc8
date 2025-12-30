import React from 'react';
import NoticeBoard from '../components/NoticeBoard';
import SemesterGrid from '../components/SemesterGrid';
import { UploadCloud, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="space-y-12 pb-12 ">
            {/* Hero Section */}
            <div className="relative py-12 md:py-24">
                {/* Background Gradients */}
                <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-violet-600/10 rounded-full blur-[80px] md:blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-cyan-600/10 rounded-full blur-[60px] md:blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                <div className="relative z-10 px-4 md:px-12 flex flex-col md:flex-row items-center justify-center mx-auto max-w-6xl gap-12 text-center md:text-left">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 text-white leading-[1.1]">
                            Share Notes. <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Learn</span> <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-400">Together.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted mb-10 leading-relaxed max-w-lg mx-auto md:mx-0">
                            The ultimate platform for college students. Upload, discover, and ace your exams with Doc<span className="text-cyan-500 font-bold">8</span>.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                            <Link to="/browse" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2">
                                <UploadCloud size={24} />
                                Upload Notes
                            </Link>
                        </div>
                    </div>

                    {/* Hero Visual - Floating Elements */}
                    <div className="relative w-full max-w-sm aspect-square hidden md:flex items-center justify-center">
                        <div className="absolute -inset-4 bg-gradient-to-br from-violet-600 to-pink-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
                        <div className="relative z-10 p-8 rounded-3xl bg-zinc-900/50 backdrop-blur-xl border border-white/10 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-zinc-800"></div>
                                <div className="h-3 w-32 bg-zinc-800 rounded-full"></div>
                            </div>
                            <div className="space-y-4 w-72">
                                <div className="h-3 w-full bg-zinc-800 rounded-full"></div>
                                <div className="h-3 w-5/6 bg-zinc-800 rounded-full"></div>
                                <div className="h-3 w-4/6 bg-zinc-800 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <NoticeBoard />

            <SemesterGrid />

            {/* AI Teaser Section */}
            <div className="rounded-3xl bg-gradient-to-r from-violet-900 to-fuchsia-900 overflow-hidden relative mx-4 md:mx-0">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="relative z-10 px-6 py-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="max-w-xl text-center md:text-left">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Instant AI Summaries
                        </h2>
                        <p className="text-violet-100 text-lg mb-8 opacity-90">
                            Upload any document and get a concise, exam-ready summary in seconds. Perfect for last-minute revision.
                        </p>
                        <div className="space-y-4 text-left">
                            {['Summarize 50 pages in 30 seconds', 'Extract key concepts automatically', 'Generate practice questions'].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-white/90">
                                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                        <Sparkles size={12} />
                                    </div>
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Visual Demo Placeholder */}
                    <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
                        <div className="flex gap-2 mb-6">
                            <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                        </div>
                        <div className="bg-black/20 rounded-lg p-4 mb-4">
                            <p className="text-xs text-white/50 mb-2">Original Document • 2,450 words</p>
                            <p className="text-sm text-white/80 leading-relaxed max-h-20 overflow-hidden text-ellipsis">
                                In thermodynamics, entropy is a measure of disorder...
                            </p>
                        </div>
                        <div className="flex justify-center my-2">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                                <Sparkles size={16} className="text-white" />
                            </div>
                        </div>
                        <div className="bg-violet-500/30 rounded-lg p-4 border border-violet-400/30">
                            <p className="text-xs text-violet-200 mb-2">✨ AI Summary • 120 words</p>
                            <p className="text-sm text-white font-medium leading-relaxed">
                                Entropy measures system disorder. Key points: increases in isolated systems, related to info theory...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
