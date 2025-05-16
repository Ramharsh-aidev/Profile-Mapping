import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import ProfileCard from '../components/ProfileCard';
import SingleAddressMap from '../components/SingleAddressMap';
import FilterModal from '../components/FilterModal';
import { FaSearch, FaTimesCircle, FaBroom, FaMapMarkedAlt, FaListUl, FaFilter as FilterIcon, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa'; // Re-added sort icons
import { Fade } from 'react-awesome-reveal';
import ClipLoader from "react-spinners/ClipLoader";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const initialFiltersState = {
  location: '',
  description: '',
  adminStatus: 'all',
};

const ProfileListPage = () => {
    const [allProfiles, setAllProfiles] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState(initialFiltersState);
    const [sortOrder, setSortOrder] = useState('asc'); // Re-added sortOrder state

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mobileView, setMobileView] = useState('list');
    const [selectedProfileAddressForMap, setSelectedProfileAddressForMap] = useState(null);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    useEffect(() => {
        const fetchProfiles = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${API_BASE_URL}/users`);
                const formattedProfiles = response.data.map(user => ({
                    id: user.email,
                    username: user.username || user.name || 'N/A',
                    email: user.email,
                    address: user.location || 'Location Undisclosed',
                    description: user.description || 'No description.',
                    photoURL: user.photoURL || '',
                    isAdmin: !!user.isAdmin,
                    name: user.name
                }));
                setAllProfiles(Array.isArray(formattedProfiles) ? formattedProfiles : []);
            } catch (err) {
                console.error("Error fetching profiles:", err);
                setError(`Failed to load profiles. ${err.response?.data?.message || err.message}`);
                setAllProfiles([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfiles();
    }, []);

    const filteredAndSortedProfiles = useMemo(() => {
        if (!Array.isArray(allProfiles)) return [];
        
        let filtered = allProfiles.filter(profile => {
            const pUsername = profile.username?.toLowerCase() || '';
            const pEmail = profile.email?.toLowerCase() || '';
            const pAddress = profile.address?.toLowerCase() || '';
            const pDescription = profile.description?.toLowerCase() || '';
            
            const generalSearchMatch = searchQuery ? 
                `${pUsername} ${pEmail} ${pAddress} ${pDescription}`.includes(searchQuery.toLowerCase())
                : true;

            const locationMatch = activeFilters.location ? 
                pAddress.includes(activeFilters.location.toLowerCase()) 
                : true;
            
            const descriptionMatch = activeFilters.description ? 
                pDescription.includes(activeFilters.description.toLowerCase()) 
                : true;

            let adminMatch = true;
            if (activeFilters.adminStatus === 'admin') {
                adminMatch = profile.isAdmin === true;
            } else if (activeFilters.adminStatus === 'user') {
                adminMatch = profile.isAdmin === false;
            }
            
            return generalSearchMatch && locationMatch && descriptionMatch && adminMatch;
        });

        // Sorting logic
        filtered.sort((a, b) => {
            const nameA = a.username?.toLowerCase() || '';
            const nameB = b.username?.toLowerCase() || '';
            if (sortOrder === 'asc') return nameA.localeCompare(nameB);
            return nameB.localeCompare(nameA);
        });
        return filtered;
    }, [allProfiles, searchQuery, activeFilters, sortOrder]); // Added sortOrder to dependencies

    const handleProfileSelectForMap = (profile) => {
        // ... (same as before)
         if (profile.address && profile.address !== 'Location Undisclosed') {
            setSelectedProfileAddressForMap(profile.address);
            if (window.innerWidth < 768) setMobileView('map');
        } else {
            setSelectedProfileAddressForMap(null);
        }
    };

    const handleApplyModalFilters = (newFiltersFromModal) => {
        setActiveFilters(newFiltersFromModal);
    };

    const handleClearAllPageFilters = () => {
        setSearchQuery('');
        setActiveFilters(initialFiltersState);
        setSelectedProfileAddressForMap(null);
        // setIsFilterModalOpen(false); // Keep modal open, user can close it.
    };
    
    const countAppliedFilters = () => {
        // ... (same as before) ...
        let count = 0;
        if (activeFilters.location && activeFilters.location.trim() !== '') count++;
        if (activeFilters.description && activeFilters.description.trim() !== '') count++;
        if (activeFilters.adminStatus && activeFilters.adminStatus !== 'all') count++;
        return count;
    };
    const appliedFilterCount = countAppliedFilters();

    const toggleSortOrder = () => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));


    if (isLoading) { /* ... loading JSX ... */ }
    if (error) { /* ... error JSX ... */ }

    return (
        <>
            <div className="flex flex-col md:flex-row h-screen overflow-hidden">
                {/* Left Pane: Filters and Profile List - Lighter, fresher gradient */}
                <div className={`
                    ${mobileView === 'map' && 'hidden md:flex'}
                    md:w-2/5 lg:w-1/3 xl:w-1/4 flex flex-col h-full 
                    bg-gradient-to-br from-sky-50 via-teal-50 to-cyan-50 /* Lighter gradient */
                    border-r border-slate-200 shadow-lg z-10 
                `}>
                    <div className="p-4 sticky top-0 bg-white bg-opacity-80 backdrop-blur-md z-20 border-b border-slate-200">
                        <Fade direction="down" triggerOnce duration={300}>
                            <h2 className="text-2xl font-semibold mb-4 text-slate-700">Explore Profiles</h2>
                            {/* Search Input */}
                            <div className="relative mb-3">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaSearch className="w-4 h-4 text-slate-400" />
                                </div>
                                <input
                                    type="text" placeholder="Quick search profiles..."
                                    className="block w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg shadow-sm bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-sm transition-shadow"
                                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            {/* Action Buttons Row */}
                            <div className="flex items-center justify-between space-x-2">
                                <button
                                    onClick={() => setIsFilterModalOpen(true)}
                                    className="flex-grow flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors shadow-sm"
                                >
                                    <FilterIcon className="mr-2 h-4 w-4" />
                                    Filters
                                    {appliedFilterCount > 0 && (
                                        <span className="ml-2 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none bg-white text-sky-600 rounded-full">
                                            {appliedFilterCount}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={toggleSortOrder}
                                    className="p-2.5 border border-slate-300 text-sm font-medium rounded-lg text-slate-600 bg-white hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-colors shadow-sm"
                                    title={`Sort by Username (${sortOrder === 'asc' ? 'Ascending' : 'Descending'})`}
                                >
                                    {sortOrder === 'asc' ? <FaSortAmountUp className="h-4 w-4" /> : <FaSortAmountDown className="h-4 w-4" />}
                                </button>
                            </div>
                             {/* Clear All and Mobile Toggles (conditionally displayed) */}
                             {(searchQuery || appliedFilterCount > 0 || selectedProfileAddressForMap) && (
                                <button 
                                    onClick={handleClearAllPageFilters} 
                                    className="mt-2 w-full flex items-center justify-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 transition-colors"
                                    title="Clear Search & All Applied Filters"
                                >
                                    <FaBroom className="mr-1.5" /> Clear All
                                </button>
                            )}
                            <div className="md:hidden flex space-x-2 mt-2 justify-center">
                                <button onClick={() => setMobileView('list')} className={`p-2 rounded-md ${mobileView === 'list' ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-700'}`} title="Show List"><FaListUl /></button>
                                <button onClick={() => setMobileView('map')} className={`p-2 rounded-md ${mobileView === 'map' ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-700'}`} title="Show Map"><FaMapMarkedAlt /></button>
                            </div>
                        </Fade>
                    </div>

                    <div className="p-4 flex-grow overflow-y-auto">
                        {filteredAndSortedProfiles.length > 0 ? (
                            <div className="space-y-3">
                                {filteredAndSortedProfiles.map((profile, index) => (
                                    <Fade direction="up" delay={index * 30} triggerOnce key={profile.id} duration={300}>
                                        <ProfileCard
                                            profile={profile}
                                            onViewOnMap={() => handleProfileSelectForMap(profile)}
                                        />
                                    </Fade>
                                ))}
                            </div>
                        ) : (  console.log("... No profiles found message ..." ))}
                    </div>
                </div>

                {/* Right Pane: Map Area - Lighter background */}
                <div className={`
                    ${mobileView === 'list' && 'hidden md:flex'}
                    md:w-3/5 lg:w-2/3 xl:w-3/4 h-full 
                    p-2 md:p-3 lg:p-4 
                    bg-slate-100 /* Simpler, light background for map area */
                    flex items-center justify-center 
                    relative
                `}>
                    <div className="w-full h-full bg-white rounded-xl shadow-xl overflow-hidden">
                      <SingleAddressMap address={selectedProfileAddressForMap} />
                    </div>
                </div>
            </div>
            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                currentFilters={activeFilters}
                onApplyFilters={handleApplyModalFilters}
                onClearAllAppliedFilters={handleClearAllPageFilters} // This is the main clear for applied filters
            />
        </>
    );
};

export default ProfileListPage;