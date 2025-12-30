import React from 'react';
import Logo from './Logo';
import { Github, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="w-full border-t border-zinc-800 mt-auto bg-card/50 backdrop-blur-sm">
            <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Brand Section */}
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <Logo />
                        <p className="text-zinc-500 text-sm">
                            The ultimate platform for academic resources.
                        </p>
                    </div>

                    {/* Credits & Socials */}
                    <div className="flex flex-col items-center md:items-end gap-3">
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                            <span>Built with</span>
                            <Heart size={14} className="text-pink-500 fill-pink-500" />
                            <span>by <span className="text-white font-medium">Doc8 Team</span></span>
                        </div>

                        <div className="flex items-center gap-3">
                            <a
                                href="https://github.com/jeel88"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 hover:bg-zinc-800 rounded-full text-xs font-medium transition-all group border border-zinc-700 hover:border-zinc-600"
                            >
                                <Github size={14} className="text-white" />
                                <span>Jeel</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-zinc-800 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
                    <p>© {new Date().getFullYear()} Doc8 Project.</p>
                    <p>Open Source Academic Initiative</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
