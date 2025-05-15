import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerRetinaIcon from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerRetinaIcon,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapComponent = ({ address }) => {
  const [position, setPosition] = React.useState(null);

  React.useEffect(() => {
    if (address) {
      geocodeAddress(address)
        .then((coords) => {
          setPosition(coords);
        })
        .catch((error) => {
          console.error("Geocoding error:", error);
        });
    }
  }, [address]);

  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${address}&format=jsonv2`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      } else {
        throw new Error("Address not found");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      throw error; // Re-throw the error to be caught by the caller
    }
  };

  const MapWithReset = ({ position }) => {
    const map = useMap();
    React.useEffect(() => {
      if (position) {
        map.setView(position, 13); // Adjust zoom level as needed
      }
    }, [position, map]);
    return null;
  };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      {position ? (
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '400px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapWithReset position={position} />
          <Marker position={position}>
            <Popup>
              {address}
            </Popup>
          </Marker>
        </MapContainer>
      ) : (
        <p>Loading map...</p>
      )}
    </div>
  );
};

export default MapComponent;