// src/components/dashboard/forms/PersonalDetailsForm.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import FormInput from './AppFormInput'; // Adjust path
import FormSelect from './AppFormSelect'; // Adjust path
import FormTextarea from './AppFormTextarea'; // Adjust path
import { FaUser, FaVenusMars, FaGlobe, FaCalendarAlt, FaTint, FaIdCard, FaTshirt, FaAlignLeft, FaMapMarkerAlt, FaCamera, FaSave, FaSpinner } from 'react-icons/fa';

const PersonalDetailsForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: '', firstName: '', lastName: '', username: '', email: '',
    gender: '', nationality: '', dateOfBirth: '', bloodGroup: '', category: '',
    tShirtSize: '', photoURL: '', location: '', description: '',
  });

  useEffect(() => {
    if (initialData) {
      const nameParts = initialData.name ? initialData.name.split(' ') : ['', ''];
      setFormData({
        name: initialData.name || '', firstName: initialData.firstName || nameParts[0] || '',
        lastName: initialData.lastName || nameParts.slice(1).join(' ') || '',
        username: initialData.username || '', email: initialData.email || '',
        gender: initialData.gender || '', nationality: initialData.nationality || '',
        dateOfBirth: initialData.dateOfBirth ? initialData.dateOfBirth.split('T')[0] : '',
        bloodGroup: initialData.bloodGroup || '', category: initialData.category || '',
        tShirtSize: initialData.tShirtSize || '', photoURL: initialData.photoURL || '',
        location: initialData.location || '', description: initialData.description || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleFileChange = (e) => { /* ... (same as before) ... */
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
  const handleSubmit = (e) => { /* ... (same as before) ... */
    e.preventDefault();
    const combinedName = `${formData.firstName} ${formData.lastName}`.trim();
    // eslint-disable-next-line no-unused-vars
    const { username, email, ...dataToSubmit } = formData;
    onSubmit({ ...dataToSubmit, name: combinedName });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6">
      <div className="border-b border-slate-200 pb-6 mb-8">
        <h2 className="text-xl md:text-2xl font-semibold text-slate-700">Personal Details</h2>
        <p className="text-sm text-slate-500 mt-1">Update your personal information and profile picture.</p>
      </div>
      <div className="flex flex-col items-center space-y-4 mb-10 p-6 bg-sky-50/50 rounded-xl">
        <img src={formData.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.firstName || 'N')}+${encodeURIComponent(formData.lastName || 'A')}&background=0ea5e9&color=fff&size=128&font-size=0.33&bold=true`} alt="Avatar Preview" className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white" />
        <div>
          <label htmlFor="photoUpload" className="cursor-pointer text-sm font-medium text-sky-600 hover:text-sky-700 hover:underline flex items-center py-2 px-4 rounded-md hover:bg-sky-100 transition-colors">
            <FaCamera className="mr-2 text-sky-500" /> Change Photo
          </label>
          <input type="file" id="photoUpload" name="photoUpload" onChange={handleFileChange} className="hidden" accept="image/*" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 p-6 bg-slate-50/60 rounded-xl mb-8">
        <div className="py-2"> <p className="text-xs text-slate-500 uppercase tracking-wider">Username</p> <p className="text-slate-700 font-medium text-lg">@{formData.username || 'N/A'}</p> </div>
        <div className="py-2"> <p className="text-xs text-slate-500 uppercase tracking-wider">Email</p> <p className="text-slate-700 font-medium text-lg">{formData.email || 'N/A'}</p> </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
        <FormInput id="firstName" name="firstName" label="First Name" value={formData.firstName} onChange={handleChange} required icon={<FaUser />} />
        <FormInput id="lastName" name="lastName" label="Last Name" value={formData.lastName} onChange={handleChange} icon={<FaUser />} />
        <FormSelect id="gender" name="gender" label="Gender" value={formData.gender} onChange={handleChange} icon={<FaVenusMars />} options={[ { label: 'Select Gender...', value: '', disabled: true }, { label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Other', value: 'other' }, { label: 'Prefer not to say', value: 'prefer_not_to_say' }]} />
        <FormInput id="nationality" name="nationality" label="Nationality" value={formData.nationality} onChange={handleChange} icon={<FaGlobe />} placeholder="e.g., Indian"/>
        <FormInput id="dateOfBirth" name="dateOfBirth" label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={handleChange} required icon={<FaCalendarAlt />} />
        <FormSelect id="bloodGroup" name="bloodGroup" label="Blood Group" value={formData.bloodGroup} onChange={handleChange} icon={<FaTint />} options={[ { label: 'Select Blood Group...', value: '', disabled: true }, { label: 'A+', value: 'A+' }, { label: 'A-', value: 'A-' }, { label: 'B+', value: 'B+' }, { label: 'B-', value: 'B-' }, { label: 'AB+', value: 'AB+' }, { label: 'AB-', value: 'AB-' }, { label: 'O+', value: 'O+' }, { label: 'O-', value: 'O-' } ]} />
        <FormSelect id="category" name="category" label="Professional Category" value={formData.category} onChange={handleChange} icon={<FaIdCard />} options={[ { label: 'Select Category...', value: '', disabled: true }, { label: 'Student', value: 'student' }, { label: 'Software Developer', value: 'developer' }, { label: 'Designer', value: 'designer' }, { label: 'Project Manager', value: 'manager'}, { label: 'Other Professional', value: 'professional' }, { label: 'Other', value: 'other' } ]} />
        <FormSelect id="tShirtSize" name="tShirtSize" label="T-Shirt Size (Optional)" value={formData.tShirtSize} onChange={handleChange} icon={<FaTshirt />} options={[ { label: 'Select Size...', value: '', disabled: true }, { label: 'XS', value: 'XS' }, { label: 'S', value: 'S' }, { label: 'M', value: 'M' }, { label: 'L', value: 'L' }, { label: 'XL', value: 'XL' }, { label: 'XXL', value: 'XXL' } ]} />
      </div>
      <FormTextarea id="description" name="description" label="Public Bio / About Me" value={formData.description} onChange={handleChange} placeholder="Share something about yourself, your skills, or interests..." icon={<FaAlignLeft />} rows={4}/>
      <FormInput id="location" name="location" label="Current Location (for public map)" value={formData.location} onChange={handleChange} placeholder="e.g., City, State, Country" icon={<FaMapMarkerAlt />} />
      <div className="pt-8 mt-8 border-t border-slate-200 flex items-center justify-end space-x-4">
        <button type="button" onClick={onCancel} disabled={isSubmitting} className="px-8 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60 transition-colors duration-150 ease-in-out"> Cancel </button>
        <button type="submit" disabled={isSubmitting} className="px-8 py-2.5 bg-sky-500 hover:bg-sky-600 focus:ring-4 focus:ring-sky-300/50 text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg disabled:opacity-60 transition-all duration-150 ease-in-out flex items-center justify-center"> {isSubmitting ? <FaSpinner className="animate-spin mr-2.5" /> : <FaSave className="mr-2.5" />} Update Profile </button>
      </div>
    </form>
  );
};
export default PersonalDetailsForm;