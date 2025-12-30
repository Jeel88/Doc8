import React, { useState } from 'react';
import { Calendar, Bell, FileText, Star, ThumbsUp, ThumbsDown, Paperclip, Plus, X, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

const initialNotices = [];

const NoticeBoard = () => {
    const { user } = useAuth();
    const [notices, setNotices] = useState([]);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [newNotice, setNewNotice] = useState({ title: '', type: 'General', hasAttachment: false });

    React.useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        const { data, error } = await supabase
            .from('notices')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) console.error('Error fetching notices:', error);
        else {
            // Map DB data to UI format
            const formatted = data.map(n => {
                let icon = Bell;
                let color = 'text-cyan-500';
                let bg = 'bg-cyan-500/10';

                if (n.type === 'Exam') { icon = FileText; color = 'text-pink-500'; bg = 'bg-pink-500/10'; }
                if (n.type === 'Event') { icon = Star; color = 'text-blue-500'; bg = 'bg-blue-500/10'; }
                if (n.type === 'Deadline') { icon = Calendar; color = 'text-orange-500'; bg = 'bg-orange-500/10'; }

                return {
                    ...n,
                    icon, color, bg,
                    border: `border-${color.split('-')[1]}-500/20`,
                    time: new Date(n.created_at).toLocaleDateString(),
                    attachment: n.attachment_url ? { name: n.attachment_name, url: n.attachment_url } : null
                };
            });
            setNotices(formatted);
        }
    };


    const handleReaction = (id, reaction) => {
        if (!user) {
            alert("Please sign in to react to notices!");
            return;
        }

        setNotices(currentNotices =>
            currentNotices.map(notice => {
                if (notice.id !== id) return notice;

                let newLikes = notice.likes;
                let newDislikes = notice.dislikes;
                let newUserReaction = notice.userReaction;

                // Toggle logic
                if (notice.userReaction === reaction) {
                    newUserReaction = null;
                    if (reaction === 'like') newLikes--;
                    if (reaction === 'dislike') newDislikes--;
                } else {
                    if (notice.userReaction === 'like') newLikes--;
                    if (notice.userReaction === 'dislike') newDislikes--;
                    newUserReaction = reaction;
                    if (reaction === 'like') newLikes++;
                    if (reaction === 'dislike') newDislikes++;
                }

                return { ...notice, likes: newLikes, dislikes: newDislikes, userReaction: newUserReaction };
            })
        );
    };

    const [isUploading, setIsUploading] = useState(false);

    const handlePostNotice = async (e) => {
        e.preventDefault();
        setIsUploading(true);

        // Upload attachment if present
        let attachmentData = null;
        if (newNotice.hasAttachment && newNotice.file) {
            try {
                const fileExt = newNotice.file.name.split('.').pop();
                const fileName = `notice_${Date.now()}.${fileExt}`;
                const filePath = `public/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('notes') // Reusing 'notes' bucket for simplicity, or create 'notices'
                    .upload(filePath, newNotice.file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage.from('notes').getPublicUrl(filePath);

                attachmentData = {
                    type: 'PDF', // Simplified
                    name: newNotice.file.name,
                    url: publicUrl
                };
            } catch (err) {
                console.error("Notice upload failed", err);
                alert("Failed to upload attachment");
                setIsUploading(false);
                return;
            }
        }

        try {
            const { error } = await supabase.from('notices').insert([
                {
                    title: newNotice.title,
                    type: newNotice.type,
                    attachment_name: attachmentData?.name || null,
                    attachment_url: attachmentData?.url || null,
                    user_id: user.id
                }
            ]);

            if (error) throw error;

            fetchNotices();
            setIsPostModalOpen(false);
            setNewNotice({ title: '', type: 'General', hasAttachment: false, file: null });
            alert("Notice posted!");
        } catch (err) {
            console.error("Error posting notice:", err);
            alert("Error posting notice: " + err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this notice?")) return;
        const { error } = await supabase.from('notices').delete().eq('id', id);
        if (error) alert("Error deleting notice");
        else fetchNotices();
    };

    return (
        <div className="space-y-4 relative">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <span className="p-2 bg-pink-500/10 rounded-full text-pink-500">
                            <Bell size={20} />
                        </span>
                        Notice Board
                    </h2>
                    <p className="text-muted text-sm mt-1">Stay updated with latest announcements</p>
                </div>

                <button
                    onClick={() => {
                        if (!user) {
                            alert("Please sign in to post notices!");
                            return;
                        }
                        setIsPostModalOpen(true);
                    }}
                    className="px-4 py-2 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 whitespace-nowrap"
                >
                    <Plus size={16} /> Post Notice
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notices.length === 0 && <p className="text-muted col-span-2 text-center py-8">No notices yet.</p>}
                {notices.map((notice) => (
                    <div key={notice.id} className="bg-card border border-zinc-800 rounded-xl p-4 flex flex-col gap-3 hover:bg-zinc-800/50 transition-colors group relative">
                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg ${notice.bg} ${notice.color}`}>
                                <notice.icon size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${notice.bg} ${notice.color} border ${notice.border}`}>
                                            {notice.type}
                                        </span>
                                        <span className="text-xs text-muted">{notice.time}</span>
                                    </div>

                                    {/* Delete Button */}
                                    {user && user.id === notice.user_id && (
                                        <button
                                            onClick={() => handleDelete(notice.id)}
                                            className="text-zinc-500 hover:text-red-500 hover:bg-zinc-900 rounded-lg p-1 transition-colors"
                                            title="Delete Notice"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                                <h3 className="font-semibold text-white group-hover:text-primary transition-colors truncate">{notice.title}</h3>

                                {/* Attachment View */}
                                {notice.attachment && (
                                    <a href={notice.attachment.url || '#'} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center gap-2 p-2 rounded-lg bg-zinc-900/80 border border-zinc-800/50 max-w-fit hover:border-primary/50 transition-colors cursor-pointer">
                                        <div className="bg-red-500/20 text-red-400 p-1 rounded text-[10px] font-bold">FILE</div>
                                        <span className="text-xs text-zinc-300 truncate max-w-[150px]">{notice.attachment.name}</span>
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Reaction Bar */}
                        < div className="flex items-center gap-4 pt-3 border-t border-zinc-800 mt-auto px-1" >
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => handleReaction(notice.id, 'like')}
                                    className={`p-1.5 rounded-full transition-all flex items-center gap-1.5 ${notice.userReaction === 'like'
                                        ? 'text-green-400 bg-green-400/10'
                                        : 'text-muted hover:text-green-400 hover:bg-green-400/10'
                                        }`}
                                >
                                    <ThumbsUp size={16} fill={notice.userReaction === 'like' ? "currentColor" : "none"} />
                                </button>
                                <span className={`text-xs font-medium ${notice.userReaction === 'like' ? 'text-green-400' : 'text-muted'}`}>
                                    {notice.likes}
                                </span>
                            </div>

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => handleReaction(notice.id, 'dislike')}
                                    className={`p-1.5 rounded-full transition-all flex items-center gap-1.5 ${notice.userReaction === 'dislike'
                                        ? 'text-red-400 bg-red-400/10'
                                        : 'text-muted hover:text-red-400 hover:bg-red-400/10'
                                        }`}
                                >
                                    <ThumbsDown size={16} fill={notice.userReaction === 'dislike' ? "currentColor" : "none"} />
                                </button>
                                <span className={`text-xs font-medium ${notice.userReaction === 'dislike' ? 'text-red-400' : 'text-muted'}`}>
                                    {notice.dislikes}
                                </span>
                            </div>
                        </div>
                    </div>
                ))
                }
            </div >

            {/* Post Notice Modal */}
            {
                isPostModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-card border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white">Post New Notice</h2>
                                <button onClick={() => setIsPostModalOpen(false)} className="text-zinc-500 hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handlePostNotice} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                        value={newNotice.title}
                                        onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Category</label>
                                    <select
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                        value={newNotice.type}
                                        onChange={(e) => setNewNotice({ ...newNotice, type: e.target.value })}
                                    >
                                        <option value="General">General</option>
                                        <option value="Exam">Exam</option>
                                        <option value="Event">Event</option>
                                        <option value="Deadline">Deadline</option>
                                    </select>
                                </div>

                                <div className="border-2 border-dashed border-zinc-800 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-zinc-900/50 hover:border-zinc-600 transition-all relative">
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                const file = e.target.files[0];
                                                if (file.size > 10 * 1024 * 1024) {
                                                    alert("File size exceeds 10MB limit.");
                                                    return;
                                                }
                                                setNewNotice({ ...newNotice, hasAttachment: true, file: file });
                                            }
                                        }}
                                    />
                                    <Paperclip size={24} className={`mb-2 ${newNotice.hasAttachment ? 'text-primary' : 'text-zinc-500'}`} />
                                    <p className={`text-sm ${newNotice.hasAttachment ? 'text-primary font-medium' : 'text-zinc-400'}`}>
                                        {newNotice.hasAttachment ? newNotice.file?.name : 'Click to attach PDF or Doc'}
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isUploading}
                                    className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all mt-4 disabled:opacity-50"
                                >
                                    {isUploading ? 'Posting...' : 'Post Notice'}
                                </button>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default NoticeBoard;
