import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import mountainImage from '../../assets/authPageImage.avif'; // Import your image
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/layouts/Header';

const SignupPage = () => {
    const [step, setStep] = useState(1); // Track the current step

    // Step 1 state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Step 2 state
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { user, signup } = useAuth();
    const navigate = useNavigate();
    const locationHook = useLocation();
    const from = locationHook.state?.from?.pathname || "/profiles";

    useEffect(() => {
        if (user) {
            navigate(from, { replace: true });
        }
    }, [user, navigate, from]);

    const handleStep1Submit = (e) => {
        e.preventDefault();
        setError('');

        // Basic validation for step 1
        if (!name || !email || !username || !password || !confirmPassword) {
            setError('All fields are required.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        // Move to the next step
        setStep(2);
    };

    const handleStep2Submit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await signup(username, email, password, confirmPassword, location, description, '', name, dateOfBirth);

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

                    {/* Signup Form Section */}
                    <div className="bg-white p-12">
                        <div className="text-center">
                            <h2 className="mt-2 text-3xl font-semibold text-gray-800" style={{ fontFamily: 'Playfair Display, serif' }}>
                                Create Account
                            </h2>
                            <p className="mt-2 text-md text-gray-600" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                                Start your travel journey!
                            </p>
                        </div>
                        {error && (
                            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}

                        {step === 1 && (
                            <form className="mt-6" onSubmit={handleStep1Submit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                                        Name
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 transition duration-200"
                                        id="name"
                                        type="text"
                                        placeholder="Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        style={{ fontFamily: 'Open Sans, sans-serif' }}
                                    />
                                </div>
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

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                                        Password
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 transition duration-200"
                                        id="password"
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{ fontFamily: 'Open Sans, sans-serif' }}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                                        Confirm Password
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 transition duration-200"
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        style={{ fontFamily: 'Open Sans, sans-serif' }}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
                                        type="submit"
                                        style={{ fontFamily: 'Open Sans, sans-serif' }}
                                    >
                                        Next
                                    </button>
                                    <Link to="/login" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 transition duration-200" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                                        Already have an account? Login
                                    </Link>
                                </div>
                            </form>
                        )}


                        {step === 2 && (
                            <form className="mt-6" onSubmit={handleStep2Submit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                                        Username
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 transition duration-200"
                                        id="username"
                                        type="text"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        style={{ fontFamily: 'Open Sans, sans-serif' }}
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dateOfBirth" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                                        Date of Birth
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 transition duration-200"
                                        id="dateOfBirth"
                                        type="date"
                                        placeholder="Date of Birth"
                                        value={dateOfBirth}
                                        onChange={(e) => setDateOfBirth(e.target.value)}
                                        style={{ fontFamily: 'Open Sans, sans-serif' }}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                                        Location
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 transition duration-200"
                                        id="location"
                                        type="text"
                                        placeholder="Location"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        style={{ fontFamily: 'Open Sans, sans-serif' }}
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                                        Description (optional)
                                    </label>
                                    <textarea
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 transition duration-200"
                                        id="description"
                                        placeholder="Description (Optional)"
                                        rows="3"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        style={{ fontFamily: 'Open Sans, sans-serif' }}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
                                        type="submit"
                                        disabled={loading}
                                        style={{ fontFamily: 'Open Sans, sans-serif' }}
                                    >
                                        {loading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> : 'Sign Up'}
                                    </button>
                                </div>
                            </form>
                        )}



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

export default SignupPage;