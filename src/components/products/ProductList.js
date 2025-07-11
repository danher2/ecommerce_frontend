// src/components/ProductList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductService from '../../services/ProductService';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const response = await ProductService.getAllProducts();
            setProducts(response.data);

            // Extract unique categories
            const uniqueCategories = [...new Set(response.data.map(product => product.category))];
            setCategories(uniqueCategories);

            setLoading(false);
        } catch (error) {
            console.error('Error loading products', error);
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (searchTerm.trim()) {
            const response = await ProductService.searchProducts(searchTerm);
            setProducts(response.data);
        } else {
            loadProducts();
        }
    };

    const filterByCategory = async (selectedCategory) => {
        setCategory(selectedCategory);
        if (selectedCategory) {
            const response = await ProductService.getProductsByCategory(selectedCategory);
            setProducts(response.data);
        } else {
            loadProducts();
        }
    };

    const deleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await ProductService.deleteProduct(id);
            loadProducts();
        }
    };

    return (
        <div className="container mt-4">
            <h2>Products</h2>

            <div className="row mb-3">
                <div className="col-md-6">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button
                            className="btn btn-primary"
                            onClick={handleSearch}
                        >
                            Search
                        </button>
                    </div>
                </div>

                <div className="col-md-4">
                    <select
                        className="form-select"
                        value={category}
                        onChange={(e) => filterByCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat, index) => (
                            <option key={index} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="col-md-2">
                    <Link to="/products/add" className="btn btn-success w-100">
                        Add Product
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="text-center">Loading...</div>
            ) : (
                <div className="row">
                    {products.map(product => (
                        <div key={product.id} className="col-md-4 mb-4">
                            <div className="card h-100">
                                {product.imageUrl && (
                                    <img
                                        src={product.imageUrl}
                                        className="card-img-top"
                                        alt={product.name}
                                        style={{ height: "200px", objectFit: "cover" }}
                                    />
                                )}
                                <div className="card-body">
                                    <h5 className="card-title">{product.name}</h5>
                                    <p className="card-text text-muted">{product.category}</p>
                                    <p className="card-text">${product.price}</p>
                                    <div className="d-flex justify-content-between">
                                        <Link to={`/products/${product.id}`} className="btn btn-primary">
                                            Details
                                        </Link>
                                        <Link to={`/products/edit/${product.id}`} className="btn btn-warning">
                                            Edit
                                        </Link>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => deleteProduct(product.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {products.length === 0 && (
                        <div className="col-12 text-center">
                            <p>No products found.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductList;