import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import LoadingPage from '../components/common/Loading'; // Adjust the import path as necessary

const PublicRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        console.log('loading...');
        return <LoadingPage />;
    }

    if (user) {
        console.log('User is authenticated, redirecting from public route');
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PublicRoute;