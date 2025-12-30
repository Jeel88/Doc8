import React from 'react';
import { User, Bell, Moon, Shield, LogOut } from 'lucide-react';

const Settings = () => {
    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">Settings</h1>
                <p className="text-muted">Manage your account preferences and app settings.</p>
            </div>

            <div className="space-y-6">
                {/* Profile Section */}
                <section className="bg-card border border-zinc-800 rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
                        <h2 className="font-semibold flex items-center gap-2">
                            <User size={18} className="text-primary" />
                            Account
                        </h2>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-2xl ring-4 ring-zinc-900">
                                JD
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">John Doe</h3>
                                <p className="text-muted text-sm">john.doe@university.edu</p>
                            </div>
                            <button className="ml-auto px-4 py-2 border border-zinc-700 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-all">
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </section>

                {/* Preferences */}
                <section className="bg-card border border-zinc-800 rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
                        <h2 className="font-semibold flex items-center gap-2">
                            <Shield size={18} className="text-primary" />
                            Preferences
                        </h2>
                    </div>
                    <div className="divide-y divide-zinc-800">
                        <div className="p-4 flex items-center justify-between hover:bg-zinc-800/30">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-zinc-800 rounded-lg text-zinc-400">
                                    <Bell size={20} />
                                </div>
                                <div>
                                    <p className="font-medium">Notifications</p>
                                    <p className="text-sm text-muted">Manage email and push notifications</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>

                        <div className="p-4 flex items-center justify-between hover:bg-zinc-800/30">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-zinc-800 rounded-lg text-zinc-400">
                                    <Moon size={20} />
                                </div>
                                <div>
                                    <p className="font-medium">Dark Mode</p>
                                    <p className="text-sm text-muted">Adjust appearance settings</p>
                                </div>
                            </div>
                            <span className="text-sm text-muted bg-zinc-800 px-3 py-1 rounded-lg">Default</span>
                        </div>
                    </div>
                </section>

                <button className="w-full py-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 font-medium hover:bg-red-500/20 transition-all flex items-center justify-center gap-2">
                    <LogOut size={18} />
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default Settings;
