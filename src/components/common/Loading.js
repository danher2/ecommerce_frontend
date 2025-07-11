import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const LoadingPage = ({ message = 'Loading...' }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh', // Full-page height
                backgroundColor: '#f5f5f5', // Optional background color
            }}
        >
            <CircularProgress size={60} thickness={4} />
            <Box sx={{ marginTop: 2, fontSize: '1.2rem', color: '#555' }}>
                {message}
            </Box>
        </Box>
    );
};

export default LoadingPage;
