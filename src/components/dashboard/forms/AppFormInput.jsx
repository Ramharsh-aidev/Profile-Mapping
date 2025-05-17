// src/components/ui/AppFormInput.jsx
import React from 'react';
import PropTypes from 'prop-types';

const AppFormInput = ({ // Renamed component
  id, name, label, type = "text", value, onChange, placeholder,
  required, icon, error, readOnly = false, className = "",
  inputClassName = "", labelClassName = "", iconClassName = "mr-2 text-slate-400 w-4 h-4"
}) => (
  <div className={`mb-5 ${className}`}>
    {label && (
      <label
        htmlFor={id || name}
        className={`flex items-center text-sm font-medium text-slate-600 mb-1.5 ${labelClassName}`}
      >
        {icon && React.cloneElement(icon, { className: iconClassName })}
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <input
      type={type} name={name} id={id || name} value={value || ''}
      onChange={onChange} placeholder={placeholder} required={required} readOnly={readOnly}
      className={`w-full px-4 py-2.5 border ${error ? 'border-red-400' : 'border-slate-300'} ${readOnly ? 'bg-slate-100 cursor-not-allowed' : 'bg-white'} rounded-lg shadow-sm focus:ring-2 focus:ring-sky-300 focus:border-sky-500 text-slate-700 placeholder-slate-400 transition-all duration-150 ease-in-out ${inputClassName}`}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

AppFormInput.propTypes = { /* ... (propTypes remain the same) ... */
  id: PropTypes.string, name: PropTypes.string.isRequired, label: PropTypes.string,
  type: PropTypes.string, value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired, placeholder: PropTypes.string, required: PropTypes.bool,
  icon: PropTypes.node, error: PropTypes.string, readOnly: PropTypes.bool, className: PropTypes.string,
  inputClassName: PropTypes.string, labelClassName: PropTypes.string, iconClassName: PropTypes.string,
};

export default AppFormInput; // Renamed export