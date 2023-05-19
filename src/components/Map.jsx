import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from '../images/food_truck.jpeg';
import locationMarker from '../images/location-marker.png';
import AddressForm from './AddressForm';
import "leaflet/dist/leaflet.css"
import leafGreen from '../images/leaf-green.png'
import leafShadow from '../images/leaf-shadow.png'
import leafRed from '../images/leaf-red.png'

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

let redIcon = L.icon({
  iconUrl: leafRed,
  shadowUrl: leafShadow,
  iconSize: [38, 95],
  shadowSize: [50, 64],
  iconAnchor: [22, 94],
  shadowAnchor: [4, 62],
  popupAnchor: [-3, -76]
});

let greenIcon = L.icon({
  iconUrl: leafGreen,
  shadowUrl: leafShadow,
  iconSize: [20, 50],
  shadowSize: [32, 50],
  iconAnchor: [22, 94],
  shadowAnchor: [4, 62],
  popupAnchor: [-3, -76]
});

function Map({ latitude, longitude }) {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortedData, setSortedData] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://data.sfgov.org/resource/rqzj-sfat.json?$limit=5000&$$app_token=B5fHsalOXk2n9XhzWT2ORHtEG");
        const jsonData = await response.json();
        setData(jsonData);
        setSortedData(jsonData);
        console.log("Retrieved " + jsonData.length + " records from the dataset!");
        console.log(jsonData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (mapRef.current && latitude > -150 && longitude > -150) {
      const map = mapRef.current;
      map.flyTo([latitude, longitude], 15);
    }
  }, [latitude, longitude]);

  useEffect(() => {
    filterAndSortData();
  }, [searchQuery]);

  const filterAndSortData = () => {
    const filteredData = data.filter(item =>
      item.fooditems && item.fooditems.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    const sortedData = filteredData.sort((a, b) =>
      a.applicant.localeCompare(b.applicant)
    );
  
    setSortedData(sortedData);
  };
  
  

  return (
<div>
  <input
    className='search'
    type="text"
    placeholder="Search food items"
    value={searchQuery}
    onChange={event => setSearchQuery(event.target.value)}
  />
<div className="mapBorder">
  {latitude > -150 && longitude > -150 ? (
    <MapContainer className='map' ref={mapRef} center={[latitude, longitude]} zoom={15} style={{  height: '300px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {sortedData.map((item, index) => (
        <Marker key={index} position={[item.latitude, item.longitude]} icon={greenIcon}>
          <Popup>
            <strong>{item.applicant}</strong>
            <br />
            {item.address}
            <br />
            <br/>
            Food Items: <ul><li key={index}>{item.fooditems}</li></ul>
          </Popup>
        </Marker>
      ))}
      <Marker position={[latitude, longitude]} >
        <Popup>
          Location
        </Popup>
      </Marker>
    </MapContainer>
  ) : (
    <MapContainer center={[37.7749, -122.4194]} zoom={13} style={{ height: '60vh', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {sortedData.map((item, index) => (
        <Marker key={index} position={[item.latitude, item.longitude]} icon={greenIcon}>
          <Popup>
            <strong>{item.applicant}</strong>
            <br />
            {item.address}
            <br />
            <br/>
            Food Items: <ul><li key={index}>{item.fooditems}</li></ul>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )}
  </div>
</div>

  );
  
}


export default Map;


