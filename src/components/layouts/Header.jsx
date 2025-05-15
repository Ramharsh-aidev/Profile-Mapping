import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button'; // Adjust path if necessary
// import Logo from '../../assets/logo.png'; // Example logo import

const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo/Site Name */}
        <div className="flex items-center">
          {/* <img src={Logo} alt="Profile Explorer Logo" className="h-8 mr-2" /> */}
          <Link to="/" className="text-xl font-bold text-gray-800">Profile Explorer</Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
          <Link to="/profiles" className="text-gray-600 hover:text-blue-600 transition-colors">Profiles</Link>
          {/* Add other navigation links here if needed */}
        </nav>

        {/* Auth Buttons (Adapted from FinTech example) */}
        <div className="flex items-center space-x-4">
           <Link to="/login"> {/* Assuming login route */}
             <Button variant="outline" className="hidden sm:block px-4 py-2">Sign In</Button>
           </Link>
           <Link to="/signup"> {/* Assuming signup route */}
             <Button variant="primary" className="px-4 py-2">Sign Up</Button>
           </Link>
        </div>

        {/* Mobile Menu Button (Optional) */}
        {/* You would add a button here to toggle a mobile menu */}
      </div>
    </header>
  );
};

export default Header;