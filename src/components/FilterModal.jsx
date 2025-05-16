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
          { label: 'All Types', value: 'all' },
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
    // Initialize tempFilters when modal opens or currentFilters change
    // This ensures the modal reflects the active filters when opened
    // and resets to current if currentFilters are cleared externally while modal is closed.
    const initialTempFilters = JSON.parse(JSON.stringify(currentFilters));
    filterConfig.forEach(category => {
      category.fields.forEach(field => {
        if (field.type === 'radio' && !initialTempFilters[field.id]) {
          initialTempFilters[field.id] = field.options[0].value;
        } else if (field.type === 'text' && initialTempFilters[field.id] === undefined) {
          initialTempFilters[field.id] = ''; // Ensure text fields are initialized
        }
      });
    });
    setTempFilters(initialTempFilters);
  }, [isOpen, currentFilters]); // Re-initialize if isOpen changes (especially to true) or currentFilters change


  const handleInputChange = (fieldId, value) => {
    setTempFilters(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleApply = () => {
    onApplyFilters(tempFilters);
    onClose(); // Modal closes itself after applying
  };

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
  };

  // Clear specific section (category)
  const handleClearSection = (categoryId) => {
    const category = filterConfig.find(cat => cat.id === categoryId);
    if (!category) return;

    const updatedTempFilters = { ...tempFilters };
    category.fields.forEach(field => {
      if (field.type === 'radio') {
        updatedTempFilters[field.id] = field.options[0].value;
      } else if (field.type === 'text') {
        updatedTempFilters[field.id] = '';
      }
    });
    setTempFilters(updatedTempFilters);
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
    // Popover styling: absolute positioning, width, shadow, etc.
    // Will be positioned relative to its parent container in ProfileListPage
    <div 
        className="absolute top-full mt-2 left-0 w-[550px] max-w-full bg-white rounded-xl shadow-2xl border border-slate-200 z-30 overflow-hidden"
        // Removed: fixed inset-0 ... backdrop-blur-sm ...
        // Added: w-[550px] max-w-full (to prevent overflow on small screens, adjust as needed)
    >
      <Fade duration={200} className="flex flex-col" style={{maxHeight: '70vh'}}> {/* Ensure Fade wraps a block or flex container */}
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 flex-shrink-0">
          <h2 className="text-lg font-semibold text-slate-700">Filters</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <FaTimes size={18} />
          </button>
        </div>

        {/* Body (Two Panes) */}
        <div className="flex flex-1 overflow-hidden min-h-[250px]"> {/* Adjusted min-h */}
          {/* Left Pane: Categories */}
          <nav className="w-2/5 bg-slate-50 border-r border-slate-200 overflow-y-auto p-2.5 space-y-1">
            {filterConfig.map(category => {
              const isActive = category.id === selectedCategoryId;
              const activeCount = countActiveFiltersInCategory(category.id);
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategoryId(category.id)}
                  className={`w-full flex items-center justify-between text-left px-2.5 py-2 rounded-md text-sm transition-all duration-200
                              ${isActive ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-800'}`}
                >
                  <span className={`truncate ${isActive ? 'font-semibold' : ''}`}>{category.name}</span>
                  <div className="flex items-center flex-shrink-0 ml-1">
                    {activeCount > 0 && (
                      <span className={`mr-1 inline-flex items-center justify-center min-w-[16px] h-4 px-1 text-xs font-bold leading-none rounded-full
                                        ${isActive ? 'bg-white text-sky-600' : 'bg-sky-500 text-white'}`}>
                        {activeCount}
                      </span>
                    )}
                    <FaChevronRight size={10} className={`${isActive ? 'text-sky-100' : 'text-slate-400'}`} />
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Right Pane: Options */}
          <div className="w-3/5 p-4 overflow-y-auto">
            {selectedCategory && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-md font-semibold text-slate-700">{selectedCategory.name}</h3>
                  <button 
                    onClick={() => handleClearSection(selectedCategory.id)}
                    className="text-xs text-sky-600 hover:text-sky-700 hover:underline"
                  >
                    Clear Section
                  </button>
                </div>
                <div className="space-y-4">
                  {selectedCategory.fields.map(field => (
                    <div key={field.id}>
                      <label className="block text-xs font-medium text-slate-600 mb-1">{field.name}</label>
                      {field.type === 'text' && (
                        <input
                          type="text"
                          placeholder={field.placeholder}
                          value={tempFilters[field.id] || ''}
                          onChange={e => handleInputChange(field.id, e.target.value)}
                          className="block w-full px-2.5 py-1.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-shadow text-sm"
                        />
                      )}
                      {field.type === 'radio' && (
                        <fieldset className="space-y-1.5">
                          <legend className="sr-only">{field.name}</legend>
                          {field.options.map(option => (
                            <label key={option.value} className="flex items-center text-sm text-slate-700 cursor-pointer p-0.5 hover:bg-slate-100 rounded">
                              <input
                                type="radio"
                                name={field.id}
                                value={option.value}
                                checked={tempFilters[field.id] === option.value}
                                onChange={e => handleInputChange(field.id, e.target.value)}
                                className="h-3.5 w-3.5 text-sky-600 border-slate-300 focus:ring-sky-500 mr-1.5"
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
        <div className="flex items-center justify-between p-3 border-t border-slate-200 bg-slate-50 flex-shrink-0">
          <button
            onClick={handleClearModalSelections}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-md hover:bg-slate-200 transition-colors"
          >
            Reset All Selections
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-md shadow-sm hover:shadow-md transition-all flex items-center"
          >
            Apply Filters <FaChevronRight size={10} className="ml-1.5" />
          </button>
        </div>
      </Fade>
    </div>
  );
};

export default FilterModal;