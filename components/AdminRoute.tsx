import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUserRole } from '../src/auth';
import Spinner from './Spinner';

const AdminRoute = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      const role = await getCurrentUserRole();
      if (role === 'admin') {
        setIsAdmin(true);
      }
      setLoading(false);
    };

    checkAdminRole();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return isAdmin ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminRoute;
