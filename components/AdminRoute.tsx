
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { onAuthStateChanged, auth } from '../src/firebase';
import { getCurrentUserRole } from '../src/auth';
import Spinner from './Spinner';
import Layout from './Layout';

const AdminRoute: React.FC = () => {
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const role = await getCurrentUserRole();
                setIsAdmin(role === 'admin');
_            } else {
                setIsAdmin(false);
            }
        });
        return () => unsubscribe();
    }, []);

    if (isAdmin === null) {
        return <Spinner />;
    }

    return isAdmin ? <Layout><Outlet /></Layout> : <Navigate to="/login" replace />;
};

export default AdminRoute;
