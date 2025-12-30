import React, { useState } from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

const Header = ({ onMenuClick }) => {
    const { user, signInWithGoogle, signInWithGithub, signOut } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate('/browse', { state: { searchQuery } });
        }
    };

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
                            placeholder="Search notes, subjects..."
                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-full py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-zinc-600"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                    </div>
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 ml-4">
                <button className="sm:hidden text-muted">
                    <Search size={20} />
                </button>

                <div className="w-px h-6 bg-zinc-800 mx-2 hidden sm:block"></div>

                {user ? (
                    <div className="relative">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-3 hover:bg-zinc-800/50 p-1.5 pr-3 rounded-full transition-colors border border-transparent hover:border-zinc-800 focus:outline-none"
                        >
                            {user.user_metadata?.avatar_url ? (
                                <img src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name} className="w-8 h-8 rounded-full ring-2 ring-zinc-900" />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-zinc-900">
                                    {(user.email?.[0] || 'U').toUpperCase()}
                                </div>
                            )}
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium text-white leading-none">{user.user_metadata?.full_name || 'User'}</p>
                                <p className="text-xs text-muted mt-0.5">{user.email}</p>
                            </div>
                        </button>

                        {/* Dropdown Menu */}
                        {isProfileOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                                <div className="absolute right-0 mt-2 w-48 bg-card border border-zinc-800 rounded-xl shadow-xl z-50 py-1 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                                    <div className="px-4 py-2 border-b border-zinc-800 mb-1">
                                        <p className="text-sm font-medium text-white">{user.user_metadata?.full_name || 'User'}</p>
                                        <p className="text-xs text-muted truncate">{user.email}</p>
                                    </div>
                                    <Link
                                        to="/settings"
                                        onClick={() => setIsProfileOpen(false)}
                                        className="block w-full text-left px-4 py-2 text-sm text-muted hover:text-white hover:bg-zinc-800 transition-colors"
                                    >
                                        Settings
                                    </Link>
                                    <div className="h-px bg-zinc-800 my-1"></div>
                                    <button
                                        onClick={() => {
                                            signOut();
                                            setIsProfileOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                    >
                                        Log Out
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={signInWithGoogle}
                            className="bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-full text-sm font-bold transition-colors flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Sign In
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
