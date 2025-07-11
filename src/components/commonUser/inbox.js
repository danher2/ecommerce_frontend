import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const Inbox = () => {
    const messages = [
        { subject: 'Order Shipped', sender: 'Shoe Store', timestamp: '2 hours ago' },
        { subject: 'New Arrivals', sender: 'Shoe Store', timestamp: '1 day ago' },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Inbox
            </Typography>
            <List>
                {messages.map((message, index) => (
                    <ListItem key={index}>
                        <ListItemText
                            primary={message.subject}
                            secondary={`${message.sender} - ${message.timestamp}`}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default Inbox;
