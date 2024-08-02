// src/components/common/Button/Button.js
import React from 'react';

const Button = ({ children, className, ...props }) => {
  return (
    <button
      className={`bg-gray-700 text-white py-1 px-2 rounded text-sm hover:bg-gray-600 transition duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
