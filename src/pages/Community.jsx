import React from 'react';
import { MessageSquare, Heart, Share2, MoreHorizontal } from 'lucide-react';

const posts = [
    {
        id: 1,
        user: 'Alex Morgan',
        role: 'Computer Science • 3rd Year',
        avatar: 'AM',
        color: 'bg-blue-600',
        content: 'Does anyone have the simplified notes for Data Structures & Algorithms (Trees & Graphs)? The professor\'s slides are a bit too dense.',
        likes: 24,
        comments: 12,
        time: '2h ago'
    },
    {
        id: 2,
        user: 'Sarah Lee',
        role: 'Physics • 2nd Year',
        avatar: 'SL',
        color: 'bg-emerald-600',
        content: 'Just uploaded the complete lab manual solutions for Thermodynamics! Check it out in the Physics section.',
        likes: 56,
        comments: 8,
        time: '5h ago'
    },
    {
        id: 3,
        user: 'David Chen',
        role: 'Mathematics • Final Year',
        avatar: 'DC',
        color: 'bg-violet-600',
        content: 'Organizing a group study session for the upcoming Calculus midterm this Saturday at the Library setup. DM if interested!',
        likes: 15,
        comments: 5,
        time: '1d ago'
    }
];

const Community = () => {
    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Community</h1>
                    <p className="text-muted">Join discussions, ask questions, and help others.</p>
                </div>
                <button className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors">
                    Start Discussion
                </button>
            </div>

            <div className="space-y-4">
                {posts.map((post) => (
                    <div key={post.id} className="bg-card border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full ${post.color} flex items-center justify-center text-white font-bold text-sm`}>
                                    {post.avatar}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white leading-none">{post.user}</h3>
                                    <p className="text-xs text-muted mt-1">{post.role}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-muted">{post.time}</span>
                                <button className="text-muted hover:text-white">
                                    <MoreHorizontal size={18} />
                                </button>
                            </div>
                        </div>

                        <p className="text-zinc-300 mb-5 leading-relaxed">
                            {post.content}
                        </p>

                        <div className="flex items-center gap-6 border-t border-zinc-800 pt-4">
                            <button className="flex items-center gap-2 text-sm text-muted hover:text-pink-500 transition-colors group">
                                <Heart size={18} className="group-hover:fill-pink-500" />
                                <span>{post.likes}</span>
                            </button>
                            <button className="flex items-center gap-2 text-sm text-muted hover:text-blue-500 transition-colors">
                                <MessageSquare size={18} />
                                <span>{post.comments}</span>
                            </button>
                            <button className="flex items-center gap-2 text-sm text-muted hover:text-white transition-colors ml-auto">
                                <Share2 size={18} />
                                <span>Share</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Community;
