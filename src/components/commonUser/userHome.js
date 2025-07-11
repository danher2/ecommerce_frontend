import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

const UserHome = () => {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Welcome back, Yeeger!
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Recent Activity
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="body1">You recently purchased Nike Airforce Uligh.</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="body1">Check out our new arrivals!</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default UserHome;
