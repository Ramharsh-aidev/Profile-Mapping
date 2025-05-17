// src/pages/UserDashboardPage.jsx
import React, { useState, useEffect } from 'react'; // Removed useContext as useAuth is used
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext'; // <<< CORRECT: Use the custom hook
import {
  FaUserEdit, FaLock, FaCog, FaSave, FaSpinner, FaExclamationTriangle,
  FaUser, FaEnvelope, FaCalendarAlt, FaVenusMars, FaGlobe, FaTint,
  FaIdCard, FaTshirt, FaMapMarkerAlt, FaAlignLeft, FaCamera
} from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// --- Reusable Form Components (FormInput, FormSelect, FormTextarea - from previous response) ---
const FormInput = ({ id, name, label, type = "text", value, onChange, placeholder, required, icon, error }) => (
  <div className="mb-4">
    <label htmlFor={id || name} className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
      {icon && React.cloneElement(icon, { className: "mr-2 text-slate-400 dark:text-slate-500" })}
      {label} {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      type={type}
      name={name}
      id={id || name}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors`}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const FormSelect = ({ id, name, label, value, onChange, options, required, icon, error }) => (
  <div className="mb-4">
    <label htmlFor={id || name} className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
      {icon && React.cloneElement(icon, { className: "mr-2 text-slate-400 dark:text-slate-500" })}
      {label} {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <select
      name={name}
      id={id || name}
      value={value || ''}
      onChange={onChange}
      required={required}
      className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 transition-colors`}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value} disabled={opt.disabled}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const FormTextarea = ({ id, name, label, value, onChange, placeholder, rows = 3, icon, error }) => (
  <div className="mb-4">
    <label htmlFor={id || name} className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
      {icon && React.cloneElement(icon, { className: "mr-2 text-slate-400 dark:text-slate-500" })}
      {label}
    </label>
    <textarea
      name={name}
      id={id || name}
      rows={rows}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors`}
    ></textarea>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);


// --- PersonalDetailsForm Component ---
function PersonalDetailsForm({ initialData, onSubmit, onCancel, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: '', firstName: '', lastName: '', username: '', email: '',
    gender: '', nationality: '', dateOfBirth: '', bloodGroup: '', category: '',
    tShirtSize: '', photoURL: '', location: '', description: '',
  });

  useEffect(() => {
    if (initialData) {
      const nameParts = initialData.name ? initialData.name.split(' ') : ['', ''];
      setFormData({
        name: initialData.name || '',
        firstName: initialData.firstName || nameParts[0] || '',
        lastName: initialData.lastName || nameParts.slice(1).join(' ') || '',
        username: initialData.username || '',
        email: initialData.email || '',
        gender: initialData.gender || '',
        nationality: initialData.nationality || '',
        dateOfBirth: initialData.dateOfBirth ? initialData.dateOfBirth.split('T')[0] : '',
        bloodGroup: initialData.bloodGroup || '',
        category: initialData.category || '',
        tShirtSize: initialData.tShirtSize || '',
        photoURL: initialData.photoURL || '',
        location: initialData.location || '',
        description: initialData.description || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoURL: reader.result, newPhotoFile: file }));
      };
      reader.readAsDataURL(file);
      toast.success('Photo selected. Click Update to save.', { icon: '📸' });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const combinedName = `${formData.firstName} ${formData.lastName}`.trim();
    const { username, email, ...dataToSubmit } = formData;
    onSubmit({ ...dataToSubmit, name: combinedName });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-700 pb-6 mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-slate-800 dark:text-slate-100">Personal Details</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Update your personal information.</p>
      </div>
      <div className="flex flex-col items-center space-y-3 mb-8 p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
        <img
          src={formData.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.firstName || 'N')}+${encodeURIComponent(formData.lastName || 'A')}&background=0ea5e9&color=fff&size=128&font-size=0.33&bold=true`}
          alt="Avatar Preview"
          className="w-28 h-28 rounded-full object-cover shadow-lg border-4 border-white dark:border-slate-600"
        />
        <div>
          <label htmlFor="photoUpload" className="cursor-pointer text-sm font-medium text-sky-600 dark:text-sky-400 hover:underline flex items-center">
            <FaCamera className="mr-2" /> Change Photo
          </label>
          <input type="file" id="photoUpload" name="photoUpload" onChange={handleFileChange} className="hidden" accept="image/*" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg mb-6">
        <div className="mb-2"> <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">Username</p> <p className="text-slate-700 dark:text-slate-200 font-medium">@{formData.username || 'N/A'}</p> </div>
        <div className="mb-2"> <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">Email</p> <p className="text-slate-700 dark:text-slate-200 font-medium">{formData.email || 'N/A'}</p> </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <FormInput id="firstName" name="firstName" label="First Name" value={formData.firstName} onChange={handleChange} required icon={<FaUser />} />
        <FormInput id="lastName" name="lastName" label="Last Name" value={formData.lastName} onChange={handleChange} icon={<FaUser />} />
        <FormSelect id="gender" name="gender" label="Gender" value={formData.gender} onChange={handleChange} icon={<FaVenusMars />}
          options={[ { label: 'Select Gender', value: '', disabled: true }, { label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Other', value: 'other' }, { label: 'Prefer not to say', value: 'prefer_not_to_say' }]} />
        <FormInput id="nationality" name="nationality" label="Nationality" value={formData.nationality} onChange={handleChange} icon={<FaGlobe />} />
        <FormInput id="dateOfBirth" name="dateOfBirth" label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={handleChange} required icon={<FaCalendarAlt />} />
        <FormSelect id="bloodGroup" name="bloodGroup" label="Blood Group" value={formData.bloodGroup} onChange={handleChange} icon={<FaTint />}
          options={[ { label: 'Select Blood Group', value: '', disabled: true }, { label: 'A+', value: 'A+' }, { label: 'A-', value: 'A-' }, { label: 'B+', value: 'B+' }, { label: 'B-', value: 'B-' }, { label: 'AB+', value: 'AB+' }, { label: 'AB-', value: 'AB-' }, { label: 'O+', value: 'O+' }, { label: 'O-', value: 'O-' } ]} />
        <FormSelect id="category" name="category" label="Category" value={formData.category} onChange={handleChange} icon={<FaIdCard />}
          options={[ { label: 'Select Category', value: '', disabled: true }, { label: 'Student', value: 'student' }, { label: 'Professional', value: 'professional' }, { label: 'Other', value: 'other' } ]} />
        <FormSelect id="tShirtSize" name="tShirtSize" label="T-Shirt Size" value={formData.tShirtSize} onChange={handleChange} icon={<FaTshirt />}
          options={[ { label: 'Select Size', value: '', disabled: true }, { label: 'XS', value: 'XS' }, { label: 'S', value: 'S' }, { label: 'M', value: 'M' }, { label: 'L', value: 'L' }, { label: 'XL', value: 'XL' }, { label: 'XXL', value: 'XXL' } ]} />
      </div>
      <FormTextarea id="description" name="description" label="Public Bio/Description" value={formData.description} onChange={handleChange} placeholder="Tell us a bit about yourself..." icon={<FaAlignLeft />} />
      <FormInput id="location" name="location" label="Location (for public map)" value={formData.location} onChange={handleChange} placeholder="e.g., City, Country" icon={<FaMapMarkerAlt />} />
      <div className="pt-8 mt-6 border-t border-slate-200 dark:border-slate-700 flex justify-end space-x-3">
        <button type="button" onClick={onCancel} disabled={isSubmitting} className="px-6 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"> Cancel </button>
        <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center"> {isSubmitting ? <FaSpinner className="animate-spin mr-2" /> : <FaSave className="mr-2" />} Update Profile </button>
      </div>
    </form>
  );
}

const ComingSoonSection = ({ title }) => ( <div className="p-6 md:p-10 text-center"> <h2 className="text-2xl font-semibold mb-4 text-slate-700 dark:text-slate-200">{title}</h2> <p className="text-slate-500 dark:text-slate-400">This section is under construction.</p> <div className="mt-6 text-4xl text-slate-300 dark:text-slate-600">🚧</div> </div> );
const navItemsConfig = [ { id: 'personal', label: 'Personal Details', icon: <FaUserEdit />, component: PersonalDetailsForm }, { id: 'security', label: 'Sign-in & Security', icon: <FaLock />, component: () => <ComingSoonSection title="Sign-in & Security" /> }, { id: 'preferences', label: 'My Preferences', icon: <FaCog />, component: () => <ComingSoonSection title="My Preferences" /> },];

const UserDashboardPage = () => {
  const [activeSection, setActiveSection] = useState(navItemsConfig[0].id);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user: authUser, loading: authLoading, updateContextUser } = useAuth(); // Use the hook

  useEffect(() => {
    if (authLoading) return;
    if (!authUser || !authUser.email) {
      setError("Authentication required. Please log in.");
      setLoading(false);
      toast.error("Authentication required.");
      return;
    }
    const fetchUserProfile = async () => {
      setLoading(true); setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/me/profile-info`, {
          headers: { 'x-user-email': authUser.email }
        });
        setUserData(response.data);
      } catch (err) {
        const msg = err.response?.data?.message || "Failed to load profile.";
        setError(msg); toast.error(msg);
      } finally { setLoading(false); }
    };
    fetchUserProfile();
  }, [authUser, authLoading]);

  const handleUpdateProfile = async (formDataToSubmit) => {
    if (!authUser?.email) { toast.error("Auth error."); return; }
    setIsSubmitting(true);
    try {
      const { newPhotoFile, ...payload } = formDataToSubmit;
      // TODO: Handle newPhotoFile upload if it exists
      const response = await axios.put(`${API_BASE_URL}/me/profile-info`, payload, {
        headers: { 'x-user-email': authUser.email }
      });
      if (response.data?.user) {
        updateContextUser(response.data.user); // Update global AuthContext
        setUserData(response.data.user);      // Update local page state
        toast.success('Profile updated!');
      } else { toast.error("Update response missing user data.");}
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed.");
    } finally { setIsSubmitting(false); }
  };

  const handleCancelEdit = () => { setUserData(prev => ({...prev})); toast.info("Changes discarded."); };
  const ActiveComponent = navItemsConfig.find(item => item.id === activeSection)?.component;
  const DashboardHeader = () => (
    <div className="bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-900 p-6 md:p-8 mb-8 rounded-xl shadow-lg">
      <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0">
        <img src={userData?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.name || userData?.username || 'U')}&background=0ea5e9&color=fff&size=96&font-size=0.33&bold=true`} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-slate-600 shadow-md" />
        <div> <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">{userData?.name || userData?.username}</h1> <p className="text-sm text-slate-600 dark:text-slate-400">{userData?.email}</p> </div>
      </div>
    </div>
  );

  if (loading || authLoading) return <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900"><FaSpinner className="animate-spin text-sky-500 w-16 h-16" /></div>;
  if (error) return ( <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-red-50 dark:bg-red-900/20"> <FaExclamationTriangle className="text-red-400 dark:text-red-500 w-16 h-16 mb-6"/> <p className="text-red-600 dark:text-red-300 text-xl font-semibold mb-2">Oops!</p> <p className="text-red-500 dark:text-red-400 text-md">{error}</p> </div> );
  if (!userData) return <div className="min-h-screen flex items-center justify-center p-4 text-slate-600 dark:text-slate-300">Could not load user data.</div>;

  return (
    <>
      <Toaster position="top-center" toastOptions={{ className: 'dark:bg-slate-700 dark:text-slate-100' }} />
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <DashboardHeader />
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <aside className="md:w-1/4 lg:w-1/5 flex-shrink-0">
              <div className="bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-xl shadow-lg space-y-1.5 sticky top-20">
                {navItemsConfig.map(item => ( <button key={item.id} onClick={() => setActiveSection(item.id)} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out ${activeSection === item.id ? 'bg-sky-500 text-white shadow-md scale-105' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-100'}`}> {React.cloneElement(item.icon, { className: `w-5 h-5 ${activeSection === item.id ? 'text-white' : 'text-slate-400 dark:text-slate-500'}` })} <span>{item.label}</span> </button> ))}
              </div>
            </aside>
            <main className="flex-grow md:w-3/4 lg:w-4/5 bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
              {ActiveComponent && <ActiveComponent initialData={userData} onSubmit={handleUpdateProfile} onCancel={handleCancelEdit} isSubmitting={isSubmitting}/>}
            </main>
          </div>
        </div>
      </div>
    </>
  );
};
export default UserDashboardPage;