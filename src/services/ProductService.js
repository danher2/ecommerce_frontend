// src/services/ProductService.js
// communicates with product backend API
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/products';

const ProductService = {
    getAllProducts: () => {
        return axios.get(API_URL);
    },

    getProductById: (id) => {
        return axios.get(`${API_URL}/${id}`);
    },

    getProductsByCategory: (category) => {
        return axios.get(`${API_URL}/category/${category}`);
    },

    searchProducts: (keyword) => {
        return axios.get(`${API_URL}/search?keyword=${keyword}`);
    },

    createProduct: (product) => {
        return axios.post(API_URL, product);
    },

    updateProduct: (id, product) => {
        return axios.put(`${API_URL}/${id}`, product);
    },

    deleteProduct: (id) => {
        return axios.delete(`${API_URL}/${id}`);
    }
};

export default ProductService;