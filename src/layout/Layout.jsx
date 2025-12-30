import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const mainRef = React.useRef(null);

    React.useEffect(() => {
        if (mainRef.current) {
            mainRef.current.scrollTop = 0;
        }
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <div className="flex min-h-screen bg-bg-dark text-white font-sans">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 md:ml-64 flex flex-col min-w-0 transition-all duration-300">
                <Header onMenuClick={() => setIsSidebarOpen(true)} />
                <main ref={mainRef} className="flex-1 p-4 md:p-8 overflow-y-auto overflow-x-hidden flex flex-col gap-24">
                    <div className="max-w-[1600px] mx-auto w-full flex-1">
                        <Outlet />
                    </div>
                    <Footer />
                </main>
            </div>
        </div>
    );
};

export default Layout;
