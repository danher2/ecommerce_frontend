import axios from 'axios';

const API_URL = 'http://localhost:8080/api';


export const registerUser = async (params) => {
    try {
        const response = await axios.post(
            `${API_URL}/users/register`,
            params // <-- Now this is sent as the JSON body
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};


/**
 * Logs in a user with the given email and password.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<Object>} The response data from the API.
 * @throws Will throw an error if the request fails.
 */
export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/users/login`, {
            email,
            password
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Verifies a user's email with the given token.
 * @param {string} token - The verification token.
 * @returns {Promise<Object>} The response data from the API (includes success, email, and message).
 * @throws Will throw an error if the request fails.
 */
export const verifyUser = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/users/verify`, {
            params: { token }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

/**
 * Requests a password reset for the given email.
 * @param {string} email - The user's email.
 * @returns {Promise<string>} The response message from the API.
 * @throws Will throw an error if the request fails.
 */
export const requestPasswordReset = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/users/request-password-reset`, null, {
            params: { email }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Resets the password with the given token and new password.
 * @param {string} token - The reset token.
 * @param {string} newPassword - The new password.
 * @returns {Promise<string>} The response message from the API.
 * @throws Will throw an error if the request fails.
 */
export const resetPassword = async (token, newPassword) => {
    try {
        const response = await axios.post(`${API_URL}/users/reset-password`, {
            token,
            newPassword
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const resendVerificationEmail = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/users/resend-verification`, {
            email // send email in the body instead of URL
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const retryVerificationEmail = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/users/retry-verification`, {
            email // send in the JSON body, not as URL param
        });
        console.log('retryVerificationEmail response:', response.data);
        return response.data;
    } catch (error) {
        console.error('retryVerificationEmail error:', error.response?.data || error.message);
        throw error.response?.data?.message || error.message || 'Failed to retry verification';
    }
};

/**
 * Registers or logs in a user via Google OAuth.
 * @param {string} idToken - The ID token from Google.
 * @returns {Promise<Object>} The response data from the API (contains JWT token).
 * @throws Will throw an error if the request fails.
 */
export const accessWithGoogle = async (idToken) => {
    try {
        const response = await axios.post(
            `${API_URL}/users/oauth2/google`,
            { idToken }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};
