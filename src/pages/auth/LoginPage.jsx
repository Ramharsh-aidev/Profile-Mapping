import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import mountainImage from '../../assets/authPageImage.avif'; // Import your image
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/layouts/Header';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { user, login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/profiles";

    useEffect(() => {
        if (user) {
            navigate(from, { replace: true });
        }
    }, [user, navigate, from]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        setLoading(false);

        if (result.success) {
            navigate(from, { replace: true });
        } else {
            setError(result.message);
        }
    };

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
        <>
            <Header />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-500 to-sky-300 py-12 px-4 sm:px-6 lg:px-8">
                {/* Increased width and removed max-w-screen-xl */}
                <div className="relative w-full mx-auto overflow-hidden rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-2 max-w-6xl">
                    {/* Image Section - Hidden on Mobile */}
                    <div className="relative hidden md:block">
                        <img
                            src={mountainImage} // Use your imported image
                            alt="Travel"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black opacity-40"></div> {/* Subtle Image Overlay */}
                        <div className="absolute bottom-8 left-8 text-white">
                            <h2 className="text-4xl font-serif font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                                Profile Vista
                            </h2>
                            <p className="text-lg" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                                Map Your Success. Connect with People
                            </p>
                        </div>
                    </div>

                    {/* Login Form Section */}
                    <div className="bg-white p-12">
                        <div className="text-center">
                            <h2 className="mt-2 text-3xl font-semibold text-gray-800" style={{ fontFamily: 'Playfair Display, serif' }}>
                                Welcome Back!
                            </h2>
                            <p className="mt-2 text-md text-gray-600" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                                Sign in with your email
                            </p>
                        </div>
                        <form className="mt-6" onSubmit={handleSubmit}>
                            {error && (
                                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                    <span className="block sm:inline">{error}</span>
                                </div>
                            )}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                                    Email Address
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 transition duration-200"
                                    id="email"
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ fontFamily: 'Open Sans, sans-serif' }}
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                                    Password
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 transition duration-200"
                                    id="password"
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{ fontFamily: 'Open Sans, sans-serif' }}
                                />
                                <p className="text-right text-sm text-gray-600 hover:text-gray-800 transition duration-200" style={{ fontFamily: 'Open Sans, sans-serif' }}><a href="#">Forgot Password?</a></p>
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
                                    type="submit"
                                    disabled={loading}
                                    style={{ fontFamily: 'Open Sans, sans-serif' }}
                                >
                                    {loading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> : 'Sign In'}
                                </button>
                                <Link to="/signup" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 transition duration-200" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                                    Need an account? Sign Up
                                </Link>
                            </div>
                        </form>

                        <div className="mt-6 flex items-center justify-between">
                            <hr className="w-1/3 border-gray-300" />
                            <span className="text-gray-500 text-sm mx-2" style={{ fontFamily: 'Open Sans, sans-serif' }}>OR</span>
                            <hr className="w-1/3 border-gray-300" />
                        </div>

                        <div className="mt-4 flex justify-center space-x-4">
                            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                                <i className="fab fa-google"></i> Google
                            </button>
                            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                                <i className="fab fa-facebook"></i> Facebook
                            </button>
                            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                                <i className="fab fa-apple"></i> Apple
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;