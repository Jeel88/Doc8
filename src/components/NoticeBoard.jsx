import React from 'react';
import { Calendar, Bell, FileText, Star } from 'lucide-react';

const notices = [
    {
        id: 1,
        type: 'Exam',
        title: 'Mid-semester Exam Schedule Released',
        time: '2 hours ago',
        icon: FileText,
        color: 'text-pink-500',
        bg: 'bg-pink-500/10',
        border: 'border-pink-500/20'
    },
    {
        id: 2,
        type: 'Event',
        title: 'AI/ML Workshop - Limited Seats!',
        time: '5 hours ago',
        icon: Star,
        color: 'text-violet-500',
        bg: 'bg-violet-500/10',
        border: 'border-violet-500/20'
    },
    {
        id: 3,
        type: 'General',
        title: 'Library Hours Extended Till Midnight',
        time: '1 day ago',
        icon: Bell,
        color: 'text-cyan-500',
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/20'
    },
    {
        id: 4,
        type: 'Deadline',
        title: 'Project Submission Deadline Extended',
        time: '2 days ago',
        icon: Calendar,
        color: 'text-orange-500',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/20'
    }
];

const NoticeBoard = () => {
    return (
        <div className="space-y-4">
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
                <button className="px-4 py-2 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg text-sm font-medium transition-colors">
                    + Post Notice
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notices.map((notice) => (
                    <div key={notice.id} className="bg-card border border-zinc-800 rounded-xl p-4 flex items-start gap-4 hover:bg-zinc-800/50 transition-colors group cursor-pointer">
                        <div className={`p-3 rounded-lg ${notice.bg} ${notice.color}`}>
                            <notice.icon size={20} />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${notice.bg} ${notice.color} border ${notice.border}`}>
                                    {notice.type}
                                </span>
                                <span className="text-xs text-muted">{notice.time}</span>
                            </div>
                            <h3 className="font-semibold text-white group-hover:text-primary transition-colors line-clamp-1">{notice.title}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NoticeBoard;
