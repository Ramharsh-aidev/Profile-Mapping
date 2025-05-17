// src/components/ui/AppFormSelect.jsx
import React from 'react';
import PropTypes from 'prop-types';

const AppFormSelect = ({ // Renamed component
  id, name, label, value, onChange, options, required, icon, error,
  className = "", selectClassName = "", labelClassName = "", iconClassName = "mr-2 text-slate-400 w-4 h-4"
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
    <div className="relative">
      <select
        name={name} id={id || name} value={value || ''} onChange={onChange} required={required}
        className={`w-full px-4 py-2.5 border ${error ? 'border-red-400' : 'border-slate-300'} rounded-lg shadow-sm focus:ring-2 focus:ring-sky-300 focus:border-sky-500 bg-white text-slate-700 appearance-none pr-10 transition-all duration-150 ease-in-out ${selectClassName}`}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 8l4 4 4-4"/>
        </svg>
      </div>
    </div>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

AppFormSelect.propTypes = { /* ... (propTypes remain the same) ... */
  id: PropTypes.string, name: PropTypes.string.isRequired, label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired, value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    disabled: PropTypes.bool,
  })).isRequired,
  required: PropTypes.bool, icon: PropTypes.node, error: PropTypes.string, className: PropTypes.string,
  selectClassName: PropTypes.string, labelClassName: PropTypes.string, iconClassName: PropTypes.string,
};

export default AppFormSelect; // Renamed export