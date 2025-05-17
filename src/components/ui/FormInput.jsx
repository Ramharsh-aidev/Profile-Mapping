// src/components/ui/FormInput.jsx
import React from 'react';

const FormInput = ({ label, name, type = "text", value, onChange, placeholder, required, error, readOnly = false }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      readOnly={readOnly}
      className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-slate-300'} ${readOnly ? 'bg-slate-100 cursor-not-allowed' : 'bg-white'} rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-slate-800 placeholder-slate-400`}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

export default FormInput;