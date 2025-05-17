// src/components/admin/UserList.jsx
import React from 'react';
import { FaEdit, FaTrash, FaUsers } from 'react-icons/fa';

const UserList = ({ users, onEdit, onDelete, currentAdminEmail }) => {
  if (users.length === 0) {
    return <p className="p-6 text-center text-slate-500">No users found. Click "Create New User" to add one.</p>;
  }

  return (
    <div className="bg-white shadow-xl rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-700 flex items-center">
          <FaUsers className="mr-2 text-sky-500" /> User Management
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Username</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {users.map(u => (
              <tr key={u.email} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img className="h-10 w-10 rounded-full object-cover mr-3" src={u.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'N A')}&background=random&color=fff`} alt={u.name} />
                    <div>
                      <div className="text-sm font-medium text-slate-900">{u.name}</div>
                      <div className="text-xs text-slate-500">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">@{u.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${u.isAdmin ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                    {u.isAdmin ? 'Admin' : 'User'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button onClick={() => onEdit(u)} className="text-sky-600 hover:text-sky-800 transition-colors p-1" title="Edit User">
                    <FaEdit className="h-5 w-5" />
                  </button>
                  <button onClick={() => onDelete(u)} disabled={currentAdminEmail === u.email} className={`text-rose-600 hover:text-rose-800 transition-colors p-1 ${currentAdminEmail === u.email ? 'opacity-50 cursor-not-allowed' : ''}`} title="Delete User">
                    <FaTrash className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;