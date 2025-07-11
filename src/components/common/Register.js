import React, { useState, useEffect, useContext } from 'react';
import {
    TextField, Button, Box, Typography, Container,
    Link as MuiLink, Divider, FormControlLabel, Checkbox,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress, Backdrop
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { registerUser, resendVerificationEmail, accessWithGoogle } from '../../services/api';
import { GoogleLogin } from '@react-oauth/google';
import { AuthContext } from '../../auth/AuthContext';
import { jwtDecode } from 'jwt-decode';

const Register = () => {
    const { apiLoading, setApiLoading, login, user, role } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        isSeller: false
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState('');
    const [passwordMatchError, setPasswordMatchError] = useState('');
    const [passwordStrengthError, setPasswordStrengthError] = useState('');
    const [emailForResend, setEmailForResend] = useState('');
    const [resendAttempts, setResendAttempts] = useState(0);
    const [remainingTime, setRemainingTime] = useState(null);
    const [showGoogleDialog, setShowGoogleDialog] = useState(false);

    const navigate = useNavigate();

    const MAX_ATTEMPTS = 3;
    const RESET_DURATION = 3600 * 1000; // 1 hour in milliseconds

    // Cleanup googleToken on component unmount
    useEffect(() => {
        return () => localStorage.removeItem('googleToken');
    }, []);

    // Redirect after successful Google or email signup with login
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

    // Load resend attempts from local storage and manage countdown for email signup
    useEffect(() => {
        if (success && emailForResend) {
            const storedData = JSON.parse(localStorage.getItem(`resend_${emailForResend}`)) || {};
            const { attempts = 0, timestamp = 0 } = storedData;
            const now = Date.now();

            if (attempts >= MAX_ATTEMPTS && (now - timestamp) < RESET_DURATION) {
                setResendAttempts(attempts);
                setRemainingTime(Math.ceil((RESET_DURATION - (now - timestamp)) / 1000));
            } else if ((now - timestamp) >= RESET_DURATION) {
                localStorage.setItem(`resend_${emailForResend}`, JSON.stringify({ attempts: 0, timestamp: 0 }));
                setResendAttempts(0);
                setRemainingTime(null);
            } else {
                setResendAttempts(attempts);
            }
        }
    }, [success, emailForResend]);

    // Countdown timer for remaining time
    useEffect(() => {
        if (remainingTime > 0) {
            const timer = setInterval(() => {
                setRemainingTime((prev) => {
                    if (prev <= 1) {
                        localStorage.setItem(`resend_${emailForResend}`, JSON.stringify({ attempts: 0, timestamp: 0 }));
                        setResendAttempts(0);
                        return null;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [remainingTime, emailForResend]);

    const validatePassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length < minLength) return `Password must be at least ${minLength} characters long.`;
        if (!hasUpperCase) return 'Password must contain at least one uppercase letter.';
        if (!hasLowerCase) return 'Password must contain at least one lowercase letter.';
        if (!hasNumber) return 'Password must contain at least one number.';
        if (!hasSpecialChar) return 'Password must contain at least one special character (e.g., !@#$%).';
        return '';
    };

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });

        if (name === 'password') {
            const strengthError = validatePassword(value);
            setPasswordStrengthError(strengthError);
            if (formData.confirmPassword && value !== formData.confirmPassword) {
                setPasswordMatchError('Passwords do not match');
            } else {
                setPasswordMatchError('');
            }
        } else if (name === 'confirmPassword') {
            setPasswordMatchError(
                formData.password !== value && formData.password !== ''
                    ? 'Passwords do not match'
                    : ''
            );
        }

        if (error && (name === 'password' || name === 'confirmPassword') && !passwordMatchError && !passwordStrengthError) {
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        const passwordValidationError = validatePassword(formData.password);
        if (passwordValidationError) {
            setPasswordStrengthError(passwordValidationError);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setApiLoading(true);
            const response = await registerUser({
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName,
                role: formData.isSeller ? 'SELLER' : 'USER'
            });
            setEmailForResend(formData.email);
            setMessage(formData.isSeller
                ? "Seller account created! Please check your email for verification (you should receive a message from no-reply@nethub.com.mx). If you don’t receive it, check your spam folder or resend it below."
                : "Registration successful! Please check your email for verification (you should receive a message from no-reply@nethub.com.mx). If you don’t receive it, check your spam folder or resend it below.");
            setSuccess(true);
            setFormData({
                email: '',
                password: '',
                confirmPassword: '',
                fullName: '',
                isSeller: false
            });
        } catch (err) {
            setError(
                err.response?.data?.error || // From backend: { error: "..." }
                err.response?.data?.message || // Fallback: { message: "..." }
                'Registration failed'
            );
        } finally {
            setApiLoading(false);
        }
    };

    // Handle Google Sign-up success
    const handleGoogleSuccess = async (credentialResponse) => {
        const idToken = credentialResponse.credential;
        try {
            setApiLoading(true);
            const data = await accessWithGoogle(idToken);
            localStorage.setItem('googleToken', data.token); // Store token instead of logging in
            setShowGoogleDialog(true);
            console.log('After setShowGoogleDialog', { showGoogleDialog: true, user, role });
        } catch (err) {
            console.error('Google sign-in error:', err);
            const errorMsg = err.response?.data?.message || err.message || String(err);
            setError('Google sign-in error: ' + errorMsg);
        } finally {
            setApiLoading(false);
        }
    };

    // Handle Google Sign-up error
    const handleGoogleError = () => {
        setError('Google sign-in was not successful. Please try again.');
    };

    const handleCloseErrorDialog = () => {
        setError('');
    };

    const handleResendEmail = async () => {
        if (resendAttempts >= MAX_ATTEMPTS) {
            setError(`Maximum resend attempts reached. Please wait ${Math.floor(remainingTime / 60)} minutes before trying again.`);
            return;
        }

        try {
            setApiLoading(true);
            await resendVerificationEmail(emailForResend);
            const newAttempts = resendAttempts + 1;
            setResendAttempts(newAttempts);
            localStorage.setItem(`resend_${emailForResend}`, JSON.stringify({
                attempts: newAttempts,
                timestamp: resendAttempts === 0 ? Date.now() : JSON.parse(localStorage.getItem(`resend_${emailForResend}`)).timestamp
            }));
            setMessage('Verification email resent. Please check your inbox or spam folder.');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend verification email. Please try again later.');
        } finally {
            setApiLoading(false);
        }
    };

    const inputStyle = {
        '& .MuiOutlinedInput-root': {
            border: 'none',
            borderRadius: '50px',
            backgroundColor: 'transparent',
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
            '&.Mui-focused': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
        },
        '& .MuiInputLabel-root': { color: '#000000' },
        '& .MuiInputLabel-root.Mui-focused': { color: '#000000' },
    };

    return (
        <Container sx={{ mt: 8, fontFamily: 'Roboto, Arial, sans-serif' }}>
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
                    maxWidth: '400px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Typography variant="h6" component="h1" gutterBottom
                    sx={{ color: '#000000', textAlign: 'center', fontWeight: 600 }}>
                    Register
                </Typography>

                {/* Google Sign-up Button */}
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap={false}
                    text="signup_with"
                    type="standard"
                    shape="rectangular"
                />

                <Divider sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>or</Typography>
                </Divider>

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Full Name"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        sx={inputStyle}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        sx={inputStyle}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        error={!!passwordStrengthError}
                        helperText={passwordStrengthError}
                        aria-describedby="password-error"
                        sx={inputStyle}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        error={!!passwordMatchError}
                        helperText={passwordMatchError}
                        aria-describedby="confirm-password-error"
                        sx={inputStyle}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.isSeller}
                                onChange={handleChange}
                                name="isSeller"
                                sx={{
                                    color: '#000000',
                                    '&.Mui-checked': { color: '#000000' },
                                }}
                            />
                        }
                        label="I plan to sell products"
                        sx={{ color: '#000000', mt: 1, mb: 1, alignSelf: 'flex-start' }}
                    />
                    <Box sx={{ position: 'relative' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={apiLoading}
                            aria-label="Register"
                            sx={{
                                mt: 2,
                                borderRadius: '50px',
                                color: '#FFFFFF',
                                backgroundColor: '#000000',
                                '&:hover': { backgroundColor: '#4A4A4A' },
                            }}
                        >
                            Register
                        </Button>
                    </Box>
                </form>

                {/* Success Dialog for Email Signup */}
                <Dialog open={success} onClose={() => { }} sx={{ '& .MuiDialog-paper': { borderRadius: '16px' } }} aria-live="polite">
                    <DialogTitle sx={{ color: '#4caf50', textAlign: 'center' }}>
                        Registration Successful
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ color: '#000000', textAlign: 'center' }}>
                            {message}
                        </DialogContentText>
                        {resendAttempts > 0 && resendAttempts < MAX_ATTEMPTS && (
                            <Typography variant="body2" sx={{ color: '#000000', textAlign: 'center', mt: 1 }}>
                                {MAX_ATTEMPTS - resendAttempts} resend attempt(s) remaining this hour.
                            </Typography>
                        )}
                        {resendAttempts >= MAX_ATTEMPTS && remainingTime > 0 && (
                            <Typography variant="body2" sx={{ color: '#f44336', textAlign: 'center', mt: 1 }}>
                                Maximum resend attempts reached. Please wait {Math.floor(remainingTime / 60)} minutes and {remainingTime % 60} seconds before trying again.
                            </Typography>
                        )}
                        <Box sx={{ mt: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/login')}
                                sx={{
                                    borderRadius: '50px',
                                    borderColor: '#4caf50',
                                    color: '#4caf50',
                                    '&:hover': { borderColor: '#388e3c', color: '#388e3c' },
                                }}
                                aria-label="Go to Login"
                            >
                                Go to Login
                            </Button>
                            {resendAttempts < MAX_ATTEMPTS && (
                                <Typography variant="body2">
                                    <MuiLink
                                        component="button"
                                        onClick={handleResendEmail}
                                        variant="body2"
                                        sx={{
                                            color: '#000000',
                                            textDecoration: 'underline',
                                            '&:hover': { textDecoration: 'underline' },
                                        }}
                                        aria-label="Didn't you receive email?"
                                    >
                                        Didn't you receive email?
                                    </MuiLink>
                                </Typography>
                            )}
                        </Box>
                    </DialogContent>
                </Dialog>

                {/* Error Dialog */}
                <Dialog open={!!error} onClose={handleCloseErrorDialog} sx={{ '& .MuiDialog-paper': { borderRadius: '16px' } }} aria-live="polite">
                    <DialogTitle sx={{ color: '#f44336', textAlign: 'center' }}>
                        Registration Failed
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ color: '#000000', textAlign: 'center' }}>
                            {error}
                        </DialogContentText>
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Button onClick={handleCloseErrorDialog} variant="contained" sx={{ backgroundColor: '#000000', color: '#FFFFFF' }}>
                                Close
                            </Button>
                        </Box>
                    </DialogContent>
                </Dialog>
                <Dialog
                    open={showGoogleDialog}
                    onClose={() => { }}
                    aria-live="polite"
                    sx={{ '& .MuiDialog-paper': { borderRadius: '16px' } }}
                >
                    <DialogTitle>Welcome!</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            You have signed up successfully with Google.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                setShowGoogleDialog(false);
                                const token = localStorage.getItem('googleToken');
                                if (token) {
                                    login(token); // Log in now
                                    localStorage.removeItem('googleToken'); // Clean up
                                    if (role === 'ROLE_ADMIN') navigate('/admin/dashboard');
                                    else if (role === 'ROLE_SELLER') navigate('/product-user/dashboard');
                                    else navigate('/user/dashboard');
                                }
                            }}
                        >
                            Continue
                        </Button>
                    </DialogActions>
                </Dialog>

                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <MuiLink
                        component={RouterLink}
                        to="/login"
                        variant="body2"
                        sx={{
                            color: '#000000',
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' },
                        }}
                    >
                        Already have an account? Login
                    </MuiLink>
                </Box>
            </Box>
        </Container>
    );
};

export default Register;