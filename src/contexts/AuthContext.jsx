import React, { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types'; // Make sure prop-types is installed
import { getLoggedInUser, setLoggedInUser, removeLoggedInUser, findUser, addUser, findUserByEmail, updateUser, deleteUser } from '../utils/authStorage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // null or { username, email, isAdmin }
    const [loading, setLoading] = useState(true); // To handle initial loading from storage

    useEffect(() => {
        // Check storage for logged-in user on mount
        const storedUser = getLoggedInUser();
        if (storedUser) {
            setUser(storedUser);
        }
        setLoading(false); // Finished checking storage
    }, []);

    const login = async (email, password) => {
        const foundUser = await findUser(email, password);
        if (foundUser) {
            setLoggedInUser(foundUser);
            setUser({
                username: foundUser.username,
                email: foundUser.email,
                isAdmin: foundUser.isAdmin || false,
                location: foundUser.location,
                description: foundUser.description,
                photoURL: foundUser.photoURL,
                name: foundUser.name,
                dateOfBirth: foundUser.dateOfBirth,
            });
            return { success: true, user: foundUser };
        } else {
            return { success: false, message: 'Invalid email or password.' };
        }
    };

    const signup = async (username, email, password, confirmPassword, location, description, photoURL, name, dateOfBirth, isAdmin = false) => {
        // Basic validation
        if (!username || !email || !password || !confirmPassword || !location || !name || !dateOfBirth) {
            return { success: false, message: 'All fields are required.' };
        }
        if (password !== confirmPassword) {
            return { success: false, message: 'Passwords do not match.' };
        }
        if (password.length < 6) { // Simple password length check
            return { success: false, message: 'Password must be at least 6 characters long.' };
        }
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return { success: false, message: 'Email address is already registered.' };
        }

        const newUser = {
            username,
            email,
            password,
            isAdmin,
            location,
            description,
            photoURL,
            name,
            dateOfBirth
        };
        const added = await addUser(newUser);

        if (added) {
            // Auto-login the user after signup (optional)
            setLoggedInUser(newUser);
            setUser({
                username: newUser.username,
                email: newUser.email,
                isAdmin: newUser.isAdmin || false,
                location: newUser.location,
                description: newUser.description,
                photoURL: newUser.photoURL,
                name: newUser.name,
                dateOfBirth: newUser.dateOfBirth,
            });
            return { success: true, user: newUser };
        } else {
            // This case should technically be caught by findUserByEmail, but included as a fallback
            return { success: false, message: 'Could not register user.' };
        }
    };


    const logout = () => {
        removeLoggedInUser();
        setUser(null);
    };

    const updateProfile = async (updatedUser) => {
        const success = await updateUser(updatedUser); // Assume this function exists in authStorage
        if (success) {
            setLoggedInUser(updatedUser);
            setUser({
                username: updatedUser.username,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin || false,
                location: updatedUser.location,
                description: updatedUser.description,
                photoURL: updatedUser.photoURL,
                name: updatedUser.name,
                dateOfBirth: updatedUser.dateOfBirth,
                            });
            return { success: true };
        } else {
            return { success: false, message: 'Could not update profile.' };
        }
    };


    const deleteAccount = async (email) => {
        const success = await deleteUser(email);
        if (success) {
            removeLoggedInUser();
            setUser(null);
            return { success: true };
        } else {
            return { success: false, message: 'Could not delete account.' };
        }
    };


    const isAdmin = user ? user.isAdmin : false;

    return (
        <AuthContext.Provider value={{ user, isAdmin, login, signup, logout, loading, updateProfile, deleteAccount }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// Custom hook to use the AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};