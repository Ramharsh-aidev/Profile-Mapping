import React, { useState, useEffect, useMemo } from 'react';
import ProfileCard from '../components/ProfileCard';
import { getUsers } from '../utils/authStorage';
import { Link } from 'react-router-dom';

const ProfileListPage = () => {
    const [profiles, setProfiles] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [descriptionFilter, setDescriptionFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const storedUsers = getUsers();
        setProfiles(storedUsers);
    }, []);

    const filteredProfiles = useMemo(() => {
        let filtered = profiles.filter(profile => {
            const profileData = `${profile.username} ${profile.email} ${profile.address} ${profile.description}`.toLowerCase();
            const query = searchQuery.toLowerCase();

            const locationMatch = locationFilter ? profile.address?.toLowerCase().includes(locationFilter.toLowerCase()) : true;
            const descriptionMatch = descriptionFilter ? profile.description?.toLowerCase().includes(descriptionFilter.toLowerCase()) : true;

            return profileData.includes(query) && locationMatch && descriptionMatch;
        });

        // Sort the filtered profiles
        filtered.sort((a, b) => {
            const nameA = a.username.toLowerCase();
            const nameB = b.username.toLowerCase();
            if (sortOrder === 'asc') {
                return nameA.localeCompare(nameB);
            } else {
                return nameB.localeCompare(nameA);
            }
        });

        return filtered;
    }, [profiles, searchQuery, locationFilter, descriptionFilter, sortOrder]);

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Profile List</h1>

            {/* Search Bar */}
            <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Search profiles..."
                    className="block w-full pl-10 px-4 py-2 border rounded text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Sort and Filter Buttons */}
            <div className="flex items-center justify-end mb-4 space-x-2">
                <button
                    onClick={toggleSortOrder}
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 transition duration-200"
                >
                    <svg className="w-5 h-5 inline-block align-middle" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h18M3 16h18M4 12h16"></path>
                    </svg>
                    Sort
                </button>
                <button
                    onClick={toggleFilters}
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 transition duration-200"
                >
                    <svg className="w-5 h-5 inline-block align-middle" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V14l4 4v2l-6 2H7.756l-2.122-2.121a1 1 0 00-.707-.293L4 16.586V4z"></path>
                    </svg>
                    Filter
                </button>
            </div>

            {/* Filter Inputs (Conditional Rendering) */}
            {showFilters && (
                <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">Location:</label>
                        <input
                            type="text"
                            id="location"
                            placeholder="Enter location..."
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Description:</label>
                        <input
                            type="text"
                            id="description"
                            placeholder="Enter description..."
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={descriptionFilter}
                            onChange={(e) => setDescriptionFilter(e.target.value)}
                        />
                    </div>
                </div>
            )}

            {/* Profile Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProfiles.map((profile) => (
                    <ProfileCard
                        key={profile.email}
                        profile={profile}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProfileListPage;