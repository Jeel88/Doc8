import React from 'react';
import { Home, Upload, Compass, Settings, BookOpen, Users, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();

    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: Upload, label: 'Upload Notes', path: '/upload' },
        { icon: Compass, label: 'Browse', path: '/browse' },
        { icon: Users, label: 'Community', path: '/community' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={onClose}
                ></div>
            )}

            <aside className={`fixed left-0 top-0 h-screen w-64 bg-card border-r border-zinc-800 flex flex-col p-6 z-50 transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="mb-8 flex items-center justify-between">
                    <Logo />
                    <button onClick={onClose} className="md:hidden text-muted hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 flex flex-col gap-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={onClose} // Close on click mobile
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive
                                        ? 'bg-violet-600/10 text-primary' /* Active state */
                                        : 'text-muted hover:bg-zinc-800 hover:text-white'
                                    }`}
                            >
                                <item.icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto pt-6 border-t border-zinc-800">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-violet-900/50 to-purple-900/20 border border-violet-500/20">
                        <p className="text-sm font-semibold text-white mb-1">Premium Plan</p>
                        <p className="text-xs text-muted mb-3">Get unlimited AI summaries</p>
                        <button className="w-full py-2 text-xs font-semibold bg-primary text-white rounded-lg hover:brightness-110 transition-all">
                            Upgrade Now
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
