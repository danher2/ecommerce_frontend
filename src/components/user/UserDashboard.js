import React from 'react';
import { Link, Routes, Route, Outlet } from 'react-router-dom'; // Import routing components
import {
    Typography,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Switch,
    AppBar,
    Toolbar,
} from '@mui/material';
import {
    Storefront as MarketplaceIcon,
    Explore as ExploreIcon,
    Notifications as NotificationsIcon,
    ShoppingCart as ShoppingCartIcon,
    Favorite as FavoriteIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material';
import Inbox from '../commonUser/inbox'; // Import the Inbox component
import UserHome from '../commonUser/userHome'; // Import the UserHome component (if needed)

const drawerWidth = 300;

const UserDashboard = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            {/* Sidebar */}
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        bgcolor: '#fff',
                        borderRight: '1px solid #f0f0f0',
                        padding: 2,
                        marginTop: '64px',
                        height: '90vh',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Box sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#000' }}>
                        Shoe Store
                    </Typography>
                </Box>
                <Divider sx={{ bgcolor: '#f0f0f0' }} />
                <List sx={{ flexGrow: 1 }}>
                    {[
                        { text: 'Home', icon: <MarketplaceIcon />, link: '/user/dashboard/home' },
                        { text: 'Inbox', icon: <ExploreIcon />, link: '/user/dashboard/inbox' },
                        { text: 'Notifications', icon: <NotificationsIcon />, link: '/user/dashboard/notifications' },
                        { text: 'My Shopping', icon: <ShoppingCartIcon />, link: '/user/dashboard/my-shopping' },
                        { text: 'Favorites', icon: <FavoriteIcon />, link: '/user/dashboard/favorites' },
                        { text: 'My Account', icon: <SettingsIcon />, link: '/user/dashboard/my-account' },
                    ].map((item, index) => (
                        <ListItem
                            button
                            key={item.text}
                            component={Link} // Use Link for navigation
                            to={item.link} // Specify the route
                            sx={{
                                borderRadius: 2,
                                mb: 1,
                                bgcolor: item.text === 'Home' ? '#f5f7fa' : 'transparent',
                                '&:hover': { bgcolor: '#f5f7fa' },
                            }}
                        >
                            <ListItemIcon sx={{ color: item.text === 'Home' ? '#1976d2' : '#606060' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} sx={{ color: '#000' }} />
                        </ListItem>
                    ))}
                </List>
                <Box sx={{ mt: 'auto', p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Light Mode</Typography>
                        <Switch color="primary" />
                    </Box>
                    <Typography variant="caption" sx={{ color: '#a0a0a0' }}>
                        ©2022 Shoe Store, All rights reserved
                    </Typography>
                </Box>
            </Drawer>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    minHeight: '100vh',
                    borderRadius: '20px 0 0 20px',
                }}
            >
                <Outlet /> {/* Render child routes here */} 
            </Box>
        </Box>
    );
};

export default UserDashboard;
