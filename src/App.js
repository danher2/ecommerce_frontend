import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    InputBase,
    IconButton,
    Select,
    MenuItem,
    Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Home from './components/common/Home';
import Login from './components/common/Login';
import Register from './components/common/Register';
import VerifyEmail from './components/common/VerifyEmail';
import ForgotPassword from './components/common/ForgotPassword';
import ResetPassword from './components/common/ResetPassword';
import UserDashboard from './components/user/UserDashboard';
import ProductUserDashboard from './components/productUser/ProductUserDashboard';
import ProductList from './components/products/ProductList';
import ProductForm from './components/products/ProductForm';
import ProductDetail from './components/products/ProductDetail';
import Inbox from './components/commonUser/inbox';
import UserHome from './components/commonUser/userHome';
import Notifications from './components/commonUser/Notifications';
import MyShopping from './components/commonUser/myShopping';
import Favorites from './components/commonUser/Favorites';
import MyAccount from './components/commonUser/MyAccount';
import { AuthContext } from './auth/AuthContext';
import PrivateRoute from './auth/PrivateRoute';
import PublicRoute from './auth/PublicRoute';

function App() {
    const { user, role, logout } = useContext(AuthContext); // Added role

    // Added getDefaultPath function to determine redirect based on role
    const getDefaultPath = () => {
        if (!user) return '/login';
        if (role === 'ROLE_ADMIN') return '/admin/dashboard';
        if (role === 'ROLE_SELLER') return '/product-user/dashboard';
        if (role === 'ROLE_USER') return '/user/dashboard';
        return '/';
    };

    return (
        <Router>
            <AppBar position="static" style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
                <Toolbar sx={{ flexWrap: 'wrap', gap: 1 }}>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ fontSize: '1.25rem', mr: 1 }}
                    >
                        <Link to="/" style={{ color: '#000000', textDecoration: 'none' }}>
                            E-Commerce
                        </Link>
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: '25px', padding: '4px 8px', width: '90%' }}>
                            <InputBase
                                placeholder="Search for products"
                                inputProps={{ 'aria-label': 'search' }}
                                style={{ marginLeft: '8px', flex: 1, fontSize: '16px' }}
                            />
                            <Select
                                defaultValue=""
                                style={{ marginLeft: '8px', fontSize: '16px', height: '40px' }}
                            >
                                <MenuItem value="">All Categories</MenuItem>
                                <MenuItem value="electronics">Electronics</MenuItem>
                                <MenuItem value="fashion">Fashion</MenuItem>
                                <MenuItem value="home">Home</MenuItem>
                                <MenuItem value="sports">Sports</MenuItem>
                                <MenuItem value="toys">Toys</MenuItem>
                                <MenuItem value="books">Books</MenuItem>
                            </Select>
                            <IconButton type="submit" aria-label="search" style={{ padding: '8px', color: '#606060' }}>
                                <SearchIcon />
                            </IconButton>
                        </div>
                    </Box>

                    {user ? (
                        <>
                            <IconButton sx={{ padding: '8px' }}>
                                <NotificationsIcon style={{ color: '#000000', fontSize: '24px' }} />
                            </IconButton>
                            <IconButton sx={{ padding: '8px' }}>
                                <ShoppingCartIcon style={{ color: '#000000', fontSize: '24px' }} />
                            </IconButton>
                            <Button
                                component={Link}
                                to="/user/dashboard/home"
                                sx={{ color: '#000000', fontSize: '14px', padding: '8px' }}
                            >
                                Dashboard
                            </Button>
                            <Button
                                onClick={logout}
                                sx={{ color: '#000000', fontSize: '14px', padding: '8px' }}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Button component={Link} to="/login" sx={{ color: '#000000' }}>
                                LOGIN
                            </Button>
                            <Button component={Link} to="/register" sx={{ color: '#000000' }}>
                                REGISTER
                            </Button>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>
            <Container sx={{ px: '2', py: 2 }}>
                <Routes>
                    <Route
                        path="/"
                        element={user ? <Navigate to={getDefaultPath()} replace /> : <Home />}
                    /> {/* Updated to redirect authenticated users */}
                    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                    <Route path="/verify" element={<VerifyEmail />} />
                    <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
                    <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

                    <Route
                        path="/user/dashboard"
                        element={
                            <PrivateRoute requiredRole="ROLE_USER">
                                <UserDashboard />
                            </PrivateRoute>
                        }
                    >
                        <Route path="home" element={<UserHome />} />
                        <Route path="inbox" element={<Inbox />} />
                        <Route path="notifications" element={<Notifications />} />
                        <Route path="my-shopping" element={<MyShopping />} />
                        <Route path="favorites" element={<Favorites />} />
                        <Route path="my-account" element={<MyAccount />} />
                    </Route>

                    <Route
                        path="/product-user/dashboard"
                        element={
                            <PrivateRoute requiredRole="ROLE_SELLER">
                                <ProductUserDashboard />
                            </PrivateRoute>
                        }
                    >
                        <Route path="my-products" element={<ProductList />} />
                        <Route path="manage-products/add" element={<ProductForm />} />
                        <Route path="manage-products/edit" element={<ProductForm />} />
                        <Route path="manage-products/delete" element={<ProductDetail />} />
                        <Route path="view-sales" element={<ProductList />} />
                        <Route path="order-management" element={<ProductList />} />
                        <Route path="analytics" element={<ProductList />} />
                        <Route path="home" element={<UserHome />} />
                        <Route path="inbox" element={<Inbox />} />
                        <Route path="notifications" element={<Notifications />} />
                        <Route path="my-shopping" element={<MyShopping />} />
                        <Route path="favorites" element={<Favorites />} />
                        <Route path="my-account" element={<MyAccount />} />
                    </Route>
                </Routes>
            </Container>
        </Router>
    );
}

export default App;