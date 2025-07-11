import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Dialog, DialogTitle, DialogContent, DialogContentText, CircularProgress, Backdrop } from '@mui/material';
import { resetPassword } from '../../services/api';
import { AuthContext } from '../../auth/AuthContext';

const ResetPassword = () => {
    const { apiLoading, setApiLoading } = useContext(AuthContext);
    const [searchParams] = useSearchParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState(''); // New state for confirm password mismatch
    const [success, setSuccess] = useState(false);
    const [countdown, setCountdown] = useState(10); // 10 seconds countdown
    const navigate = useNavigate();
    const token = searchParams.get('token');

    // Token validation on mount
    useEffect(() => {
        if (!token) {
            setError('Invalid or missing reset token. Please request a new password reset link.');
            setTimeout(() => navigate('/forgot-password'), 3000);
        }
    }, [token, navigate]);

    // Countdown timer effect for success
    useEffect(() => {
        if (success) {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        navigate('/login'); // Redirect when countdown reaches 0
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000); // Update every second

            return () => clearInterval(timer); // Cleanup on unmount
        }
    }, [success, navigate]);

    const validatePassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length < minLength) {
            return `Password must be at least ${minLength} characters long.`;
        }
        if (!hasUpperCase) {
            return 'Password must contain at least one uppercase letter.';
        }
        if (!hasLowerCase) {
            return 'Password must contain at least one lowercase letter.';
        }
        if (!hasNumber) {
            return 'Password must contain at least one number.';
        }
        if (!hasSpecialChar) {
            return 'Password must contain at least one special character (e.g., !@#$%).';
        }
        return '';
    };

    const handleNewPasswordChange = (e) => {
        const value = e.target.value;
        setNewPassword(value);
        setPasswordError(validatePassword(value));
        if (confirmPassword && value !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
        } else {
            setConfirmPasswordError('');
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        if (newPassword && value !== newPassword) {
            setConfirmPasswordError('Passwords do not match');
        } else {
            setConfirmPasswordError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setSuccess(false);
        setConfirmPasswordError(''); // Clear field-level error on submit

        const passwordValidationError = validatePassword(newPassword);
        if (passwordValidationError) {
            setPasswordError(passwordValidationError);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            setApiLoading(true);
            const response = await resetPassword(token, newPassword);
            setMessage(response || 'Your password has been successfully reset.');
            setSuccess(true);
            setCountdown(10); // Reset countdown
        } catch (err) {
            setError(err.response?.data || 'Failed to reset password.');
        } finally {
            setApiLoading(false);
        }
    };

    const handleCloseErrorDialog = () => {
        setError('');
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
                    Reset Password
                </Typography>
                <Typography
                    variant="body2"
                    sx={{ color: '#333333', textAlign: 'center', mb: 3 }}
                >
                    Enter your new password below and confirm it to reset your password.
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="New Password"
                        type="password"
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                        required
                        error={!!passwordError}
                        helperText={passwordError}
                        aria-describedby="new-password-error"
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
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        required
                        error={!!confirmPasswordError}
                        helperText={confirmPasswordError}
                        aria-describedby="confirm-password-error"
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
                    <Box sx={{ position: 'relative' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={apiLoading}
                            aria-label="Reset Password"
                            sx={{
                                mt: 2,
                                borderRadius: '50px',
                                color: '#FFFFFF',
                                backgroundColor: '#000000',
                                '&:hover': { backgroundColor: '#4A4A4A' },
                            }}
                        >
                            Reset Password
                        </Button>
                        {apiLoading && (
                            <CircularProgress
                                size={24}
                                sx={{
                                    color: '#000000',
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    marginTop: '-12px',
                                    marginLeft: '-12px',
                                }}
                            />
                        )}
                    </Box>
                </form>

                {/* Success Dialog */}
                <Dialog open={success} onClose={() => { }} sx={{ '& .MuiDialog-paper': { borderRadius: '16px' } }} aria-live="polite">
                    <DialogTitle sx={{ color: '#4caf50', textAlign: 'center' }}>
                        Password Reset Successful
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ color: '#000000', textAlign: 'center' }}>
                            {message} You will be redirected to the login page.
                        </DialogContentText>
                        <Box sx={{ mt: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Button
                                variant="contained"
                                disabled
                                sx={{
                                    backgroundColor: '#4caf50',
                                    color: '#FFFFFF',
                                    borderRadius: '50px',
                                    '&:hover': { backgroundColor: '#4caf50' },
                                    '&.Mui-disabled': {
                                        backgroundColor: '#4caf50',
                                        color: '#FFFFFF',
                                    },
                                }}
                            >
                                Redirecting to Login in {countdown}s
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/login')}
                                sx={{
                                    borderRadius: '50px',
                                    borderColor: '#4caf50',
                                    color: '#4caf50',
                                    '&:hover': { borderColor: '#388e3c', color: '#388e3c' },
                                }}
                                aria-label="Go to Login Now"
                            >
                                Go to Login Now
                            </Button>
                        </Box>
                    </DialogContent>
                </Dialog>

                {/* Error Dialog */}
                <Dialog open={!!error} onClose={handleCloseErrorDialog} sx={{ '& .MuiDialog-paper': { borderRadius: '16px' } }} aria-live="polite">
                    <DialogTitle sx={{ color: '#f44336', textAlign: 'center' }}>
                        Password Reset Failed
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ color: '#000000', textAlign: 'center' }}>
                            {error}
                        </DialogContentText>
                        <Box sx={{ mt: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                Try again or request a new reset link.
                            </Typography>
                            <Button
                                onClick={() => navigate('/forgot-password')}
                                variant="outlined"
                                sx={{
                                    borderRadius: '50px',
                                    borderColor: '#f44336',
                                    color: '#f44336',
                                    '&:hover': { borderColor: '#d32f2f', color: '#d32f2f' },
                                }}
                                aria-label="Request New Reset Link"
                            >
                                Request New Link
                            </Button>
                            <Button
                                onClick={handleCloseErrorDialog}
                                variant="contained"
                                sx={{
                                    borderRadius: '50px',
                                    backgroundColor: '#000000',
                                    color: '#FFFFFF',
                                    '&:hover': { backgroundColor: '#4A4A4A' },
                                }}
                                aria-label="Close Error Dialog"
                            >
                                Close
                            </Button>
                        </Box>
                    </DialogContent>
                </Dialog>
            </Box>
        </Container>
    );
};

export default ResetPassword;