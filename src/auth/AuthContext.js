import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loggedOut, setLoggedOut] = useState(false);
    const [loading, setLoading] = useState(true); // Initial app loading
    const [apiLoading, setApiLoading] = useState(false); // New state for API loading

    useEffect(() => {
        const token = localStorage.getItem('token');
        const updates = { user: null, role: null, loading: false };
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const isTokenExpired = decodedToken.exp * 1000 < Date.now();
                if (!isTokenExpired) {
                    updates.user = decodedToken;
                    updates.role = decodedToken.role;
                } else {
                    console.warn('Token expired. Logging out...');
                    localStorage.removeItem('token');
                }
            } catch (error) {
                console.error('Invalid token:', error);
                localStorage.removeItem('token');
            }
        }
        setUser(updates.user);
        setRole(updates.role);
        setLoading(updates.loading);
    }, []);

    useEffect(() => {
        console.log('loggedOut state changed:', loggedOut);
    }, [loggedOut]);

    const login = (token) => {
        localStorage.setItem('token', token);
        const decodedToken = jwtDecode(token);
        setUser(decodedToken);
        setRole(decodedToken.role);
        if (loggedOut) setLoggedOut(false);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setRole(null);
        setLoggedOut(true);
    };

    const hasAccess = (requiredRole) => {
        const roleHierarchy = ['ROLE_USER', 'ROLE_SELLER', 'ROLE_ADMIN'];
        const userRoleIndex = roleHierarchy.indexOf(role);
        const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);
        return userRoleIndex >= requiredRoleIndex;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                role,
                loggedOut,
                setLoggedOut,
                login,
                logout,
                hasAccess,
                loading,
                apiLoading,
                setApiLoading, // Expose apiLoading and setter
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;