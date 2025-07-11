import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
    TextField, Button, Box, Typography, Alert, Container,
    Link as MuiLink, Backdrop, CircularProgress, Divider
} from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import GoogleIcon from '@mui/icons-material/Google';
import { loginUser, accessWithGoogle } from '../../services/api';
import { AuthContext } from '../../auth/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { login, user, role, apiLoading, setApiLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    // After a successful login (or Google login), redirect based on role
    useEffect(() => {
        if (success && user && role) {
            if (role === 'ROLE_ADMIN') navigate('/admin/dashboard');
            else if (role === 'ROLE_SELLER') navigate('/product-user/dashboard');
            else if (role === 'ROLE_USER') navigate('/user/dashboard');
            else {
                setError('Invalid role. Access denied.');
                setSuccess(false);
            }
        }
    }, [success, user, role, navigate]);

    // Standard email/password login
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        try {
            setApiLoading(true);
            const token = await loginUser(email, password);
            const decoded = jwtDecode(token);
            login(token);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data || 'Login failed');
        } finally {
            setApiLoading(false);
        }
    };

    // Google login handlers
    const handleGoogleSuccess = async (credentialResponse) => {
        const idToken = credentialResponse.credential;
        try {
            setApiLoading(true);
            const data = await accessWithGoogle(idToken);
            login(data.token);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || String(err));
        } finally {
            setApiLoading(false);
        }
    };

    const handleGoogleError = () => {
        setError('Google sign-in was not successful. Please try again.');
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8, fontFamily: 'Roboto, Arial, sans-serif' }}>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={apiLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <Box
                sx={{
                    p: 4,
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    margin: '0 auto',
                    width: '400px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Typography
                    variant="h6"
                    component="h1"
                    gutterBottom
                    sx={{ color: '#000000', textAlign: 'center', fontWeight: 600 }}
                >
                    Login
                </Typography>

                {error && (
                    <Alert
                        severity="error"
                        sx={{
                            backgroundColor: 'transparent',
                            border: '1px solid #f44336',
                            borderRadius: '8px',
                            color: '#f44336',
                            mb: 2,
                        }}
                    >
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert
                        severity="success"
                        sx={{
                            backgroundColor: 'transparent',
                            border: '1px solid #4caf50',
                            borderRadius: '8px',
                            color: '#4caf50',
                            mb: 2,
                        }}
                    >
                        Login successful!
                    </Alert>
                )}

                {/* Google Sign-in Button */}
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap={false}
                    text="signin_with"    // ? “Sign in with Google”
                    type="standard"       // full button with text
                    shape="rectangular"   // same pill/corner styling
                />

                <Divider sx={{ my: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        or
                    </Typography>
                </Divider>

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                border: 'none',
                                borderRadius: '50px',
                                backgroundColor: 'transparent',
                                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                                '&.Mui-focused': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                            },
                            '& .MuiInputLabel-root': { color: '#000000' },
                            '& .MuiInputLabel-root.Mui-focused': { color: '#000000' },
                        }}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                border: 'none',
                                borderRadius: '50px',
                                backgroundColor: 'transparent',
                                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                                '&.Mui-focused': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                            },
                            '& .MuiInputLabel-root': { color: '#000000' },
                            '& .MuiInputLabel-root.Mui-focused': { color: '#000000' },
                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={apiLoading}
                        sx={{
                            mt: 2,
                            borderRadius: '50px',
                            color: '#FFFFFF',
                            backgroundColor: '#000000',
                            '&:hover': { backgroundColor: '#4A4A4A' },
                        }}
                    >
                        Login
                    </Button>
                </form>

                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <MuiLink
                        component={RouterLink}
                        to="/forgot-password"
                        variant="body2"
                        sx={{
                            display: 'block',
                            mb: 1,
                            color: '#000000',
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' },
                        }}
                    >
                        Forgot Password?
                    </MuiLink>
                    <MuiLink
                        component={RouterLink}
                        to="/register"
                        variant="body2"
                        sx={{
                            color: '#000000',
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' },
                        }}
                    >
                        Don't have an account? Sign Up
                    </MuiLink>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;
