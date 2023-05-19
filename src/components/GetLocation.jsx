import React, { useState, useEffect } from "react";
import Map from "./Map";

function GetLocation({ address }) {
  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=` + process.env.REACT_APP_GOOGLE_API_KEY;

    fetch(geocodeUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          setCoordinates({ latitude: lat, longitude: lng });
        } else {
          setCoordinates(null);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [address]);

  return (
    <div>
      {coordinates ? <Map latitude={coordinates.latitude} longitude={coordinates.longitude} /> : <Map />}
    </div>
  );
}

export default GetLocation;


