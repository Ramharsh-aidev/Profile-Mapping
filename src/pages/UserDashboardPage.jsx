// src/pages/UserDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import SidebarNavigation from '../components/dashboard/SidebarNavigation';
import PersonalDetailsForm from '../components/dashboard/forms/PersonalDetailsForm';
import ComingSoonSection from '../components/dashboard/ComingSoonSection';
import { FaUserEdit, FaLock, FaCog, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const navItemsConfig = [
  { id: 'personal', label: 'Personal Details', icon: <FaUserEdit />, component: PersonalDetailsForm },
  { id: 'security', label: 'Sign-in & Security', icon: <FaLock />, component: () => <ComingSoonSection title="Sign-in & Security" /> },
  { id: 'preferences', label: 'My Preferences', icon: <FaCog />, component: () => <ComingSoonSection title="My Preferences" /> },
];

const UserDashboardPage = () => {
  const [activeSection, setActiveSection] = useState(navItemsConfig[0].id);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user: authUser, loading: authLoading, updateContextUser } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!authUser || !authUser.email) {
      setError("Authentication required. Please log in."); setLoading(false); toast.error("Authentication required."); return;
    }
    const fetchUserProfile = async () => {
      setLoading(true); setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/me/profile-info`, { headers: { 'x-user-email': authUser.email }});
        setUserData(response.data);
      } catch (err) {
        const msg = err.response?.data?.message || "Failed to load profile."; setError(msg); toast.error(msg);
      } finally { setLoading(false); }
    };
    fetchUserProfile();
  }, [authUser, authLoading]);

  const handleUpdateProfile = async (formDataToSubmit) => {
    if (!authUser?.email) { toast.error("Auth error."); return; }
    setIsSubmitting(true);
    try {
      // eslint-disable-next-line no-unused-vars
      const { newPhotoFile, ...payload } = formDataToSubmit;
      // TODO: Actual file upload logic for newPhotoFile if it exists
      const response = await axios.put(`${API_BASE_URL}/me/profile-info`, payload, { headers: { 'x-user-email': authUser.email }});
      if (response.data?.user) {
        updateContextUser(response.data.user); 
        setUserData(response.data.user);      
        toast.success('Profile updated successfully!');
      } else { toast.error("Update response missing user data.");}
    } catch (err) { toast.error(err.response?.data?.message || "Update failed.");
    } finally { setIsSubmitting(false); }
  };

  const handleCancelEdit = () => { 
    // Re-fetch or reset form based on current userData to discard unsubmitted changes
    if (userData) { // Ensure userData is available before trying to "reset" to it
        // This effectively re-triggers the useEffect in PersonalDetailsForm
        // by passing a new object reference if initialData prop changes
        setUserData(prev => ({...prev})); 
    }
    toast.info("No changes were saved."); 
  };
  
  const ActiveComponent = navItemsConfig.find(item => item.id === activeSection)?.component;

  if (loading || authLoading) return <div className="flex items-center justify-center min-h-screen bg-sky-50/30"><FaSpinner className="animate-spin text-sky-600 w-16 h-16" /></div>;
  if (error) return ( <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-red-50"> <FaExclamationTriangle className="text-red-500 w-16 h-16 mb-6"/> <p className="text-red-700 text-xl font-semibold mb-2">Oops!</p> <p className="text-red-600 text-md">{error}</p> </div> );
  if (!userData) return <div className="min-h-screen flex items-center justify-center p-4 text-slate-600">Could not load user data.</div>;

  return (
    <>
    <Header/>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-sky-50/40 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-screen-xl mx-auto">
          <DashboardHeader userData={userData} />
          <div className="flex flex-col md:flex-row gap-8">
            <SidebarNavigation 
              navItems={navItemsConfig}
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
            <main className="flex-grow md:w-3/4 lg:w-3/4 xl:w-4/5 bg-white rounded-xl shadow-xl overflow-hidden">
              {ActiveComponent && <ActiveComponent initialData={userData} onSubmit={handleUpdateProfile} onCancel={handleCancelEdit} isSubmitting={isSubmitting}/>}
            </main>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};
export default UserDashboardPage;