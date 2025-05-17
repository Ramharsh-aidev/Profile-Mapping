// src/components/layouts/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate is needed for mobile logout
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import UserDropdown from '../ui/UserDropdown';
import { FaBell, FaBars, FaTimes, FaIdBadge, FaEdit, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

// Logo Component
const Logo = () => (
  <Link to="/" className="flex items-center group">
    <svg
      className="h-8 w-auto text-sky-700 group-hover:text-sky-800 transition-colors duration-300"
      viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"
    >
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12 6C9.24 6 7 8.24 7 11C7 12.76 7.67 14.32 8.75 15.39C8.3 15.99 7.56 16.78 7.5 17C7.44 17.22 7.53 17.45 7.71 17.59C7.89 17.73 8.14 17.75 8.33 17.63C9.65 16.83 10.93 16.09 12 15.47C13.07 16.09 14.35 16.83 15.67 17.63C15.86 17.75 16.11 17.73 16.29 17.59C16.47 17.45 16.56 17.22 16.5 17C16.44 16.78 15.7 15.99 15.25 15.39C16.33 14.32 17 12.76 17 11C17 8.24 14.76 6 12 6ZM12 13C10.9 13 10 12.1 10 11C10 9.9 10.9 9 12 9C13.1 9 14 9.9 14 11C14 12.1 13.1 13 12 13Z" />
    </svg>
  </Link>
);

const Header = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

  const handleMobileLogout = async () => {
    try {
      await logout(); // Call logout from AuthContext
      setIsMobileMenuOpen(false); // Close mobile menu
      navigate('/'); // Redirect to home
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const handleClickOutsideMobile = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('button[aria-label="Toggle mobile menu"]')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideMobile);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideMobile);
    };
  }, []);

  const AuthButtons = ({isMobile = false}) => (
    <div className={`flex items-center ${isMobile ? 'flex-col space-y-3 w-full' : 'space-x-3'}`}>
      <Link to="/login" className="no-underline w-full md:w-auto" onClick={() => isMobile && setIsMobileMenuOpen(false)}>
        <Button variant="outline" className={`px-4 py-1.5 text-sm border-slate-400 text-slate-700 hover:border-sky-600 hover:text-sky-700 ${isMobile && 'w-full py-2.5'}`}>Sign In</Button>
      </Link>
      <Link to="/signup" className="no-underline w-full md:w-auto" onClick={() => isMobile && setIsMobileMenuOpen(false)}>
        <Button variant="primary" className={`px-4 py-1.5 text-sm bg-sky-600 hover:bg-sky-700 ${isMobile && 'w-full py-2.5'}`}>Sign Up</Button>
      </Link>
    </div>
  );

  return (
    <header className="bg-sky-100/70 backdrop-blur-lg shadow-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-6">
            <Logo />
            <nav className="hidden md:flex items-center space-x-5">
              <Link to="/" className="text-sm font-medium text-slate-700 hover:text-sky-700 transition-colors py-2 no-underline">Home</Link>
              <Link to="/profiles" className="text-sm font-medium text-slate-700 hover:text-sky-700 transition-colors py-2 no-underline">Profiles</Link>
            </nav>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            {authLoading ? (
              <div className="w-9 h-9 bg-slate-300/50 rounded-full animate-pulse"></div>
            ) : user ? (
              <div className="hidden md:flex items-center space-x-3">
                <button aria-label="Notifications" className="p-2 rounded-full text-slate-600 hover:bg-sky-100/50 focus:outline-none transition-colors">
                  <FaBell className="h-5 w-5" />
                </button>
                <UserDropdown />
              </div>
            ) : (
              <div className="hidden md:flex">
                <AuthButtons />
              </div>
            )}
            <div className="md:hidden flex items-center">
              {user && !authLoading && (
                <button aria-label="Notifications" className="p-2 rounded-full text-slate-600 hover:bg-sky-100/50 focus:outline-none transition-colors mr-1">
                  <FaBell className="h-5 w-5" />
                </button>
              )}
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-slate-600 hover:bg-sky-100/50 focus:outline-none"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className="md:hidden absolute top-full left-0 right-0 bg-sky-50/95 backdrop-blur-md shadow-lg pb-4 z-40 border-t border-sky-200">
          <nav className="flex flex-col px-3 pt-2 pb-3">
            {authLoading ? (
                <div className="px-3 py-2.5 text-center">
                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-sky-600"></div>
                </div>
            ): user ? (
              <>
                <div className="px-3 py-3 border-b border-slate-200 mb-2">
                    <div className="flex items-center space-x-3">
                        <img
                            className="h-10 w-10 rounded-full object-cover border-2 border-sky-200"
                            src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.username || 'U')}&background=0ea5e9&color=fff&size=40&bold=true`}
                            alt="User avatar"
                        />
                        <div>
                            <p className="text-sm font-semibold text-slate-800 truncate">{user.name || user.username}</p>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                    </div>
                </div>
                <Link to={`/profiles/${encodeURIComponent(user.username || '')}`} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-3 py-2.5 text-sm text-slate-700 hover:bg-sky-100 rounded-md transition-colors no-underline"> <FaIdBadge className="mr-3 h-5 w-5 text-slate-400" /> My Public Profile </Link>
                <Link to="/dashboard/edit-profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-3 py-2.5 text-sm text-slate-700 hover:bg-sky-100 rounded-md transition-colors no-underline"> <FaEdit className="mr-3 h-5 w-5 text-slate-400" /> Edit Profile </Link>
                {user.isAdmin && ( <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-3 py-2.5 text-sm text-slate-700 hover:bg-sky-100 rounded-md transition-colors no-underline"> <FaUserCircle className="mr-3 h-5 w-5 text-slate-400" /> Admin Dashboard </Link> )}
                <hr className="border-slate-200 my-2"/>
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-700 hover:bg-sky-100 block px-3 py-2.5 rounded-md text-base font-medium transition-colors no-underline">Home</Link>
                <Link to="/profiles" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-700 hover:bg-sky-100 block px-3 py-2.5 rounded-md text-base font-medium transition-colors no-underline">Profiles</Link>
                <hr className="border-slate-200 my-2"/>
                <button onClick={handleMobileLogout} className="flex items-center mt-1 px-3 py-2.5 text-sm text-red-600 hover:bg-red-100 hover:text-red-700 w-full text-left rounded-md transition-colors no-underline"> <FaSignOutAlt className="mr-3 h-5 w-5" /> Sign out </button>
              </>
            ) : (
              <>
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-700 hover:bg-sky-100 block px-3 py-2.5 rounded-md text-base font-medium transition-colors no-underline">Home</Link>
                <Link to="/profiles" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-700 hover:bg-sky-100 block px-3 py-2.5 rounded-md text-base font-medium transition-colors no-underline">Profiles</Link>
                <div className="px-0 pt-3 pb-0 border-t border-slate-200 mt-2">
                  <AuthButtons isMobile={true} />
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;