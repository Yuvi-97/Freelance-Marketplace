import React from "react";

function Button({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded-lg font-semibold transition duration-300 ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
