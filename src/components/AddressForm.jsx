
import { GoogleMap, Marker } from '@react-google-maps/api';
import React, { useEffect, useState, useRef } from 'react';
import GetLocation from './GetLocation';
import foodTruck from '../images/food_truck.jpeg'
import { useParams } from 'react-router-dom';

function AddressForm() {
  const [address, setAddress] = useState('');
  const autocompleteRef = useRef(null);

  useEffect(() => {
    // Load Google Maps API script dynamically
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places&callback=initAutocomplete`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    window.initAutocomplete = () => {
      // Create the autocomplete instance
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        document.getElementById('location-input'),
        {
          types: ['address'],
          componentRestrictions: { country: 'us' }, // Restrict to US addresses
        }
      );

      // Listen for place selection event
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        setAddress(place.formatted_address);
      });
    };

    return () => {
      // Clean up the dynamically loaded script when component unmounts
      document.head.removeChild(script);
    };
  }, []);

  const handleSubmit = () => {
    // Do something with the address value
    console.log('Submitted address:', address);
    setAddress(address)
  };

  return (
    <div className='addressMap'>
      
      <div className="card-container">
      <h4 className='title'>San Francisco Food Truck Adventure</h4>
        <div className="panel">
          <div>
            <img className="sb-title-icon" src="https://fonts.gstatic.com/s/i/googlematerialicons/location_pin/v5/24px.svg" alt="" />
            <span className="sb-title">Address Selection</span>
          </div>
          <input type="text" placeholder="Address" id="location-input" />
        </div>
      </div>
      <div className='mapContainer'>
      <GetLocation address ={address}/>
      </div>
    </div>
  );
}

export default AddressForm;

