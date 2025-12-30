import React, { useState } from 'react';
import { User, LogOut, Save } from 'lucide-react';

const Settings = () => {
    const [name, setName] = useState('John Doe');
    const [year, setYear] = useState('3rd Year');
    const [email] = useState('john.doe@university.edu'); // Read-only for now

    return (
        <div className="max-w-xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">Settings</h1>
                <p className="text-muted">Manage your profile details.</p>
            </div>

            <div className="bg-card border border-zinc-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
                    <h2 className="font-semibold flex items-center gap-2">
                        <User size={18} className="text-primary" />
                        Edit Profile
                    </h2>
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-3xl ring-4 ring-zinc-900 relative group cursor-pointer">
                            JD
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium">Change</div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-muted mb-1.5">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted mb-1.5">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                disabled
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-500 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted mb-1.5">Current Year</label>
                            <select
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-all appearance-none"
                            >
                                <option>1st Year</option>
                                <option>2nd Year</option>
                                <option>3rd Year</option>
                                <option>4th Year</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                            <Save size={18} />
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>

            <button className="w-full py-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 font-medium hover:bg-red-500/20 transition-all flex items-center justify-center gap-2">
                <LogOut size={18} />
                Log Out
            </button>
        </div>
    );
};

export default Settings;
