import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
  let baseStyles = 'px-6 py-3 rounded-full font-semibold transition duration-200 ease-in-out ';
  let variantStyles = '';

  switch (variant) {
    case 'primary':
      variantStyles = 'bg-blue-600 text-white hover:bg-blue-700';
      break;
    case 'secondary':
      variantStyles = 'bg-gray-200 text-gray-800 hover:bg-gray-300';
      break;
    case 'outline':
      variantStyles = 'bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50';
      break;
    default:
      variantStyles = 'bg-blue-600 text-white hover:bg-blue-700'; // Default to primary
  }

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline']),
  className: PropTypes.string,
};

export default Button;