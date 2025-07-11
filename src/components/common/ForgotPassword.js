import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Alert, CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText } from '@mui/material';
import { requestPasswordReset } from '../../services/api';
import { AuthContext } from '../../auth/AuthContext';

const ForgotPassword = () => {
    const { apiLoading, setApiLoading } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [countdown, setCountdown] = useState(10); // 6 seconds countdown
    const navigate = useNavigate();

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setSuccess(false);

        try {
            setApiLoading(true);
            const response = await requestPasswordReset(email);
            setSuccess(true);
            setCountdown(10); // Reset countdown
        } catch (err) {
            setError(err.response?.data || 'Failed to send password reset email.');
        } finally {
            setApiLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8, fontFamily: 'Roboto, Arial, sans-serif' }}>
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
                    Forgot Password
                </Typography>
                <Typography
                    variant="body2"
                    sx={{ color: '#333333', textAlign: 'center', mb: 3 }}
                >
                    Enter the email address associated with your account below. We'll send you a link to reset your password. Please check your inbox (and spam/junk folder) for the email.
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
                    <Box sx={{ position: 'relative' }}>
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
                            Send Reset Link
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
                <Dialog open={success} onClose={() => { }} sx={{ '& .MuiDialog-paper': { borderRadius: '16px' } }}>
                    <DialogTitle sx={{ color: '#4caf50', textAlign: 'center' }}>
                        Password Reset Initiated
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ color: '#000000', textAlign: 'center' }}>
                            Password reset email sent! Please check your inbox (and spam/junk folder) for the link to reset your password.
                        </DialogContentText>
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Button
                                variant="contained"
                                disabled
                                sx={{
                                    backgroundColor: '#4caf50', // Green background
                                    color: '#FFFFFF', // White text
                                    borderRadius: '50px',
                                    '&:hover': { backgroundColor: '#4caf50' }, // No hover change
                                    '&.Mui-disabled': {
                                        backgroundColor: '#4caf50', // Ensure green even when disabled
                                        color: '#FFFFFF', // Ensure white text when disabled
                                    },
                                }}
                            >
                                Redirecting to Login in {countdown}s
                            </Button>
                        </Box>
                    </DialogContent>
                </Dialog>
            </Box>
        </Container>
    );
};

export default ForgotPassword;