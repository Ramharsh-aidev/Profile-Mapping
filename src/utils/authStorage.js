// authStorage.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Replace with your backend URL

// Helper functions
export const getUsers = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users`);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
};

export const addUser = async (user) => {
    try {
        await axios.post(`${API_BASE_URL}/users`, user);
        return true;
    } catch (error) {
        console.error('Error adding user:', error);
        return false;
    }
};

export const findUser = async (email, password) => {
    try {
        const users = await getUsers();
        return users.find(user => user.email === email && user.password === password);
    } catch (error) {
        console.error('Error finding user:', error);
        return undefined;
    }
};

export const findUserByEmail = async (email) => {
    try {
        const users = await getUsers();
        return users.find(user => user.email === email);
    } catch (error) {
        console.error('Error finding user by email:', error);
        return undefined;
    }
};

export const updateUser = async (updatedUser) => {
    try {
        await axios.put(`${API_BASE_URL}/users/${updatedUser.email}`, updatedUser);
        return true;
    } catch (error) {
        console.error('Error updating user:', error);
        return false;
    }
};

export const deleteUser = async (email) => {
    try {
        await axios.delete(`${API_BASE_URL}/users/${email}`);
        return true;
    } catch (error) {
        console.error('Error deleting user:', error);
        return false;
    }
};

export const setLoggedInUser = (user) => {
    if (typeof window !== 'undefined') {
        const userToStore = {
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin || false,
            location: user.location,
            description: user.description,
            photoURL: user.photoURL,
            name: user.name,
            dateOfBirth: user.dateOfBirth
        };
        localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(userToStore));
    }
};

export const getLoggedInUser = () => {
    if (typeof window !== 'undefined') {
        const user = localStorage.getItem(LOGGED_IN_USER_KEY);
        return user ? JSON.parse(user) : null;
    }
    return null;
};

export const removeLoggedInUser = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(LOGGED_IN_USER_KEY);
    }
};

const LOGGED_IN_USER_KEY = 'profileExplorerLoggedInUser';