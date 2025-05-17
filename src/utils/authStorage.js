// src/utils/authStorage.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Your backend URL
const LOGGED_IN_USER_KEY = 'profileExplorerLoggedInUser_v2'; // Changed key to avoid old data conflicts

// --- Client-Side Session Management (localStorage) ---
export const setLoggedInUser = (user) => { // User object from API (excluding password)
    if (typeof window !== 'undefined') {
        try {
            // Ensure we don't store sensitive info like password or tokens if not needed for display
            const userToStore = {
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin || false,
                name: user.name,
                photoURL: user.photoURL,
                // Add other details you want to quickly access from the "session"
            };
            localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(userToStore));
        } catch (error) {
            console.error("Error setting loggedInUser in localStorage:", error);
        }
    }
};

export const getLoggedInUser = () => {
    if (typeof window !== 'undefined') {
        try {
            const userJson = localStorage.getItem(LOGGED_IN_USER_KEY);
            return userJson ? JSON.parse(userJson) : null;
        } catch (error) {
            console.error("Error getting loggedInUser from localStorage:", error);
            localStorage.removeItem(LOGGED_IN_USER_KEY); // Clear potentially corrupted data
            return null;
        }
    }
    return null;
};

export const removeLoggedInUser = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(LOGGED_IN_USER_KEY);
    }
};


// --- API Interaction Functions ---

// LOGIN: Calls the backend /auth/login endpoint
export const loginUserApi = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
        return response.data; // Expected: { message: '...', user: {...} /*, token: '...' */ }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Login request failed.' };
    }
};

// SIGNUP (Add User via API)
export const addUser = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/users`, userData);
        return { success: true, user: response.data.user }; // Backend returns created user
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Signup failed.' };
    }
};

// GET ALL USERS (for Admin Dashboard)
export const getUsers = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users`);
        return response.data; // Backend already strips passwords
    } catch (error) {
        console.error('Error fetching users from API:', error);
        return [];
    }
};

// FIND USER BY EMAIL (for Signup validation - might be inefficient, consider dedicated backend check)
export const findUserByEmail = async (email) => {
    try {
        const users = await getUsers(); // Fetches all public user data
        return users.find(user => user.email === email);
    } catch (error) {
        console.error('Error finding user by email via API:', error);
        return undefined; // Or null
    }
};

// UPDATE USER (for Admin Dashboard to update any user via API)
export const updateUser = async (updatedUserData) => {
    try {
        // Backend /users/:email PUT endpoint handles this for admin
        // Ensure your backend /users/:email can handle admin updates correctly
        const response = await axios.put(`${API_BASE_URL}/users/${updatedUserData.email}`, updatedUserData);
        return { success: true, user: response.data.user }; // Assuming backend returns updated user
    } catch (error) {
        console.error('Error updating user via API:', error);
        return { success: false, message: error.response?.data?.message || 'Update failed.' };
    }
};

// DELETE USER (for Admin Dashboard via API)
export const deleteUser = async (email) => {
    try {
        // Backend /admin/users/:email DELETE endpoint handles this
        await axios.delete(`${API_BASE_URL}/admin/users/${email}`); // Use admin endpoint
        return true;
    } catch (error) {
        console.error('Error deleting user via API:', error);
        return false;
    }
};