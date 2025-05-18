// src/pages/ProfileDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import UserProfileHeader from '../components/userProfile/UserProfileHeader';
import UserDetailsSection from '../components/userProfile/UserDetailsSection';
import UserMapSection from '../components/userProfile/UserMapSection';
import { getPublicUserProfileByUsername } from '../utils/authStorage';
import { FaArrowLeft, FaExclamationTriangle, FaSpinner } from 'react-icons/fa'; // Added FaSpinner

const ProfileDetailsPage = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [errorCode, setErrorCode] = useState(null);

    useEffect(() => {
        console.log(`[ProfileDetailsPage] useEffect triggered for username: ${username}`);
        const fetchProfile = async () => {
            if (!username) {
                console.error('[ProfileDetailsPage] Username not provided in URL.');
                setError('Username not provided in URL.');
                setLoading(false);
                return;
            }
            console.log(`[ProfileDetailsPage] Attempting to fetch profile for: ${username}`);
            setLoading(true);
            setError('');
            setErrorCode(null);
            try {
                const result = await getPublicUserProfileByUsername(username);
                console.log('[ProfileDetailsPage] API call result:', JSON.stringify(result, null, 2));
                if (result.success && result.profile) { // Ensure result.profile exists
                    console.log('[ProfileDetailsPage] Successfully fetched profileData:', JSON.stringify(result.profile, null, 2));
                    setProfileData(result.profile);
                } else {
                    const errorMessage = result.message || `Could not load profile for @${username}.`;
                    console.error(`[ProfileDetailsPage] Error fetching profile: ${errorMessage}`, result);
                    setError(errorMessage);
                    setErrorCode(result.status);
                    setProfileData(null); // Clear any previous profile data
                }
            } catch (e) {
                console.error("[ProfileDetailsPage] Unexpected network error during profile fetch:", e);
                setError('An unexpected network error occurred while fetching the profile.');
                setProfileData(null); // Clear any previous profile data
            } finally {
                setLoading(false);
                console.log('[ProfileDetailsPage] Fetching complete. Loading set to false.');
            }
        };

        fetchProfile();
    }, [username]); // Dependency array ensures this runs when username changes

    if (loading) {
        console.log('[ProfileDetailsPage] Rendering loading state.');
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
                <FaSpinner className="animate-spin h-16 w-16 text-sky-500" /> {/* Using FaSpinner */}
                <p className="mt-6 text-lg text-slate-600">Loading profile for @{username}...</p>
            </div>
        );
    }

    if (error) {
        console.log(`[ProfileDetailsPage] Rendering error state: ${error}`);
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-md shadow-md max-w-lg mx-auto">
                    <div className="flex items-center">
                        <FaExclamationTriangle className="h-8 w-8 text-red-500 mr-4 flex-shrink-0" />
                        <div>
                            <p className="font-bold text-xl">
                                {errorCode === 404 ? `Profile Not Found` : `Error Loading Profile`}
                            </p>
                            <p className="text-md mt-1">
                                {errorCode === 404 ? `The profile for @${username} could not be found.` : error}
                            </p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                >
                    <FaArrowLeft className="mr-2" /> Go Back
                </button>
            </div>
        );
    }

    if (!profileData) {
        // This state should ideally be caught by error or loading, but as a fallback
        console.warn('[ProfileDetailsPage] Rendering with no profileData and no error/loading state. This should not happen if API call was made.');
        return (
            <div className="container mx-auto px-4 py-8 text-center text-slate-600">
                Profile data is not available for @{username}. There might have been an issue loading it.
            </div>
        );
    }
    
    console.log('[ProfileDetailsPage] Rendering profile with data:', JSON.stringify(profileData, null, 2));
    return (
        <div className="bg-slate-100 min-h-screen py-8 md:py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
                <div className="mb-6">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="text-sky-600 hover:text-sky-800 inline-flex items-center group text-sm"
                    >
                        <FaArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Back
                    </button>
                </div>

                <div className="bg-white shadow-xl rounded-xl overflow-hidden">
                    <UserProfileHeader user={profileData} />
                    <UserDetailsSection user={profileData} />
                </div>
                
                <div className="mt-8">
                     <UserMapSection
                        address={profileData.location}
                        username={profileData.username}
                     />
                </div>
            </div>
        </div>
    );
};

export default ProfileDetailsPage;