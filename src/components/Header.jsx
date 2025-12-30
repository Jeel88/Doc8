import React, { useState } from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import Logo from './Logo';

const Header = ({ onMenuClick }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-zinc-800 bg-bg-dark/50 backdrop-blur-md sticky top-0 z-40">
            <div className="flex items-center gap-4 flex-1">
                <button className="md:hidden text-white sm:mr-2" onClick={onMenuClick}>
                    <Menu size={24} />
                </button>

                {/* Mobile Logo only */}
                <div className="md:hidden">
                    <Logo />
                </div>

                {/* Search Bar - Hidden on small mobile */}
                <div className="max-w-xl w-full hidden sm:block">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-full py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-zinc-600"
                        />
                    </div>
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 ml-4">
                <button className="sm:hidden text-muted">
                    <Search size={20} />
                </button>
                <button className="p-2 text-muted hover:text-white hover:bg-zinc-800 rounded-full transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-zinc-900"></span>
                </button>

                <div className="w-px h-6 bg-zinc-800 mx-2 hidden sm:block"></div>

                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 hover:bg-zinc-800/50 p-1.5 pr-3 rounded-full transition-colors border border-transparent hover:border-zinc-800 focus:outline-none"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-zinc-900">
                            JD
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-medium text-white leading-none">John Doe</p>
                            <p className="text-xs text-muted mt-0.5">Student</p>
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    {isProfileOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                            <div className="absolute right-0 mt-2 w-48 bg-card border border-zinc-800 rounded-xl shadow-xl z-50 py-1 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                                <div className="px-4 py-2 border-b border-zinc-800 mb-1">
                                    <p className="text-sm font-medium text-white">John Doe</p>
                                    <p className="text-xs text-muted">john.doe@edu.com</p>
                                </div>
                                <button className="w-full text-left px-4 py-2 text-sm text-muted hover:text-white hover:bg-zinc-800 transition-colors">
                                    Profile
                                </button>
                                <button className="w-full text-left px-4 py-2 text-sm text-muted hover:text-white hover:bg-zinc-800 transition-colors">
                                    Settings
                                </button>
                                <div className="h-px bg-zinc-800 my-1"></div>
                                <button className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                                    Log Out
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
