// src/components/layouts/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../ui/Button'; // Adjust path if necessary
import { useAuth } from '../../contexts/AuthContext'; // Using your custom hook
import { FaBell, FaUserCircle, FaSignOutAlt, FaEdit, FaIdBadge, FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa'; // Added icons

const Header = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') { // Check if window is defined (for SSR/build)
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark';
    }
    return false; // Default to light theme if window is not available
  });

  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);


  // Dark mode effect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleDropdown = () => setIsDropdownOpen(prev => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false); // Close dropdown on logout
      setIsMobileMenuOpen(false); // Close mobile menu if open
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Close dropdown/mobile menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('button[aria-label="Toggle mobile menu"]')) {
        // Check if click is outside and not on the toggle button itself
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const UserMenuButton = () => (
    <button
      onClick={toggleDropdown}
      className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-800"
      aria-expanded={isDropdownOpen}
      aria-haspopup="true"
    >
      <span className="sr-only">Open user menu</span>
      <img
        className="h-8 w-8 rounded-full object-cover"
        src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || user?.username || 'U')}&background=random&color=fff&size=32`}
        alt="User avatar"
      />
      <span className="hidden md:block ml-2 text-gray-700 dark:text-slate-200 font-medium text-sm">
        {user?.name || user?.username}
      </span>
    </button>
  );

  const DropdownMenu = () => (
    <div
      className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-xl bg-white dark:bg-slate-700 ring-1 ring-black dark:ring-slate-600 ring-opacity-5 focus:outline-none py-1 z-50" // Added z-50
      role="menu"
      aria-orientation="vertical"
    >
      <Link
        to={`/profiles/${encodeURIComponent(user?.username || '')}`}
        onClick={() => {setIsDropdownOpen(false); setIsMobileMenuOpen(false);}}
        className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 w-full text-left"
        role="menuitem"
      >
        <FaIdBadge className="mr-3 h-5 w-5 text-slate-500 dark:text-slate-400" />
        My Public Profile
      </Link>
      <Link
        to="/dashboard/edit-profile"
        onClick={() => {setIsDropdownOpen(false); setIsMobileMenuOpen(false);}}
        className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 w-full text-left"
        role="menuitem"
      >
        <FaEdit className="mr-3 h-5 w-5 text-slate-500 dark:text-slate-400" />
        Edit Profile
      </Link>
      {user?.isAdmin && (
         <Link
          to="/admin"
          onClick={() => {setIsDropdownOpen(false); setIsMobileMenuOpen(false);}}
          className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 w-full text-left"
          role="menuitem"
        >
          <FaUserCircle className="mr-3 h-5 w-5 text-slate-500 dark:text-slate-400" />
          Admin Dashboard
        </Link>
      )}
      <button
        onClick={handleLogout}
        className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-600 w-full text-left"
        role="menuitem"
      >
        <FaSignOutAlt className="mr-3 h-5 w-5" />
        Sign out
      </button>
    </div>
  );

  const AuthButtons = () => (
    <>
      <Link to="/login">
        <Button variant="outline" className="hidden sm:block px-4 py-2 text-sm">Sign In</Button>
      </Link>
      <Link to="/signup">
        <Button variant="primary" className="px-4 py-2 text-sm">Sign Up</Button>
      </Link>
    </>
  );

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-50"> {/* Increased z-index */}
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo/Site Name */}
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-gray-800 dark:text-slate-100">Profile Explorer</Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Home</Link>
          <Link to="/profiles" className="text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Profiles</Link>
        </nav>

        {/* Right side: Theme Toggle, Notifications, User Menu/Login */}
        <div className="flex items-center space-x-2 sm:space-x-3">
           <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
            </button>

          {authLoading ? (
            <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
          ) : user ? (
            <>
              {/* Notification Icon (Desktop) - Placeholder */}
              <button className="hidden sm:block p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none">
                <FaBell className="h-5 w-5" />
              </button>
              {/* User Menu (Desktop) */}
              <div className="hidden md:relative md:block" ref={dropdownRef}>
                <UserMenuButton />
                {isDropdownOpen && <DropdownMenu />}
              </div>
            </>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <AuthButtons />
            </div>
          )}
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Area */}
      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-800 shadow-lg pb-4 z-40"> {/* Adjusted z-index */}
          <nav className="flex flex-col space-y-2 px-4 pt-2">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 block px-3 py-2 rounded-md text-base font-medium">Home</Link>
            <Link to="/profiles" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 block px-3 py-2 rounded-md text-base font-medium">Profiles</Link>
            {/* User-specific links for mobile */}
            {user && (
              <>
                <hr className="border-slate-200 dark:border-slate-700 my-1"/>
                <Link
                    to={`/profiles/${encodeURIComponent(user.username || '')}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 w-full text-left rounded-md"
                    >
                    <FaIdBadge className="mr-3 h-5 w-5 text-slate-500 dark:text-slate-400" />
                    My Public Profile
                </Link>
                <Link
                    to="/dashboard/edit-profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 w-full text-left rounded-md"
                    >
                    <FaEdit className="mr-3 h-5 w-5 text-slate-500 dark:text-slate-400" />
                    Edit Profile
                </Link>
                 {user.isAdmin && (
                    <Link
                        to="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 w-full text-left rounded-md"
                        >
                        <FaUserCircle className="mr-3 h-5 w-5 text-slate-500 dark:text-slate-400" />
                        Admin Dashboard
                    </Link>
                 )}
                <hr className="border-slate-200 dark:border-slate-700 my-1"/>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-600 w-full text-left rounded-md"
                >
                  <FaSignOutAlt className="mr-3 h-5 w-5" />
                  Sign out
                </button>
              </>
            )}
          </nav>
          {/* Auth buttons for mobile if not logged in */}
          {!user && !authLoading && (
            <div className="px-4 pt-4 flex flex-col space-y-2">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full text-sm">Sign In</Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="primary" className="w-full text-sm">Sign Up</Button>
                </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;