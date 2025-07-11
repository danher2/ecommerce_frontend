// src/components/ProductDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ProductService from '../../services/ProductService';



const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadProduct();
    }, []);

    const loadProduct = async () => {
        try {
            setLoading(true);
            const response = await ProductService.getProductById(id);
            setProduct(response.data);
            setLoading(false);
        } catch (error) {
            setError('Failed to load product details');
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await ProductService.deleteProduct(id);
                navigate('/');
            } catch (error) {
                setError('Failed to delete product');
            }
        }
    };

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (error) return <div className="alert alert-danger mt-3">{error}</div>;
    if (!product) return <div className="alert alert-warning mt-3">Product not found</div>;

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-6">
                    {product.imageUrl ? (
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="img-fluid rounded"
                            style={{ maxHeight: "400px", objectFit: "contain" }}
                        />
                    ) : (
                        <div className="bg-light text-center p-5 rounded">
                            <i className="bi bi-image" style={{ fontSize: "3rem" }}></i>
                            <p>No image available</p>
                        </div>
                    )}
                </div>

                <div className="col-md-6">
                    <h2>{product.name}</h2>
                    <div className="badge bg-secondary mb-3">{product.category}</div>

                    <h4 className="mt-3">${product.price}</h4>

                    <div className="mt-3">
                        <span className={product.stock > 0 ? "text-success" : "text-danger"}>
                            {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                        </span>
                    </div>

                    <div className="mt-4">
                        <h5>Description</h5>
                        <p>{product.description || "No description available"}</p>
                    </div>

                    <div className="mt-4">
                        <Link to={`/products/edit/${product.id}`} className="btn btn-warning me-2">
                            Edit Product
                        </Link>
                        <button onClick={handleDelete} className="btn btn-danger me-2">
                            Delete
                        </button>
                        <Link to="/" className="btn btn-secondary">
                            Back to Products
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;