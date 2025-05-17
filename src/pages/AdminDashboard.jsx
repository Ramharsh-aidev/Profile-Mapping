// src/pages/AdminDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getUsers,
  updateUser as updateStorageUser,
  addUser as addStorageUser,
  deleteUser as deleteStorageUser
} from '../utils/authStorage'; // Ensure this path is correct
import AdminModal from '../components/admin/AdminModal';
import UserForm from '../components/admin/UserForm';
import UserList from '../components/admin/UserList';
import { FaPlus, FaSpinner, FaExclamationCircle, FaUserShield, FaSave } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';
import Header from '../components/layouts/Header';

const AdminDashboard = () => {
    const { user: adminUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null); // User object for edit form
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [formErrors, setFormErrors] = useState({});

    const initialNewUserState = {
        name: '', username: '', email: '', password: '', confirmPassword: '',
        dateOfBirth: '', location: '', description: '', photoURL: '', isAdmin: false
    };
    const [newUserData, setNewUserData] = useState(initialNewUserState);

    const loadUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const usersData = await getUsers();
            setUsers(usersData || []);
        } catch (error) {
            toast.error("Failed to load users.");
            console.error("Error loading users:", error);
        } finally {
            setIsLoading(false);
        }
    }, []); // Empty dependency array: loadUsers function itself doesn't change

    useEffect(() => {
        loadUsers();
    }, [loadUsers]); // Call loadUsers when the component mounts or loadUsers changes (it won't here)

    const validateForm = (data, isEdit = false) => {
        const errors = {};
        if (!data.name?.trim()) errors.name = "Name is required.";
        if (!data.username?.trim()) errors.username = "Username is required.";
        if (!data.email?.trim()) errors.email = "Email is required.";
        else if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = "Email is invalid.";
        
        if (!isEdit) { // Password validation only for new user creation
            if (!data.password) errors.password = "Password is required.";
            else if (data.password.length < 6) errors.password = "Password must be at least 6 characters.";
            if (data.password !== data.confirmPassword) errors.confirmPassword = "Passwords do not match.";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const closeModal = () => {
        setIsCreateModalOpen(false);
        setEditingUser(null);
        setFormErrors({});
    };

    // --- Edit User Logic ---
    const handleOpenEditModal = (userToEdit) => {
        // eslint-disable-next-line no-unused-vars
        const { password, ...editableUser } = userToEdit; // Don't pre-fill password in edit form
        setEditingUser({ ...editableUser, confirmPassword: '' }); // Add confirmPassword for potential future password change logic
        setIsCreateModalOpen(false); // Ensure create modal is closed
        setFormErrors({});
    };
    const handleEditFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditingUser(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };
    const handleUpdateUser = async () => {
        if (!editingUser || !validateForm(editingUser, true)) {
             toast.error("Please correct form errors.", { icon: <FaExclamationCircle/> });
             return;
        }
        try {
            // eslint-disable-next-line no-unused-vars
            const { confirmPassword, ...userToUpdate } = editingUser; // Exclude confirmPassword if not changing password
            const success = await updateStorageUser(userToUpdate);
            if (success) {
                toast.success(`User ${userToUpdate.name} updated successfully!`);
                loadUsers();
                closeModal();
            } else {
                toast.error(`Failed to update user ${userToUpdate.name}.`);
            }
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            toast.error("An error occurred while updating the user.");
        }
    };

    // --- Create User Logic ---
    const handleOpenCreateModal = () => {
        setNewUserData(initialNewUserState);
        setEditingUser(null); // Ensure edit modal is closed
        setIsCreateModalOpen(true);
        setFormErrors({});
    };
    const handleNewUserChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewUserData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };
    const handleCreateUser = async () => {
        if (!validateForm(newUserData)) {
             toast.error("Please correct form errors.", { icon: <FaExclamationCircle/> });
             return;
        }
        try {
            // eslint-disable-next-line no-unused-vars
            const { confirmPassword, ...userToCreate } = newUserData;
            const completeUserToCreate = {
                name: userToCreate.name || '', username: userToCreate.username || '',
                email: userToCreate.email || '', password: userToCreate.password || '',
                dateOfBirth: userToCreate.dateOfBirth || null, location: userToCreate.location || '',
                description: userToCreate.description || '', photoURL: userToCreate.photoURL || '',
                isAdmin: userToCreate.isAdmin || false,
            };
            const addedUser = await addStorageUser(completeUserToCreate);
            if (addedUser) {
                toast.success(`User ${completeUserToCreate.name} created successfully!`);
                loadUsers();
                closeModal();
                setNewUserData(initialNewUserState); // Also reset the new user form data
            } else {
                toast.error('Failed to create user. Email or username might be taken.');
            }
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            toast.error("An error occurred while creating the user.");
        }
    };

    // --- Delete User Logic ---
    const handleDeleteUser = async (userToDelete) => {
        if (window.confirm(`Are you sure you want to delete ${userToDelete.name}?`)) {
            if (adminUser && userToDelete.email === adminUser.email) {
                toast.error("You cannot delete your own admin account.", { icon: <FaUserShield/> });
                return;
            }
            try {
                const success = await deleteStorageUser(userToDelete.email);
                if (success) {
                    toast.success(`User ${userToDelete.name} deleted.`);
                    setUsers(prevUsers => prevUsers.filter(u => u.email !== userToDelete.email));
                } else {
                    toast.error(`Failed to delete user ${userToDelete.name}.`);
                }
            // eslint-disable-next-line no-unused-vars
            } catch (error) {
                toast.error("An error occurred while deleting the user.");
            }
        }
    };

    if (!adminUser || !adminUser.isAdmin) { /* ... (Auth check as before) ... */ }
    if (isLoading) { /* ... (Loading spinner as before) ... */ }

    // Determine modal content and actions
    const isEditMode = !!editingUser;
    const currentFormData = isEditMode ? editingUser : newUserData;
    const currentFormChangeHandler = isEditMode ? handleEditFormChange : handleNewUserChange;
    const currentFormSubmitHandler = isEditMode ? handleUpdateUser : handleCreateUser;
    
    const modalFooterActions = (
        <>
            <button type="button" onClick={closeModal} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"> Cancel </button>
            <button type="button" onClick={currentFormSubmitHandler} className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2">
                <FaSave className="mr-2 inline-block h-4 w-4" /> {isEditMode ? 'Save Changes' : 'Create User'}
            </button>
        </>
    );

    return (
        <>
            <Header />
            <Toaster position="top-center" />
            <div className="min-h-[calc(100vh-8rem)] bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Admin Dashboard</h1>
                        <p className="text-sm text-slate-500">Manage users and application settings.</p>
                    </header>
                    <div className="mb-6 flex justify-end">
                        <button onClick={handleOpenCreateModal} className="inline-flex items-center px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2">
                            <FaPlus className="mr-2 h-4 w-4" /> Create New User
                        </button>
                    </div>
                    
                    <UserList users={users} onEdit={handleOpenEditModal} onDelete={handleDeleteUser} currentAdminEmail={adminUser?.email} />
                </div>

                <AdminModal
                    isOpen={isCreateModalOpen || isEditMode}
                    onClose={closeModal}
                    title={isEditMode ? 'Edit User Profile' : 'Create New User'}
                    footerActions={modalFooterActions}
                >
                    <UserForm
                        data={currentFormData}
                        onChange={currentFormChangeHandler}
                        errors={formErrors}
                        isEdit={isEditMode}
                    />
                </AdminModal>
            </div>
        </>
    );
};

export default AdminDashboard;