// src/components/ui/UserDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Adjust path as necessary
import { FaUserCircle, FaSignOutAlt, FaEdit, FaIdBadge } from 'react-icons/fa';

const UserDropdown = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
      navigate('/'); // Navigate to home after logout
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle logout error (e.g., show a toast)
    }
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user) {
    return null; // Don't render anything if no user is logged in
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Menu Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        <span className="sr-only">Open user menu</span>
        <img
          className="h-9 w-9 rounded-full object-cover border-2 border-transparent hover:border-sky-300 transition-all"
          src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.username || 'U')}&background=0ea5e9&color=fff&size=36&bold=true`}
          alt="User avatar"
        />
        <span className="hidden md:block ml-2 text-slate-700 font-medium text-sm hover:text-sky-600 transition-colors">
          {user.name || user.username}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-60 rounded-xl shadow-2xl bg-white 
                     border border-slate-200/70 focus:outline-none py-1 z-50
                     transition-all duration-150 ease-out"
          role="menu"
          aria-orientation="vertical"
        >
          {/* User Info Header in Dropdown */}
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-sm font-medium text-slate-800 truncate">{user.name || user.username}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>

          {/* Menu Items Section */}
          <div className="px-1 py-1"> {/* Padding for the group of items */}
            <Link
              to={`/profiles/${encodeURIComponent(user.username || '')}`}
              onClick={() => setIsDropdownOpen(false)}
              className="flex items-center w-full px-3 py-2 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-600 rounded-md transition-colors no-underline"
              role="menuitem"
            >
              <FaIdBadge className="mr-3 h-5 w-5 text-slate-400" />
              My Public Profile
            </Link>
            <Link
              to="/dashboard/edit-profile"
              onClick={() => setIsDropdownOpen(false)}
              className="flex items-center w-full px-3 py-2 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-600 rounded-md transition-colors no-underline"
              role="menuitem"
            >
              <FaEdit className="mr-3 h-5 w-5 text-slate-400" />
              Edit Profile
            </Link>
            {user.isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center w-full px-3 py-2 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-600 rounded-md transition-colors no-underline"
                role="menuitem"
              >
                <FaUserCircle className="mr-3 h-5 w-5 text-slate-400" />
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* Sign Out Section */}
          <div className="border-t border-slate-100 px-1 py-1"> {/* Padding for the group */}
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors no-underline"
              role="menuitem"
            >
              <FaSignOutAlt className="mr-3 h-5 w-5" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;