import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import AuthProvider from './auth/AuthContext';

import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={clientId}>
            <AuthProvider>
                <App />
            </AuthProvider>
        </GoogleOAuthProvider>
    </React.StrictMode>
);

reportWebVitals();
