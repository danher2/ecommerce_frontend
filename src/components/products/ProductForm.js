// src/components/ProductForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductService from '../../services/ProductService';

const ProductForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        stock: '',
        category: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEditMode) {
            loadProduct();
        }
    }, [id]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            const response = await ProductService.getProductById(id);
            const product = response.data;
            setFormData({
                name: product.name,
                description: product.description || '',
                price: product.price,
                imageUrl: product.imageUrl || '',
                stock: product.stock,
                category: product.category || ''
            });
            setLoading(false);
        } catch (error) {
            setError('Failed to load product');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            // Convert price to number
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock)
            };

            if (isEditMode) {
                await ProductService.updateProduct(id, productData);
            } else {
                await ProductService.createProduct(productData);
            }

            setLoading(false);
            navigate('/');
        } catch (error) {
            setError('Error saving product');
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2>{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                    />
                </div>

                <div className="row mb-3">
                    <div className="col">
                        <label htmlFor="price" className="form-label">Price</label>
                        <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col">
                        <label htmlFor="stock" className="form-label">Stock</label>
                        <input
                            type="number"
                            className="form-control"
                            id="stock"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="category" className="form-label">Category</label>
                    <input
                        type="text"
                        className="form-control"
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="imageUrl" className="form-label">Image URL</label>
                    <input
                        type="text"
                        className="form-control"
                        id="imageUrl"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <button type="submit" className="btn btn-primary me-2" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Product'}
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate('/')}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;