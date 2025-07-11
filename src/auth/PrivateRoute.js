import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import LoadingPage from '../components/common/Loading'; // Adjust the import path as necessary


const PrivateRoute = ({ children, requiredRole }) => {
    const { user, hasAccess, loggedOut, setLoggedOut, loading } = useContext(AuthContext);

    
    if (loading) {
        console.log('loading...');
        return <LoadingPage />;
    }

    if (!user) {
        console.log('user state', user);
        if (loggedOut) {
            console.log('is logged out?:', loggedOut);
            return <Navigate to="/" />; // Redirect to home page
        } else {
            return <Navigate to="/login" />; // Redirect to login page
        }
    }

    if (!hasAccess(requiredRole)) {
        return <Navigate to="/unauthorized" />; // Redirect to an unauthorized page if access is denied
    }

    return children;
};

export default PrivateRoute;

