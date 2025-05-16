import React, { useState, useEffect } from 'react';
import { FaTimes, FaChevronRight } from 'react-icons/fa';
import { Fade } from 'react-awesome-reveal';

// Same filterConfig as before
const filterConfig = [
  {
    id: 'general',
    name: 'General Criteria',
    fields: [
      { id: 'location', name: 'Location', type: 'text', placeholder: 'e.g., Bangalore, Mumbai' },
      { id: 'description', name: 'Keywords in Description', type: 'text', placeholder: 'e.g., developer, admin' },
    ],
  },
  {
    id: 'role',
    name: 'User Role',
    fields: [
      {
        id: 'adminStatus',
        name: 'Account Type',
        type: 'radio',
        options: [
          { label: 'All Types', value: 'all' }, // Changed default label
          { label: 'Admin', value: 'admin' },
          { label: 'Regular User', value: 'user' },
        ],
      },
    ],
  },
];

const FilterModal = ({ isOpen, onClose, currentFilters, onApplyFilters }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(filterConfig[0].id);
  const [tempFilters, setTempFilters] = useState({});

  useEffect(() => {
    if (isOpen) {
      const initialTempFilters = JSON.parse(JSON.stringify(currentFilters));
      filterConfig.forEach(category => {
        category.fields.forEach(field => {
          if (field.type === 'radio' && !initialTempFilters[field.id]) {
            initialTempFilters[field.id] = field.options[0].value;
          }
        });
      });
      setTempFilters(initialTempFilters);
    }
  }, [isOpen, currentFilters]);

  const handleInputChange = (fieldId, value) => {
    setTempFilters(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleApply = () => {
    onApplyFilters(tempFilters);
    onClose();
  };

  // Clears only the selections within the modal (tempFilters)
  const handleClearModalSelections = () => {
    const resetTempFilters = {};
    filterConfig.forEach(category => {
      category.fields.forEach(field => {
        if (field.type === 'radio') {
          resetTempFilters[field.id] = field.options[0].value;
        } else if (field.type === 'text') {
          resetTempFilters[field.id] = '';
        }
      });
    });
    setTempFilters(resetTempFilters);
    // Note: This does NOT call onClearAllAppliedFilters from ProfileListPage
    // That's for the main broom icon.
  };

  const selectedCategory = filterConfig.find(cat => cat.id === selectedCategoryId);

  const countActiveFiltersInCategory = (categoryId) => {
    const category = filterConfig.find(cat => cat.id === categoryId);
    if (!category) return 0;
    return category.fields.reduce((count, field) => {
      const value = tempFilters[field.id];
      if (field.type === 'radio' && value && value !== field.options[0].value) {
        return count + 1;
      }
      if (field.type === 'text' && value && value.trim() !== '') {
        return count + 1;
      }
      return count;
    }, 0);
  };

  if (!isOpen) return null;

  return (
    // Softer, lighter backdrop
    <div className="fixed inset-0 bg-slate-300 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out">
      <Fade duration={300} className="w-full max-w-3xl"> {/* Modal itself */}
        <div className="bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden" style={{ maxHeight: '90vh' }}>
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-700">Filters</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
              <FaTimes size={20} />
            </button>
          </div>

          {/* Body (Two Panes) */}
          <div className="flex flex-1 overflow-hidden min-h-[300px]"> {/* min-h for smaller content */}
            {/* Left Pane: Categories */}
            <nav className="w-1/3 bg-slate-50 border-r border-slate-200 overflow-y-auto p-3 space-y-1">
              {filterConfig.map(category => {
                const isActive = category.id === selectedCategoryId;
                const activeCount = countActiveFiltersInCategory(category.id);
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategoryId(category.id)}
                    className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200
                                ${isActive ? 'bg-sky-500 text-white shadow-md scale-105' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-800'}`}
                  >
                    <span className={isActive ? 'font-semibold' : ''}>{category.name}</span>
                    <div className="flex items-center">
                      {activeCount > 0 && (
                        <span className={`mr-1.5 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none rounded-full
                                          ${isActive ? 'bg-white text-sky-600' : 'bg-sky-500 text-white'}`}>
                          {activeCount}
                        </span>
                      )}
                      <FaChevronRight size={12} className={`${isActive ? 'text-sky-100' : 'text-slate-400'}`} />
                    </div>
                  </button>
                );
              })}
            </nav>

            {/* Right Pane: Options */}
            <div className="w-2/3 p-6 overflow-y-auto">
              {selectedCategory && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-5">{selectedCategory.name}</h3>
                  <div className="space-y-5">
                    {selectedCategory.fields.map(field => (
                      <div key={field.id}>
                        <label className="block text-sm font-medium text-slate-600 mb-1.5">{field.name}</label>
                        {field.type === 'text' && (
                          <input
                            type="text"
                            placeholder={field.placeholder}
                            value={tempFilters[field.id] || ''}
                            onChange={e => handleInputChange(field.id, e.target.value)}
                            className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-shadow"
                          />
                        )}
                        {field.type === 'radio' && (
                          <fieldset className="space-y-2">
                            <legend className="sr-only">{field.name}</legend>
                            {field.options.map(option => (
                              <label key={option.value} className="flex items-center text-sm text-slate-700 cursor-pointer p-1 hover:bg-slate-100 rounded-md">
                                <input
                                  type="radio"
                                  name={field.id} // Ensure radios in a group have the same name
                                  value={option.value}
                                  checked={tempFilters[field.id] === option.value}
                                  onChange={e => handleInputChange(field.id, e.target.value)}
                                  className="h-4 w-4 text-sky-600 border-slate-300 focus:ring-sky-500 mr-2"
                                />
                                {option.label}
                              </label>
                            ))}
                          </fieldset>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-5 border-t border-slate-200 bg-slate-50">
            <button
              onClick={handleClearModalSelections} // Clears selections in THIS modal instance
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 rounded-md hover:bg-slate-200 transition-colors"
            >
              Reset Selections
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center"
            >
              Apply Filters <FaChevronRight size={12} className="ml-2" />
            </button>
          </div>
        </div>
      </Fade>
    </div>
  );
};

export default FilterModal;