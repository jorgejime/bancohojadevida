
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth'; // Corrected import
import { auth } from '../src/firebase'; // Corrected import
import Layout from './Layout';
import Spinner from './Spinner';

const PrivateRoute: React.FC = () => {
    const [isAuth, setIsAuth] = useState<boolean | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuth(!!user);
        });
        return () => unsubscribe();
    }, []);

    if (isAuth === null) {
        return <Spinner />;
    }

    return isAuth ? <Layout /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
