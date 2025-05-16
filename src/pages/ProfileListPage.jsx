import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProfileCard from '../components/ProfileCard';
import SingleAddressMap from '../components/SingleAddressMap';
import FilterModal from '../components/FilterModal';
import { FaSearch, FaBroom, FaMapMarkedAlt, FaListUl, FaFilter as FilterIcon, FaSortAmountDown, FaSortAmountUp, FaExclamationTriangle, FaHome } from 'react-icons/fa';
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
    const [sortOrder, setSortOrder] = useState('asc');

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mobileView, setMobileView] = useState('list'); // Default to list view
    const [selectedProfileAddressForMap, setSelectedProfileAddressForMap] = useState(null);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const filterContainerRef = useRef(null);

    // Initialize mobileView based on window width on mount
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) { // md breakpoint
                setMobileView('list'); // On larger screens, default to showing list alongside map
            }
        };
        handleResize(); // Set initial state
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterContainerRef.current && !filterContainerRef.current.contains(event.target)) {
                setIsFilterModalOpen(false);
            }
        };
        if (isFilterModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isFilterModalOpen]);


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

        filtered.sort((a, b) => {
            const nameA = a.username?.toLowerCase() || '';
            const nameB = b.username?.toLowerCase() || '';
            if (sortOrder === 'asc') return nameA.localeCompare(nameB);
            return nameB.localeCompare(nameA);
        });
        return filtered;
    }, [allProfiles, searchQuery, activeFilters, sortOrder]);

    const handleProfileSelectForMap = (profile) => {
         if (profile.address && profile.address !== 'Location Undisclosed') {
            setSelectedProfileAddressForMap(profile.address);
            if (window.innerWidth < 768) { // md breakpoint
                 setMobileView('map');
            }
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
    };
    
    const countAppliedFilters = () => {
        let count = 0;
        if (activeFilters.location && activeFilters.location.trim() !== initialFiltersState.location) count++;
        if (activeFilters.description && activeFilters.description.trim() !== initialFiltersState.description) count++;
        if (activeFilters.adminStatus && activeFilters.adminStatus !== initialFiltersState.adminStatus) count++;
        return count;
    };
    const appliedFilterCount = countAppliedFilters();

    const toggleSortOrder = () => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));

    // Mobile view toggle buttons component for reusability
    const MobileViewToggleButtons = ({ className = "" }) => (
        <div className={`md:hidden flex space-x-2 justify-center ${className}`}>
            <button 
                onClick={() => setMobileView('list')} 
                className={`p-2.5 rounded-lg shadow-md transition-all ${mobileView === 'list' ? 'bg-sky-500 text-white scale-110' : 'bg-white text-slate-700 hover:bg-slate-100'}`} 
                title="Show List"
            >
                <FaListUl />
            </button>
            <button 
                onClick={() => setMobileView('map')} 
                className={`p-2.5 rounded-lg shadow-md transition-all ${mobileView === 'map' ? 'bg-sky-500 text-white scale-110' : 'bg-white text-slate-700 hover:bg-slate-100'}`} 
                title="Show Map"
            >
                <FaMapMarkedAlt />
            </button>
        </div>
    );


    if (isLoading && !allProfiles.length) { 
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-50 text-sky-600">
                <ClipLoader color="#0ea5e9" size={50} />
                <p className="mt-4 text-xl">Loading Profiles...</p>
            </div>
        );
    }
    if (error && !allProfiles.length) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-red-50 text-red-700 p-6 text-center">
                <FaExclamationTriangle className="w-16 h-16 text-red-400 mb-5" />
                <p className="text-2xl font-semibold mb-2">Oops! Something went wrong.</p>
                <p className="text-md mb-1">{error}</p>
                <p className="text-sm text-slate-600">Please try refreshing the page or check your connection.</p>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col md:flex-row h-screen overflow-hidden">
                {/* Left Pane: Filters and Profile List */}
                <div className={`
                    ${mobileView === 'map' && window.innerWidth < 768 ? 'hidden' : 'flex'} 
                    md:flex md:w-2/5 lg:w-1/3 xl:w-1/4 flex-col h-full 
                    bg-gradient-to-br from-sky-50 via-teal-50 to-cyan-50
                    border-r border-slate-200 shadow-lg z-10 
                `}>
                {/* Conditional rendering of left pane based on mobileView AND screen size */}

                    <div className="p-4 sticky top-0 bg-gradient-to-br from-sky-50/90 via-teal-50/80 to-cyan-50/90 backdrop-filter backdrop-blur-md z-20 border-b border-slate-200/50">
                        <Fade direction="down" triggerOnce duration={300}>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-semibold text-slate-700">Explore Profiles</h2>
                                <Link to="/" title="Go to Home" className="text-slate-600 hover:text-sky-500 transition-colors">
                                    <FaHome size={22} />
                                </Link>
                            </div>
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
                            <div className="relative" ref={filterContainerRef}> 
                                <div className="flex items-center justify-between space-x-2">
                                    <button
                                        onClick={() => setIsFilterModalOpen(prev => !prev)} 
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
                                <FilterModal
                                    isOpen={isFilterModalOpen}
                                    onClose={() => setIsFilterModalOpen(false)}
                                    currentFilters={activeFilters}
                                    onApplyFilters={handleApplyModalFilters}
                                />
                            </div>
                             
                             {(searchQuery || appliedFilterCount > 0 || selectedProfileAddressForMap) && (
                                <button 
                                    onClick={handleClearAllPageFilters} 
                                    className="mt-3 w-full flex items-center justify-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 transition-colors"
                                    title="Clear Search, Filters & Map Selection"
                                >
                                    <FaBroom className="mr-1.5" /> Clear All
                                </button>
                            )}
                            {/* Mobile View Toggle Buttons - shown in the header for list view */}
                            <MobileViewToggleButtons className="mt-3" />
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
                        ) : ( 
                            <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center px-4">
                                <FaSearch className="w-16 h-16 text-slate-300 mb-4" />
                                <p className="text-lg font-medium">No Profiles Found</p>
                                <p className="text-sm">Try adjusting your search query or filters.</p>
                                { (searchQuery || appliedFilterCount > 0) && 
                                    <button 
                                        onClick={handleClearAllPageFilters}
                                        className="mt-4 px-4 py-2 text-sm font-medium rounded-md text-sky-700 bg-sky-100 hover:bg-sky-200 transition-colors"
                                    >
                                        Clear Search & Filters
                                    </button>
                                }
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Pane: Map Area */}
                <div className={`
                    ${mobileView === 'list' && window.innerWidth < 768 ? 'hidden' : 'flex'} 
                    md:flex md:w-3/5 lg:w-2/3 xl:w-3/4 h-full 
                    p-0 md:p-3 lg:p-4 {/* Remove padding for mobile full screen map */}
                    bg-slate-100 
                    items-center justify-center 
                    relative {/* Important for positioning overlay buttons */}
                `}>
                {/* Conditional rendering of right pane based on mobileView AND screen size */}
                    <div className="w-full h-full bg-white md:rounded-xl shadow-xl overflow-hidden"> {/* Remove rounded for mobile full screen */}
                      <SingleAddressMap address={selectedProfileAddressForMap} />
                    </div>
                    
                    {/* Overlay Mobile View Toggle Buttons - shown over the map in map view */}
                    {window.innerWidth < 768 && (
                        <MobileViewToggleButtons className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20" />
                    )}
                </div>
            </div>
        </>
    );
};

export default ProfileListPage;