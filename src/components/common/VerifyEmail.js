import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText, CircularProgress, Backdrop, Link as MuiLink } from '@mui/material';
import { verifyUser, retryVerificationEmail } from '../../services/api';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const hasProcessed = useRef(false);
    const [emailForRetry, setEmailForRetry] = useState('');
    const [resendAttempts, setResendAttempts] = useState(0);
    const [remainingTime, setRemainingTime] = useState(null);

    const MAX_ATTEMPTS = 3;
    const RESET_DURATION = 3600 * 1000; // 1 hour in milliseconds

    useEffect(() => {
        const token = searchParams.get('token');
        const encodedEmail = searchParams.get('email');
        let email = '';
        try {
            email = atob(decodeURIComponent(encodedEmail)); // Decode Base64 and URL encoding
        } catch (e) {
            console.error('Failed to decode email:', e);
            setError('Invalid email parameter in URL.');
            setIsLoading(false);
            return;
        }

        if (!token || hasProcessed.current) {
            if (!token) {
                setIsLoading(false);
                setError('Missing verification token.');
            }
            return;
        }
        hasProcessed.current = true;
        setEmailForRetry(email || '');

        const verifyEmail = async () => {
            try {
                setMessage('');
                setError('');
                const result = await verifyUser(token);
                console.log('verifyUser response:', result);
                setIsLoading(false);
                if (result.success) {
                    setMessage(result.message || 'Email verified successfully! You can now log in.');
                } else {
                    setEmailForRetry(result.email || emailForRetry);
                    if (result.message.includes('already verified')) {
                        setMessage(result.message);
                    } else {
                        setError(result.message || 'Verification failed');
                    }
                }
            } catch (err) {
                console.error('verifyUser error:', err);
                setIsLoading(false);
                setMessage('');
                const errorMsg = err.response?.data?.message || err.message || 'Verification failed';
                setEmailForRetry(email || err.response?.data?.email || emailForRetry);
                if (err.status === 400) {
                    setError('The verification token has expired or is invalid. Please retry the verification process.');
                } else {
                    setError(errorMsg);
                }
            }
        };

        verifyEmail();
    }, [searchParams]);

    useEffect(() => {
        if (remainingTime > 0) {
            const timer = setInterval(() => {
                setRemainingTime((prev) => {
                    if (prev <= 1) {
                        localStorage.setItem(`resend_${emailForRetry}`, JSON.stringify({ attempts: 0, timestamp: 0 }));
                        setResendAttempts(0);
                        return null;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [remainingTime, emailForRetry]);

    const handleRetryVerification = async () => {
        if (!emailForRetry) {
            setError('Email not available. Please request a new verification email from the registration page.');
            return;
        }
        if (resendAttempts >= MAX_ATTEMPTS) {
            setError(`Maximum retry attempts reached. Please wait ${Math.floor(remainingTime / 60)} minutes before trying again.`);
            return;
        }
        try {
            setIsLoading(true);
            setError('');
            setMessage('');
            await retryVerificationEmail(emailForRetry);
            const newAttempts = resendAttempts + 1;
            setResendAttempts(newAttempts);
            localStorage.setItem(`resend_${emailForRetry}`, JSON.stringify({
                attempts: newAttempts,
                timestamp: resendAttempts === 0 ? Date.now() : JSON.parse(localStorage.getItem(`resend_${emailForRetry}`)).timestamp
            }));
            setMessage('A new verification email has been sent. Please check your inbox or spam folder.');
            hasProcessed.current = true;
        } catch (err) {
            const backendError = err.response?.data?.message || err.message || err.toString();
            setError(backendError);
            console.error('Retry verification error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseError = () => {
        setError('');
    };

    return (
        <Container sx={{ mt: 8, fontFamily: 'Roboto, Arial, sans-serif' }}>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Box sx={{ p: 4, backgroundColor: 'white', borderRadius: '16px', margin: '0 auto', maxWidth: '400px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
                <Typography variant="h6" component="h1" gutterBottom sx={{ color: '#000000', fontWeight: 600 }}>
                    Email Verification
                </Typography>
                <Dialog open={!!message && !isLoading} onClose={() => { }} sx={{ '& .MuiDialog-paper': { borderRadius: '16px' } }} aria-live="polite">
                    <DialogTitle sx={{ color: '#4caf50', textAlign: 'center' }}>
                        Email Verification {message.includes('already verified') ? 'Status' : 'Successful'}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ color: '#000000', textAlign: 'center' }}>
                            {message}
                        </DialogContentText>
                        <Box sx={{ mt: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Button variant="outlined" onClick={() => navigate('/login')} sx={{ borderRadius: '50px', borderColor: '#4caf50', color: '#4caf50', '&:hover': { borderColor: '#388e3c', color: '#388e3c' } }} aria-label="Go to Login Now">
                                Go to Login Now
                            </Button>
                        </Box>
                    </DialogContent>
                </Dialog>
                <Dialog open={!!error && !isLoading} onClose={() => setError('')} sx={{ '& .MuiDialog-paper': { borderRadius: '16px' } }} aria-live="polite">
                    <DialogTitle sx={{ color: '#f44336', textAlign: 'center' }}>
                        Email Verification Failed
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ color: '#000000', textAlign: 'center' }}>
                            {error}
                        </DialogContentText>
                        {resendAttempts > 0 && resendAttempts < MAX_ATTEMPTS && (
                            <Typography variant="body2" sx={{ color: '#000000', textAlign: 'center', mt: 1 }}>
                                {MAX_ATTEMPTS - resendAttempts} retry attempt(s) remaining this hour.
                            </Typography>
                        )}
                        {resendAttempts >= MAX_ATTEMPTS && remainingTime > 0 && (
                            <Typography variant="body2" sx={{ color: '#f44336', textAlign: 'center', mt: 1 }}>
                                Maximum retry attempts reached. Please wait {Math.floor(remainingTime / 60)} minutes and {remainingTime % 60} seconds before trying again.
                            </Typography>
                        )}
                        <Box sx={{ mt: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Button onClick={handleCloseError} variant="contained" sx={{ borderRadius: '50px', backgroundColor: '#000000', color: '#FFFFFF', '&:hover': { backgroundColor: '#4A4A4A' } }} aria-label="Close Error Dialog">
                                Close
                            </Button>
                            {resendAttempts < MAX_ATTEMPTS && (
                                <Typography variant="body2">
                                    <MuiLink component="button" onClick={handleRetryVerification} variant="body2" sx={{ color: '#000000', textDecoration: 'underline', '&:hover': { textDecoration: 'underline' } }} aria-label="Retry Verification">
                                        Retry Verification
                                    </MuiLink>
                                </Typography>
                            )}
                        </Box>
                    </DialogContent>
                </Dialog>
            </Box>
        </Container>
    );
};

export default VerifyEmail;