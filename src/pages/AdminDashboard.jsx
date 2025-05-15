// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUsers, updateUser, addUser, deleteUser } from '../utils/authStorage';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [newUserData, setNewUserData] = useState({
        name: '',
        username: '',
        email: '',
        password: '', // In real app, handle securely
        dateOfBirth: '',
        location: '',
        description: '',
        isAdmin: false
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        const usersData = await getUsers();
        setUsers(usersData);
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
    };

   const handleUpdateUser = async (updatedUser) => {
        const success = await updateUser(updatedUser);
        if (success) {
            setUsers(await getUsers()); // Refresh the user list
            setEditingUser(null);
        } else {
            console.error('Failed to update user.');
        }
    };

    const handleDeleteUser = async (userToDelete) => {
        const success = await deleteUser(userToDelete.email);
        if (success) {
            setUsers(await getUsers()); // Refresh the user list
        } else {
            console.error('Failed to delete user.');
        }
    };

    const handleNewUserChange = (e) => {
        setNewUserData({ ...newUserData, [e.target.name]: e.target.value });
    };

    const handleCreateUser = async () => {
        const success = await addUser(newUserData);
        if (success) {
            setUsers(await getUsers()); // Refresh the user list
            setNewUserData({
                name: '',
                username: '',
                email: '',
                password: '',
                dateOfBirth: '',
                location: '',
                description: '',
                isAdmin: false
            });
        } else {
            console.error('Failed to create user.');
        }
    };

    if (!user || !user.isAdmin) {
        return <div className="text-center py-20">You are not authorized to view this page.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

            {/* Create New User Form */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Create New User</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={newUserData.name}
                    onChange={handleNewUserChange}
                    className="w-full px-4 py-2 border rounded mb-2"
                />
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={newUserData.username}
                    onChange={handleNewUserChange}
                    className="w-full px-4 py-2 border rounded mb-2"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={newUserData.email}
                    onChange={handleNewUserChange}
                    className="w-full px-4 py-2 border rounded mb-2"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={newUserData.password}
                    onChange={handleNewUserChange}
                    className="w-full px-4 py-2 border rounded mb-2"
                />
                <input
                    type="date"
                    name="dateOfBirth"
                    placeholder="Date of Birth"
                    value={newUserData.dateOfBirth}
                    onChange={handleNewUserChange}
                    className="w-full px-4 py-2 border rounded mb-2"
                />
                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={newUserData.location}
                    onChange={handleNewUserChange}
                    className="w-full px-4 py-2 border rounded mb-2"
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={newUserData.description}
                    onChange={handleNewUserChange}
                    className="w-full px-4 py-2 border rounded mb-2"
                />
                <label className="inline-flex items-center">
                    <input
                        type="checkbox"
                        name="isAdmin"
                        checked={newUserData.isAdmin}
                        onChange={(e) => setNewUserData({ ...newUserData, isAdmin: e.target.checked })}
                        className="form-checkbox h-5 w-5 text-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Is Admin</span>
                </label>
                <button onClick={handleCreateUser} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Create User
                </button>
            </div>

            {/* List of Users */}
            <h2 className="text-xl font-semibold mb-2">Manage Users</h2>
            <ul>
                {users.map(user => (
                    <li key={user.email} className="border rounded p-4 mb-2">
                        <div className="flex justify-between items-center">
                            <div>
                                <strong>{user.name}</strong> ({user.email})
                                <p>{user.description}</p>
                            </div>
                            <div>
                                <button onClick={() => handleEditUser(user)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                                    Edit
                                </button>
                                <button onClick={() => handleDeleteUser(user)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Edit User Form */}
            {editingUser && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex justify-center items-center">
                    <div className="bg-white rounded p-8">
                        <h2 className="text-xl font-semibold mb-4">Edit User</h2>
                          <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={editingUser.name}
                            onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                            className="w-full px-4 py-2 border rounded mb-2"
                        />
                        <input
                            type="text"
                            placeholder="Username"
                            value={editingUser.username}
                            onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                            className="w-full px-4 py-2 border rounded mb-2"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={editingUser.email}
                            onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                            className="w-full px-4 py-2 border rounded mb-2"
                        />
                        <input
                            type="date"
                            placeholder="Date of Birth"
                            value={editingUser.dateOfBirth}
                            onChange={(e) => setEditingUser({ ...editingUser, dateOfBirth: e.target.value })}
                            className="w-full px-4 py-2 border rounded mb-2"
                        />
                        <input
                            type="text"
                            placeholder="Location"
                            value={editingUser.location}
                            onChange={(e) => setEditingUser({ ...editingUser, location: e.target.value })}
                            className="w-full px-4 py-2 border rounded mb-2"
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={editingUser.description}
                            onChange={(e) => setEditingUser({ ...editingUser, description: e.target.value })}
                            className="w-full px-4 py-2 border rounded mb-2"
                        />
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                checked={editingUser.isAdmin}
                                onChange={(e) => setEditingUser({ ...editingUser, isAdmin: e.target.checked })}
                                className="form-checkbox h-5 w-5 text-blue-500"
                            />
                            <span className="ml-2 text-gray-700">Is Admin</span>
                        </label>
                        <div className="flex justify-end">
                            <button onClick={() => handleUpdateUser(editingUser)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                                Update
                            </button>
                            <button onClick={() => setEditingUser(null)} className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;