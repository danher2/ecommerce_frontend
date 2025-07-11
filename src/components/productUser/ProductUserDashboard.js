import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import {
    Typography,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Collapse,
    Switch,
} from '@mui/material';
import {
    Storefront as MarketplaceIcon,
    Explore as ExploreIcon,
    Notifications as NotificationsIcon,
    ShoppingCart as ShoppingCartIcon,
    Favorite as FavoriteIcon,
    Settings as SettingsIcon,
    Inventory as ManageProductsIcon,
    BarChart as AnalyticsIcon,
    Assignment as OrderManagementIcon,
    AttachMoney as ViewSalesIcon,
    ExpandLess,
    ExpandMore,
} from '@mui/icons-material';

const drawerWidth = 300;

const ProductUserDashboard = () => {
    const [openManageProducts, setOpenManageProducts] = useState(false);

    const handleManageProductsClick = () => {
        setOpenManageProducts(!openManageProducts);
    };

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
                        Seller Dashboard
                    </Typography>
                </Box>
                <List sx={{ flexGrow: 1 }}>
                    {/* User Options */}
                    {[
                        { text: 'Home', icon: <MarketplaceIcon />, link: '/product-user/dashboard/home' },
                        { text: 'Inbox', icon: <ExploreIcon />, link: '/product-user/dashboard/inbox' },
                        { text: 'Notifications', icon: <NotificationsIcon />, link: '/product-user/dashboard/notifications' },
                        { text: 'My Shopping', icon: <ShoppingCartIcon />, link: '/product-user/dashboard/my-shopping' },
                        { text: 'Favorites', icon: <FavoriteIcon />, link: '/product-user/dashboard/favorites' },
                        { text: 'My Products', icon: <ManageProductsIcon />, link: '/product-user/dashboard/my-products' }

                    ].map((item) => (
                        <ListItem
                            button
                            key={item.text}
                            component={Link}
                            to={item.link}
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

                    {/* Manage Products Dropdown */}
                    <ListItem
                        button
                        onClick={handleManageProductsClick}
                        sx={{
                            borderRadius: 2,
                            mb: 1,
                            '&:hover': { bgcolor: '#f5f7fa' },
                        }}
                    >
                        <ListItemIcon sx={{ color: '#606060' }}>
                            <ManageProductsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Manage Products" sx={{ color: '#000' }} />
                        {openManageProducts ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={openManageProducts} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {[
                                { text: 'Add Product', link: '/product-user/dashboard/manage-products/add' },
                                { text: 'Edit Product', link: '/product-user/dashboard/manage-products/edit' },
                                { text: 'Delete Product', link: '/product-user/dashboard/manage-products/delete' },
                            ].map((item) => (
                                <ListItem
                                    button
                                    key={item.text}
                                    component={Link}
                                    to={item.link}
                                    sx={{
                                        pl: 4,
                                        borderRadius: 2,
                                        mb: 1,
                                        '&:hover': { bgcolor: '#f5f7fa' },
                                    }}
                                >
                                    <ListItemText primary={item.text} sx={{ color: '#000' }} />
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>

                    {/* Seller Options */}
                    {[
                        { text: 'View Sales', icon: <ViewSalesIcon />, link: '/product-user/dashboard/view-sales' },
                        { text: 'Order Management', icon: <OrderManagementIcon />, link: '/product-user/dashboard/order-management' },
                        { text: 'Analytics', icon: <AnalyticsIcon />, link: '/product-user/dashboard/analytics' },
                    ].map((item) => (
                        <ListItem
                            button
                            key={item.text}
                            component={Link}
                            to={item.link}
                            sx={{
                                borderRadius: 2,
                                mb: 1,
                                '&:hover': { bgcolor: '#f5f7fa' },
                            }}
                        >
                            <ListItemIcon sx={{ color: '#606060' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} sx={{ color: '#000' }} />
                        </ListItem>
                    ))}

                    {/* My Account at the End */}
                    <ListItem
                        button
                        component={Link}
                        to="/product-user/dashboard/my-account"
                        sx={{
                            borderRadius: 2,
                            mb: 1,
                            '&:hover': { bgcolor: '#f5f7fa' },
                        }}
                    >
                        <ListItemIcon sx={{ color: '#606060' }}>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary="My Account" sx={{ color: '#000' }} />
                    </ListItem>
                </List>
                <Box sx={{ mt: 'auto', p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Light Mode</Typography>
                        <Switch color="primary" />
                    </Box>
                    <Typography variant="caption" sx={{ color: '#a0a0a0' }}>
                        ©2022 Seller Dashboard, All rights reserved
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

export default ProductUserDashboard;
