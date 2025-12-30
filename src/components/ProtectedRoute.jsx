import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';
import AuthModal from './AuthModal';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const [showModal, setShowModal] = React.useState(false);

    React.useEffect(() => {
        if (!loading && !user) {
            setShowModal(true);
        }
    }, [user, loading]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    if (!user) {
        return (
            <>
                <div className="flex items-center justify-center min-h-[60vh] text-center p-8">
                    <div className="max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Access Restricted</h2>
                        <p className="text-muted mb-6">Please sign in to view this content.</p>
                    </div>
                </div>
                <AuthModal
                    isOpen={showModal}
                    onClose={() => {
                        setShowModal(false);
                        // Redirect to home if they close the modal without logging in
                        if (!user) {
                            window.location.href = '/';
                        }
                    }}
                />
            </>
        );
    }

    return children;
};

export default ProtectedRoute;
