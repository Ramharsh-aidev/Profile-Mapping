import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import Button from '../ui/Button'; // Adjust path if necessary
import { useAuth } from '../../contexts/AuthContext'; // <--- Import the custom hook
// import Logo from '../../assets/logo.png'; // Example logo import

const Header = () => {
  // Use the useAuth hook to get the current user and the logout function
  const { user, logout } = useAuth();
  const navigate = useNavigate(); // Hook for navigation

  // Handler function for the logout button
  const handleLogout = async () => {
    try {
      // Call the logout function from the AuthContext
      await logout(); // Assuming logout might be async (e.g., clearing async storage)
      console.log("Logged out successfully"); // Optional success message

      // Redirect the user to the home page or login page after logout
      navigate('/'); // Or navigate('/login'); depending on where you want them to go
    } catch (error) {
      console.error("Logout failed:", error);
      // You could set an error state here to display a message to the user
    }
  };

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
          {/* Show Profiles link. The /profiles route itself should handle protection */}
          <Link to="/profiles" className="text-gray-600 hover:text-blue-600 transition-colors">Profiles</Link>
          {/* Add other navigation links here if needed */}
        </nav>

        {/* Auth Buttons - Conditional Rendering */}
        <div className="flex items-center space-x-4">
           {user ? (
             // If user is logged in (user object exists), show Logout button
             <Button
                variant="primary" // Use primary or outline variant
                className="px-4 py-2"
                onClick={handleLogout} // Attach the logout handler
             >
               Logout
             </Button>
           ) : (
             // If user is not logged in (user is null), show Sign In/Sign Up buttons
             <> {/* Use a Fragment to group multiple elements */}
               <Link to="/login">
                 <Button variant="outline" className="hidden sm:block px-4 py-2">Sign In</Button>
               </Link>
               <Link to="/signup">
                 <Button variant="primary" className="px-4 py-2">Sign Up</Button>
               </Link>
             </>
           )}
        </div>

        {/* Mobile Menu Button (Optional) */}
        {/* You would add a button here to toggle a mobile menu */}
      </div>
    </header>
  );
};

export default Header;