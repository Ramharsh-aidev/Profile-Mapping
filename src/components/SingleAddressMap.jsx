import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FaMapMarkerAlt, FaSpinner, FaExclamationTriangle } from 'react-icons/fa'; // Icons for states

// Leaflet Icon Setup (using unpkg for reliability)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// --- Geocoding Logic ---
const geocodeAddress = async (addr) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addr)}&format=jsonv2&addressdetails=1&limit=1`
    );
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Nominatim API request failed: ${response.status} ${response.statusText}. Body: ${errorBody}`);
    }
    const data = await response.json();
    if (data && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    } else {
      throw new Error("Address not found by geocoding service.");
    }
  } catch (error) {
    console.error("Geocoding process error in SingleAddressMap:", error.message);
    throw error; 
  }
};

// --- Map State Components ---
const MapPlaceholder = () => (
  <div className="flex flex-col items-center justify-center h-full text-slate-500">
    <FaMapMarkerAlt className="w-16 h-16 text-slate-300 mb-4" />
    <p className="text-lg">Select a profile's "View on Map"</p>
    <p className="text-sm">to display its location here.</p>
  </div>
);

const MapLoading = ({ address }) => (
  <div className="flex flex-col items-center justify-center h-full text-sky-600">
    <FaSpinner className="animate-spin w-12 h-12 mb-4" />
    <p className="text-lg">Locating address:</p>
    <p className="text-md font-medium truncate max-w-xs px-2" title={address}>{address}</p>
  </div>
);

const MapError = ({ errorMsg }) => (
  <div className="flex flex-col items-center justify-center h-full text-red-600 p-4 text-center">
    <FaExclamationTriangle className="w-12 h-12 text-red-400 mb-4" />
    <p className="text-lg font-semibold">Map Error</p>
    <p className="text-sm">{errorMsg || "Could not load location."}</p>
  </div>
);

// --- Leaflet Specific Components ---
const MapViewUpdater = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { animate: true, duration: 1.0 });
    }
  }, [center, zoom, map]);
  return null;
};

const ActualMap = ({ position, address }) => (
  <MapContainer
    center={position}
    zoom={14}
    style={{ height: '100%', width: '100%', borderRadius: 'inherit' }}
    scrollWheelZoom={true}
    key={position.join('-')} 
  >
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    />
    <MapViewUpdater center={position} zoom={14} />
    <Marker position={position}>
      <Popup minWidth={90}>{address}</Popup>
    </Marker>
  </MapContainer>
);


// --- Main SingleAddressMap Component ---
const SingleAddressMap = ({ address }) => {
  const [position, setPosition] = useState(null);
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const attemptGeocode = useCallback(async (addrToGeocode) => {
    if (!addrToGeocode || addrToGeocode === 'Location Undisclosed') { // Also check for placeholder
      setStatus('idle');
      setPosition(null);
      return;
    }
    setStatus('loading');
    setPosition(null);
    setErrorMsg('');
    try {
      const coords = await geocodeAddress(addrToGeocode);
      setPosition(coords);
      setStatus('success');
    } catch (error) {
      setErrorMsg(error.message || "Failed to find address on map.");
      setPosition(null);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    attemptGeocode(address);
  }, [address, attemptGeocode]);

  if (status === 'idle') {
    return <MapPlaceholder />;
  }
  if (status === 'loading') {
    return <MapLoading address={address} />;
  }
  if (status === 'error') {
    return <MapError errorMsg={errorMsg} />;
  }
  if (status === 'success' && position) {
    return <ActualMap position={position} address={address} />;
  }

  return <MapPlaceholder />; // Default fallback
};

export default SingleAddressMap;