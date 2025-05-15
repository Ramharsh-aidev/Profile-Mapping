// src/pages/LoginPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Layout from '../components/layouts/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext'; // Import the custom hook

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true); // true for login, false for signup
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState(''); // Only for signup
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Only for signup
  const [isAdminSignup, setIsAdminSignup] = useState(false); // Only for signup
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // For form submission loading

  const { user, login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/profiles"; // Redirect after login/signup

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setLoading(true); // Start loading

    let result;
    if (isLogin) {
      result = await login(email, password);
    } else {
      result = await signup(username, email, password, confirmPassword, isAdminSignup);
    }

    setLoading(false); // End loading

    if (result.success) {
      // Redirection is handled by the useEffect above when `user` state updates
      // navigate(from, { replace: true }); // Already handled by useEffect
    } else {
      setError(result.message);
    }
  };

  // If user is already logged in, show nothing or a redirect message
  if (user) {
      return (
         <Layout>
            <div className="container mx-auto px-4 py-16 text-center">
                 <p>Redirecting...</p>
            </div>
         </Layout>
      );
  }


  return (
    <Layout>
      <div className="min-h-[calc(100vh-160px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50"> {/* Using bg-gray-50 */} {/* Adjust min-height based on header/footer */}
        <Card className="max-w-md w-full space-y-8 p-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {isLogin ? 'Sign in to your account' : 'Create a new account'}
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <div className="rounded-md shadow-sm -space-y-px">
              {!isLogin && (
                 <div>
                   <label htmlFor="username" className="sr-only">Username</label>
                   <input
                     id="username"
                     name="username"
                     type="text"
                     autoComplete="username"
                     required
                     className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                     placeholder="Username"
                     value={username}
                     onChange={(e) => setUsername(e.target.value)}
                   />
                 </div>
              )}
              <div>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm ${isLogin ? 'rounded-t-md' : ''}`}
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  required
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm ${isLogin ? 'rounded-b-md' : ''} ${!isLogin && 'border-t-0'}`}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {!isLogin && (
                <div>
                  <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm border-t-0"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              )}
            </div>

            {!isLogin && (
                <div className="flex items-center">
                    <input
                        id="isAdminSignup"
                        name="isAdminSignup"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={isAdminSignup}
                        onChange={(e) => setIsAdminSignup(e.target.checked)}
                    />
                    <label htmlFor="isAdminSignup" className="ml-2 block text-sm text-gray-900">
                        Sign me up as Admin (For demo/testing)
                    </label>
                </div>
            )}

            {isLogin && (
               <div className="flex items-center justify-between">
                 <div className="flex items-center">
                   {/* Remember Me Checkbox (Optional) */}
                   {/* <input
                     id="remember-me"
                     name="remember-me"
                     type="checkbox"
                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                   />
                   <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                     Remember me
                   </label> */}
                 </div>
                 {/* Forgot Password Link (Optional) */}
                 {/* <div className="text-sm">
                   <Link to="#" className="font-medium text-blue-600 hover:text-blue-500">
                     Forgot your password?
                   </Link>
                 </div> */}
               </div>
            )}


            <div>
              <Button
                type="submit"
                variant="primary"
                className="w-full flex justify-center py-2 px-4 text-sm"
                disabled={loading} // Disable button while loading
              >
                 {loading ? (isLogin ? 'Signing In...' : 'Signing Up...') : (isLogin ? 'Sign In' : 'Sign Up')}
              </Button>
            </div>
          </form>

          <div className="text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default LoginPage;