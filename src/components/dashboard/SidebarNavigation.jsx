// src/components/dashboard/SidebarNavigation.jsx
import React from 'react';

const SidebarNavigation = ({ navItems, activeSection, onSectionChange }) => {
  return (
    <aside className="md:w-1/4 lg:w-1/4 xl:w-1/5 flex-shrink-0">
      <div className="bg-white p-4 sm:p-5 rounded-xl shadow-lg space-y-2 sticky top-24">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out group
              ${activeSection === item.id
                ? 'bg-sky-500 text-white shadow-lg -translate-y-0.5'
                : 'text-slate-600 hover:bg-sky-50 hover:text-sky-600'
              }`}
          >
            {React.cloneElement(item.icon, { className: `w-5 h-5 transition-colors ${activeSection === item.id ? 'text-white' : 'text-slate-400 group-hover:text-sky-500'}` })}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default SidebarNavigation;