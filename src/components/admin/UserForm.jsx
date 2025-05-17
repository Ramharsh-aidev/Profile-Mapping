// src/components/admin/UserForm.jsx
import React from 'react';
import FormInput from '../ui/FormInput'; // Adjusted path

// This component contains only the form fields
const UserForm = ({ data, onChange, errors, isEdit = false }) => {
  return (
    <>
      <FormInput label="Full Name" name="name" value={data.name} onChange={onChange} placeholder="e.g., Jane Doe" required error={errors?.name}/>
      <FormInput label="Username" name="username" value={data.username} onChange={onChange} placeholder="e.g., janedoe" required error={errors?.username}/>
      <FormInput label="Email Address" name="email" type="email" value={data.email} onChange={onChange} placeholder="e.g., jane@example.com" required error={errors?.email} readOnly={isEdit} />
      {!isEdit && (
          <>
          <FormInput label="Password" name="password" type="password" value={data.password} onChange={onChange} placeholder="Min. 6 characters" required error={errors?.password}/>
          <FormInput label="Confirm Password" name="confirmPassword" type="password" value={data.confirmPassword} onChange={onChange} placeholder="Re-type password" required error={errors?.confirmPassword}/>
          </>
      )}
      {/* For editing, password change should be a separate, more secure flow, so not included here directly */}
      {isEdit && (
        <p className="text-xs text-slate-500 mb-4">Password can be reset by the user or via a separate admin action (not available in this form).</p>
      )}
      <FormInput label="Date of Birth" name="dateOfBirth" type="date" value={data.dateOfBirth ? data.dateOfBirth.split('T')[0] : ''} onChange={onChange} error={errors?.dateOfBirth}/>
      <FormInput label="Location" name="location" value={data.location} onChange={onChange} placeholder="e.g., City, Country" error={errors?.location}/>
      <FormInput label="Description / Bio" name="description" value={data.description} onChange={onChange} placeholder="A short bio" error={errors?.description}/>
      <FormInput label="Photo URL" name="photoURL" value={data.photoURL} onChange={onChange} placeholder="https://example.com/avatar.jpg" error={errors?.photoURL}/>
      <div className="mt-4">
          <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" name="isAdmin" checked={!!data.isAdmin} onChange={onChange} className="form-checkbox h-5 w-5 text-sky-500 rounded border-slate-300 bg-white focus:ring-sky-500" />
              <span className="ml-2 text-sm text-slate-700">Is Administrator</span>
          </label>
      </div>
    </>
  );
};

export default UserForm;