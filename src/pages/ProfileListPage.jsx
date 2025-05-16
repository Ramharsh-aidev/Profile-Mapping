import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import ProfileCard from '../components/ProfileCard'; // Assuming this path is correct
import SingleAddressMap from '../components/SingleAddressMap'; // Assuming this path is correct
import { FaSearch, FaSortAmountDown, FaSortAmountUp, FaFilter, FaTimesCircle, FaBroom, FaMapMarkedAlt, FaListUl } from 'react-icons/fa';
import { Fade } from 'react-awesome-reveal';
import ClipLoader from "react-spinners/ClipLoader";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const ProfileListPage = () => {
    const [allProfiles, setAllProfiles] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [descriptionFilter, setDescriptionFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [showFilters, setShowFilters] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mobileView, setMobileView] = useState('list');
    const [selectedProfileAddressForMap, setSelectedProfileAddressForMap] = useState(null);

    useEffect(() => {
        const fetchProfiles = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${API_BASE_URL}/users`);
                const formattedProfiles = response.data.map(user => ({
                    id: user.email, // Using email as a unique ID
                    username: user.username || user.name || 'N/A',
                    email: user.email,
                    address: user.location || 'Location Undisclosed',
                    description: user.description || 'No description.',
                    photoURL: user.photoURL || '',
                    latitude: user.latitude, // Keep for potential future use
                    longitude: user.longitude, // Keep for potential future use
                    name: user.name // Keep original name if needed
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
            const profileData = `${pUsername} ${pEmail} ${pAddress} ${pDescription}`;
            const query = searchQuery.toLowerCase();
            const locationMatch = locationFilter ? pAddress.includes(locationFilter.toLowerCase()) : true;
            const descriptionMatch = descriptionFilter ? pDescription.includes(descriptionFilter.toLowerCase()) : true;
            return profileData.includes(query) && locationMatch && descriptionMatch;
        });
        filtered.sort((a, b) => {
            const nameA = a.username?.toLowerCase() || '';
            const nameB = b.username?.toLowerCase() || '';
            if (sortOrder === 'asc') return nameA.localeCompare(nameB);
            return nameB.localeCompare(nameA);
        });
        return filtered;
    }, [allProfiles, searchQuery, locationFilter, descriptionFilter, sortOrder]);

    const handleProfileSelectForMap = (profile) => {
        if (profile.address && profile.address !== 'Location Undisclosed') {
            setSelectedProfileAddressForMap(profile.address);
            if (window.innerWidth < 768) {
                setMobileView('map');
            }
        } else {
            setSelectedProfileAddressForMap(null); // Clear if address is not valid for map
        }
    };

    const toggleSortOrder = () => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    const toggleFilters = () => setShowFilters(prev => !prev);
    const clearAllFiltersAndSelection = () => {
        setSearchQuery('');
        setLocationFilter('');
        setDescriptionFilter('');
        setSelectedProfileAddressForMap(null);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50">
                <ClipLoader color={"#4A90E2"} loading={isLoading} size={50} />
                <p className="text-lg text-gray-600 mt-4">Loading Profiles...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50 px-4 text-center">
                <FaTimesCircle className="mx-auto h-16 w-16 text-red-400" />
                <h3 className="mt-4 text-2xl font-semibold text-slate-800">Error</h3>
                <p className="mt-2 text-slate-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row h-screen overflow-hidden">
            {/* Left Pane: Filters and Profile List */}
            <div className={`
                ${mobileView === 'map' && 'hidden md:flex'}
                md:w-2/5 lg:w-1/3 xl:w-1/4 flex flex-col h-full overflow-y-auto 
                bg-white border-r border-slate-200 shadow-lg z-10 
            `}>
                 <div className="p-4 sticky top-0 bg-white z-20 border-b border-slate-200">
                  <Fade direction="down" triggerOnce duration={300}>
                    <h2 className="text-2xl font-semibold text-slate-700 mb-3">Find Profiles</h2>
                    <div className="relative mb-3">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                            type="text" placeholder="Search name, email, address..."
                            className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-sm"
                            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                         <div className="flex space-x-2">
                            <button onClick={toggleSortOrder} className="flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-slate-600 bg-white hover:bg-slate-50" title={`Sort by Username (${sortOrder === 'asc' ? 'A-Z' : 'Z-A'})`}>
                                {sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
                            </button>
                            <button onClick={toggleFilters} className={`flex items-center px-3 py-1.5 border text-xs font-medium rounded-md ${showFilters ? 'bg-sky-500 text-white border-sky-500' : 'text-slate-600 bg-white border-gray-300 hover:bg-slate-50'}`} title="Show/Hide Filters">
                                <FaFilter /> <span className="ml-1">Filters</span>
                            </button>
                            {(searchQuery || locationFilter || descriptionFilter || selectedProfileAddressForMap) && (
                                <button onClick={clearAllFiltersAndSelection} className="flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-600 bg-red-100 hover:bg-red-200" title="Clear Search, Filters & Map Selection">
                                    <FaBroom />
                                </button>
                            )}
                        </div>
                        <div className="md:hidden flex space-x-2">
                            <button onClick={() => setMobileView('list')} className={`p-2 rounded-md ${mobileView === 'list' ? 'bg-sky-500 text-white' : 'bg-gray-200 text-gray-700'}`} title="Show List"><FaListUl /></button>
                            <button onClick={() => setMobileView('map')} className={`p-2 rounded-md ${mobileView === 'map' ? 'bg-sky-500 text-white' : 'bg-gray-200 text-gray-700'}`} title="Show Map"><FaMapMarkedAlt /></button>
                        </div>
                    </div>
                  </Fade>
                </div>

                <Fade duration={300} unmountOnExit when={showFilters}>
                    <div className="p-4 border-b border-slate-200 bg-slate-50">
                        <h3 className="text-md font-semibold text-slate-700 mb-2">Advanced Filters</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-0.5" htmlFor="locationFilter">Location (Address contains)</label>
                                <input type="text" id="locationFilter" placeholder="e.g., Mountain View, Bangalore"
                                    className="block w-full px-2.5 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 text-sm"
                                    value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-0.5" htmlFor="descriptionFilter">Description (contains)</label>
                                <input type="text" id="descriptionFilter" placeholder="e.g., Admin, Developer"
                                    className="block w-full px-2.5 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 text-sm"
                                    value={descriptionFilter} onChange={(e) => setDescriptionFilter(e.target.value)} />
                            </div>
                        </div>
                    </div>
                </Fade>

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
                        <Fade triggerOnce>
                            <div className="text-center py-10 text-slate-500">
                                <FaTimesCircle className="mx-auto h-12 w-12 text-slate-300" />
                                <h3 className="mt-3 text-lg font-medium">No Profiles Found</h3>
                                <p className="mt-1 text-sm">Try adjusting your search or filters.</p>
                            </div>
                        </Fade>
                    )}
                </div>
            </div>

            {/* Right Pane: Map Area with Enhanced Styling */}
            <div className={`
                ${mobileView === 'list' && 'hidden md:flex'}
                md:w-3/5 lg:w-2/3 xl:w-3/4 h-full 
                p-2 md:p-3 lg:p-4 
                bg-gradient-to-br from-sky-100 via-sky-50 to-blue-100
                flex items-center justify-center 
                relative
            `}>
                <div className="w-full h-full bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300">
                  <SingleAddressMap address={selectedProfileAddressForMap} />
                </div>
            </div>
        </div>
    );
};

export default ProfileListPage;