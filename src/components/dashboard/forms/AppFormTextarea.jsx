// src/components/ui/AppFormTextarea.jsx
import React from 'react';
import PropTypes from 'prop-types';

const AppFormTextarea = ({
  id, name, label, value, onChange, placeholder, rows = 4, icon, error, required,
  className = "", textareaClassName = "", labelClassName = "", iconClassName = "mr-2 text-slate-400 w-4 h-4"
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
    <textarea
      name={name} id={id || name} rows={rows} value={value || ''}
      onChange={onChange} placeholder={placeholder} required={required}
      className={`w-full px-4 py-2.5 border ${error ? 'border-red-400' : 'border-slate-300'} rounded-lg shadow-sm focus:ring-2 focus:ring-sky-300 focus:border-sky-500 text-slate-700 placeholder-slate-400 transition-all duration-150 ease-in-out ${textareaClassName}`}
    ></textarea>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

AppFormTextarea.propTypes = {
  id: PropTypes.string, name: PropTypes.string.isRequired, label: PropTypes.string,
  value: PropTypes.string, onChange: PropTypes.func.isRequired, placeholder: PropTypes.string,
  rows: PropTypes.number, icon: PropTypes.node, error: PropTypes.string, required: PropTypes.bool,
  className: PropTypes.string, textareaClassName: PropTypes.string, labelClassName: PropTypes.string,
  iconClassName: PropTypes.string,
};

export default AppFormTextarea;