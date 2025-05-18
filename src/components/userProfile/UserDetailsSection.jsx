// src/components/userProfile/UserDetailsSection.jsx
import React from 'react';
import { FaInfoCircle, FaCalendarAlt, FaVenusMars, FaGlobe, FaIdBadge, FaUserShield, FaUser } from 'react-icons/fa';

const DetailItem = ({ icon, label, value, children }) => {
  const hasDisplayableValue = value !== null && value !== undefined && value !== '';
  if (!hasDisplayableValue && !children) {
    // console.log(`[DetailItem] Not rendering item "${label}" due to no displayable value or children.`);
    return null;
  }
  // console.log(`[DetailItem] Rendering item "${label}" with value:`, value);
  return (
    <div className="flex items-start py-3.5 border-b border-slate-100 last:border-b-0">
      <div className="flex-shrink-0 w-10 h-10 inline-flex items-center justify-center text-sky-500 bg-sky-50 rounded-lg mr-4 shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">{label}</p>
        {hasDisplayableValue && <p className="text-slate-700 text-sm md:text-base mt-0.5">{String(value)}</p>}
        {children}
      </div>
    </div>
  );
};

const UserDetailsSection = ({ user }) => {
  console.log('[UserDetailsSection] Received user prop:', JSON.stringify(user, null, 2));
  if (!user) {
    console.warn('[UserDetailsSection] User prop is null or undefined. Rendering nothing.');
    return null;
  }

  const formatDate = (dateString) => {
    if (!dateString) {
        console.log('[UserDetailsSection] formatDate: dateString is empty or null, returning "Not Specified".');
        return 'Not Specified';
    }
    try {
      const formatted = new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
      console.log(`[UserDetailsSection] formatDate: input "${dateString}", output "${formatted}"`);
      return formatted;
    } catch (e) {
      console.error(`[UserDetailsSection] formatDate: Error formatting date "${dateString}":`, e);
      return dateString; // fallback to original string if formatting fails
    }
  };
  const capitalize = (str) => {
    const result = (typeof str === 'string' && str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '');
    // console.log(`[UserDetailsSection] capitalize: input "${str}", output "${result}"`);
    return result;
  };

  console.log(`[UserDetailsSection] Processing user: Name=${user.name}, Username=${user.username}, isAdmin=${user.isAdmin}, dateOfBirth=${user.dateOfBirth}`);

  return (
    <div className="bg-white p-6 md:p-8 shadow-xl rounded-b-xl mt-[-1px]"> {/* mt-[-1px] might be to align with header border */}
      <h2 className="text-xl font-semibold text-slate-700 mb-5 pb-3 border-b border-slate-200">
        About {user.name || user.username}
      </h2>
      <div className="space-y-2">
        <DetailItem icon={<FaInfoCircle size={18}/>} label="Bio / Description">
            <p className="text-slate-700 text-sm md:text-base mt-0.5 whitespace-pre-wrap">
                {user.description || 'No description provided.'}
            </p>
        </DetailItem>
        <DetailItem icon={<FaCalendarAlt size={18}/>} label="Date of Birth" value={formatDate(user.dateOfBirth)} />
        
        <DetailItem icon={<FaVenusMars size={18}/>} label="Gender" value={capitalize(user.gender)} />
        <DetailItem icon={<FaGlobe size={18}/>} label="Nationality" value={user.nationality} />
        <DetailItem icon={<FaIdBadge size={18}/>} label="Category" value={capitalize(user.category)} />
        
        <DetailItem
            icon={user.isAdmin ? <FaUserShield size={18} className="text-amber-500"/> : <FaUser size={18} className="text-green-500"/>}
            label="Account Type"
          >
            <p className={`font-semibold text-sm md:text-base mt-0.5 ${user.isAdmin ? 'text-amber-600' : 'text-green-600'}`}>
              {user.isAdmin ? 'Administrator' : 'Regular User'}
            </p>
        </DetailItem>
      </div>
    </div>
  );
};
export default UserDetailsSection;