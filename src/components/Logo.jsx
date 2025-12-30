import React from 'react';
import { BookOpen } from 'lucide-react';

const Logo = () => {
    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-violet-800 text-white">
                <BookOpen size={20} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
                Doc<span className="text-cyan-400">8</span>
            </span>
        </div>
    );
};

export default Logo;
