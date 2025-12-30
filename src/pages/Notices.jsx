import React from 'react';
import NoticeBoard from '../components/NoticeBoard'; // Reusing the component

const Notices = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">Notice Board</h1>
                <p className="text-muted">Stay updated with the latest college announcements.</p>
            </div>
            {/* Reusing existing NoticeBoard component but simpler wrapper */}
            <NoticeBoard />
        </div>
    );
};

export default Notices;
