import React, { useState } from 'react';
import { Calendar, Bell, FileText, Star, ThumbsUp, ThumbsDown, Paperclip, Plus, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const initialNotices = [
    {
        id: 1,
        type: 'Exam',
        title: 'Mid-semester Exam Schedule Released',
        time: '2 hours ago',
        icon: FileText,
        color: 'text-pink-500',
        bg: 'bg-pink-500/10',
        border: 'border-pink-500/20',
        likes: 24,
        dislikes: 2,
        userReaction: null,
        attachment: { type: 'PDF', name: 'Exam_Schedule_2024.pdf' }
    },
    {
        id: 2,
        type: 'Event',
        title: 'AI/ML Workshop - Limited Seats!',
        time: '5 hours ago',
        icon: Star,
        color: 'text-violet-500',
        bg: 'bg-violet-500/10',
        border: 'border-violet-500/20',
        likes: 156,
        dislikes: 0,
        userReaction: null,
        attachment: null
    },
    {
        id: 3,
        type: 'General',
        title: 'Library Hours Extended Till Midnight',
        time: '1 day ago',
        icon: Bell,
        color: 'text-cyan-500',
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/20',
        likes: 89,
        dislikes: 5,
        userReaction: null,
        attachment: null
    },
    {
        id: 4,
        type: 'Deadline',
        title: 'Project Submission Deadline Extended',
        time: '2 days ago',
        icon: Calendar,
        color: 'text-orange-500',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/20',
        likes: 45,
        dislikes: 12,
        userReaction: null,
        attachment: { type: 'DOC', name: 'Project_Guidelines_v2.docx' }
    }
];

const NoticeBoard = () => {
    const { user } = useAuth();
    const [notices, setNotices] = useState(initialNotices);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [newNotice, setNewNotice] = useState({ title: '', type: 'General', hasAttachment: false });

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

    const handlePostNotice = (e) => {
        e.preventDefault();
        const noticeToAdd = {
            id: Date.now(),
            type: newNotice.type,
            title: newNotice.title,
            time: 'Just now',
            icon: Bell, // Default icon
            color: 'text-violet-500',
            bg: 'bg-violet-500/10',
            border: 'border-violet-500/20',
            likes: 0,
            dislikes: 0,
            userReaction: null,
            attachment: newNotice.hasAttachment ? { type: 'PDF', name: 'New_Notice_Attachment.pdf' } : null
        };
        setNotices([noticeToAdd, ...notices]);
        setIsPostModalOpen(false);
        setNewNotice({ title: '', type: 'General', hasAttachment: false });
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
                    className="px-4 py-2 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                    <Plus size={16} /> Post Notice
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notices.map((notice) => (
                    <div key={notice.id} className="bg-card border border-zinc-800 rounded-xl p-4 flex flex-col gap-3 hover:bg-zinc-800/50 transition-colors group">
                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg ${notice.bg} ${notice.color}`}>
                                <notice.icon size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${notice.bg} ${notice.color} border ${notice.border}`}>
                                        {notice.type}
                                    </span>
                                    <span className="text-xs text-muted">{notice.time}</span>
                                </div>
                                <h3 className="font-semibold text-white group-hover:text-primary transition-colors truncate">{notice.title}</h3>

                                {/* Attachment View */}
                                {notice.attachment && (
                                    <div className="mt-2 flex items-center gap-2 p-2 rounded-lg bg-zinc-900/80 border border-zinc-800/50 max-w-fit">
                                        <div className="bg-red-500/20 text-red-400 p-1 rounded text-[10px] font-bold">PDF</div>
                                        <span className="text-xs text-zinc-300 truncate max-w-[150px]">{notice.attachment.name}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Reaction Bar */}
                        <div className="flex items-center gap-4 pt-3 border-t border-zinc-800 mt-auto px-1">
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
                ))}
            </div>

            {/* Post Notice Modal */}
            {isPostModalOpen && (
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

                            <div
                                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${newNotice.hasAttachment
                                    ? 'border-primary bg-primary/10'
                                    : 'border-zinc-800 hover:bg-zinc-900/50 hover:border-zinc-600'
                                    }`}
                                onClick={() => setNewNotice({ ...newNotice, hasAttachment: !newNotice.hasAttachment })}
                            >
                                <Paperclip size={24} className={`mb-2 ${newNotice.hasAttachment ? 'text-primary' : 'text-zinc-500'}`} />
                                <p className={`text-sm ${newNotice.hasAttachment ? 'text-primary font-medium' : 'text-zinc-400'}`}>
                                    {newNotice.hasAttachment ? 'File Attached (Simulated)' : 'Click to attach PDF or Doc'}
                                </p>
                                {newNotice.hasAttachment && (
                                    <p className="text-xs text-zinc-500 mt-1">New_Notice_Attachment.pdf</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all mt-4"
                            >
                                Post Notice
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NoticeBoard;
