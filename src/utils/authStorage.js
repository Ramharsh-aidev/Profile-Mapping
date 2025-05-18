// src/utils/authStorage.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Your backend URL
const LOGGED_IN_USER_KEY = 'profileExplorerLoggedInUser_v2';

// --- Client-Side Session Management (localStorage) ---
export const setLoggedInUser = (user) => {
    if (typeof window !== 'undefined') {
        try {
            const userToStoreInLocalStorage = {
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin || false,
                name: user.name,
                photoURL: user.photoURL,
            };
            Object.keys(userToStoreInLocalStorage).forEach(key => {
                if (userToStoreInLocalStorage[key] === undefined) {
                    userToStoreInLocalStorage[key] = (key === 'isAdmin') ? false : '';
                }
            });
            localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(userToStoreInLocalStorage));
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
            localStorage.removeItem(LOGGED_IN_USER_KEY);
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

export const loginUserApi = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
        return response.data; 
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Login request failed.' };
    }
};

export const addUser = async (userData) => { // User Signup
    try {
        const response = await axios.post(`${API_BASE_URL}/users`, userData);
        return { success: true, user: response.data.user };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Signup failed.' };
    }
};

export const getUsers = async () => { // For admin views typically (gets all public user data)
    try {
        // The current server.js /users GET endpoint is public.
        const adminUserEmail = getLoggedInUser()?.email; // Check if admin is logged in
        const headers = {};
        if (adminUserEmail) { // If you want to send auth header for admin specific fetch all.
        }
        const response = await axios.get(`${API_BASE_URL}/users`, { headers });
        return response.data;
    } catch (error) {
        console.error('Error fetching users from API:', error);
        return [];
    }
};

export const findUserByEmail = async (email) => { // Used for signup validation
    try {
        const users = await getUsers();
        return users.find(user => user.email === email);
    } catch (error) {
        console.error('Error finding user by email via API:', error);
        return undefined;
    }
};

// For logged-in user to update their own profile
export const updateMyProfileInfo = async (profileData) => {
    try {
        const currentUserEmail = getLoggedInUser()?.email;
        if (!currentUserEmail) throw new Error("User not authenticated for profile update.");

        const response = await axios.put(`${API_BASE_URL}/me/profile-info`, profileData, {
            headers: { 'x-user-email': currentUserEmail } 
        });
        return { success: true, user: response.data.user };
    } catch (error) {
        console.error('Error updating user profile via API:', error);
        return { success: false, message: error.response?.data?.message || 'Profile update failed.' };
    }
};


// ** RENAMED FUNCTION FOR ADMIN **
// For Admin to update any user. Requires admin authentication.
export const updateUser = async (userEmailToUpdate, updatedUserData) => {
    try {
        const adminUserEmail = getLoggedInUser()?.email; 
        if (!adminUserEmail) throw new Error("Admin not authenticated for user update.");

        // The backend route for admin updating a specific user is /admin/users/:email
        const response = await axios.put(`${API_BASE_URL}/admin/users/${userEmailToUpdate}`, updatedUserData, {
            headers: { 'x-user-email': adminUserEmail }
        });
        return { success: true, user: response.data.user };
    } catch (error) {
        console.error('Error (admin) updating user via API:', error);
        return { success: false, message: error.response?.data?.message || 'Admin update failed.' };
    }
};

// ** RENAMED FUNCTION FOR ADMIN **
// For Admin to delete a user. Requires admin authentication.
export const deleteUser = async (userEmailToDelete) => {
    try {
        const adminUserEmail = getLoggedInUser()?.email; 
        if (!adminUserEmail) throw new Error("Admin not authenticated for user deletion.");
        
        // The backend route for admin deleting a user is /admin/users/:email
        const response = await axios.delete(`${API_BASE_URL}/admin/users/${userEmailToDelete}`, {
             headers: { 'x-user-email': adminUserEmail }
        });
        return { success: true, message: response.data.message };
    } catch (error) {
        console.error('Error (admin) deleting user via API:', error);
        return { success: false, message: error.response?.data?.message || 'Admin deletion failed.' };
    }
};

// GET PUBLIC USER PROFILE BY USERNAME
export const getPublicUserProfileByUsername = async (username) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users/username/${username}`);
        return { success: true, profile: response.data }; 
    } catch (error) {
        console.error(`Error fetching public profile for ${username}:`, error);
        return { 
            success: false, 
            message: error.response?.data?.message || 'Failed to fetch user profile.',
            status: error.response?.status 
        };
    }
};