import React, { useState } from 'react';
import { User, LogOut, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

const Settings = () => {
    const { user, signOut } = useAuth();
    // Default to user metadata or fallback
    const [name, setName] = useState(user?.user_metadata?.full_name || 'Student');
    const [year, setYear] = useState('1st Year');

    // Derived from user object
    const email = user?.email || '';
    const initials = (name || email).charAt(0).toUpperCase();

    const [loading, setLoading] = useState(false);

    // Fetch user profile from Supabase
    React.useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('full_name, year')
                .eq('id', user.id)
                .single();

            if (error) {
                // If profile doesn't exist (might happen for old users), we can ignore or init
                console.warn("Could not fetch profile", error);
            } else if (data) {
                setName(data.full_name || user.user_metadata?.full_name || '');
                setYear(data.year || '1st Year');
            }
        } catch (error) {
            console.error("Error loading profile:", error);
        }
    };

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    updated_at: new Date(),
                    full_name: name,
                    year: year,
                    email: user.email, // Ensure email is in sync
                    avatar_url: user.user_metadata?.avatar_url
                });

            if (error) throw error;
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Error updating profile: " + error.message);
        } finally {
            setLoading(false);
        }
    };

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
                        {user?.user_metadata?.avatar_url ? (
                            <img src={user.user_metadata.avatar_url} alt={name} className="w-24 h-24 rounded-full ring-4 ring-zinc-900 object-cover" />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-3xl ring-4 ring-zinc-900 relative group cursor-pointer">
                                {initials}
                            </div>
                        )}
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
                        <button
                            onClick={handleSave}
                            className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                        >
                            <Save size={18} />
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>

            <button
                onClick={signOut}
                className="w-full py-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 font-medium hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
            >
                <LogOut size={18} />
                Log Out
            </button>
        </div>
    );
};

export default Settings;
