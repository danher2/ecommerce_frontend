import React from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Button,
    InputBase,
    IconButton,
    Container,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';

// Styled Search Bar
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: 50, // Rounded for a modern look
    backgroundColor: alpha(theme.palette.grey[200], 0.5),
    '&:hover': {
        backgroundColor: alpha(theme.palette.grey[300], 0.7),
    },
    width: '100%',
    maxWidth: '500px',
    margin: '0 auto',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease-in-out',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.grey[600],
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: theme.palette.text.primary,
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1.5, 1.5, 1.5, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        fontSize: '1rem',
        fontWeight: 400,
    },
}));

const categories = [
    { name: 'Electronics', image: 'https://www.arkema.com/files/live/sites/shared_arkema/files/images/markets/Electronics%20electrical/electronics.jpg', link: '/category/electronics' },
    { name: 'Fashion', image: 'https://images.squarespace-cdn.com/content/v1/575085fa859fd016768e7b48/1537056977508-LHTYR7I5VB471VEA3AT0/figure4.jpg', link: '/category/fashion' },
    { name: 'Home', image: 'https://hips.hearstapps.com/hmg-prod/images/edc050124lavonne-extras-004-662810f9ae321.jpg?crop=0.7846938775510204xw:1xh;center,top&resize=1120:*', link: '/category/home' },
    { name: 'Sports', image: 'https://www.retailtouchpoints.com/wp-content/uploads/2022/07/VegasSports-17.jpg', link: '/category/sports' },
    { name: 'Toys', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9Uk_5jeNuZqmqPMnMWLRqq4lKf4oiPS8bmg&s', link: '/category/toys' },
    { name: 'Books', image: 'https://prh.imgix.net/articles/top10-fiction-1600x800.jpg', link: '/category/books' },
];

const Home = () => {
    return (
        <Box sx={{ fontFamily: 'Roboto, Arial, sans-serif', bgcolor: '#fff', minHeight: '100vh' }}>
           

            {/* Categories Section */}
            <Container sx={{ py: 6 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 600,
                        mb: 5,
                        textAlign: 'center',
                        color: '#1a1a1a',
                        letterSpacing: '0.5px',
                    }}
                >
                    Explore Our Categories
                </Typography>
                <Grid container spacing={3}>
                    {categories.map((category) => (
                        <Grid item xs={12} sm={6} md={4} key={category.name}>
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                                    transition: 'all 0.3s ease-in-out',
                                    bgcolor: '#fff',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                                    },
                                }}
                                component={Link}
                                to={category.link}
                                style={{ textDecoration: 'none' }}
                            >
                                <CardMedia
                                    component="img"
                                    height="180"
                                    image={category.image}
                                    alt={category.name}
                                    sx={{
                                        objectFit: 'cover',
                                        borderTopLeftRadius: 12,
                                        borderTopRightRadius: 12,
                                        transition: 'opacity 0.3s ease-in-out',
                                        '&:hover': {
                                            opacity: 0.9,
                                        },
                                    }}
                                />
                                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 500,
                                            color: '#1a1a1a',
                                            mb: 1,
                                            letterSpacing: '0.3px',
                                        }}
                                    >
                                        {category.name}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: '#606060',
                                            fontWeight: 400,
                                        }}
                                    >
                                        Discover Now
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Trust Signals */}
            <Box sx={{ py: 3, bgcolor: '#f9f9f9', textAlign: 'center', borderTop: '1px solid #f0f0f0' }}>
                <Typography variant="body2" sx={{ color: '#606060', fontWeight: 400 }}>
                    Free Shipping on Orders Over $50 | 30-Day Returns | 24/7 Customer Support
                </Typography>
            </Box>
        </Box>
    );
};

export default Home;