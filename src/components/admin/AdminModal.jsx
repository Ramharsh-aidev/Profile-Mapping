// src/components/admin/AdminModal.jsx
import React from 'react';
import { FaTimes } from 'react-icons/fa';

const AdminModal = ({ isOpen, onClose, title, children, footerActions }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-700 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out"
         onClick={onClose} // Close on overlay click
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-fadeInDown" // Simple fade-in animation
        onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside content
      >
        {/* Modal Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100"
            aria-label="Close modal"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </header>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {children}
        </div>

        {/* Modal Footer (Optional) */}
        {footerActions && (
          <footer className="px-6 py-4 border-t border-slate-200 flex justify-end space-x-3 bg-slate-50 rounded-b-xl">
            {footerActions}
          </footer>
        )}
      </div>
    </div>
  );
};


export default AdminModal;