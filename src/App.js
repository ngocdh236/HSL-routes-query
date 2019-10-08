import React, { useState, useEffect } from 'react';
import { ApolloProvider } from '@apollo/react-hooks';

import './App.scss';

import { client } from './services/ApolloClient';
import Map from './components/Map';

function App() {
  const [currentPosition, setCurrentPosition] = useState({
    lat: 60.170481,
    lng: 24.940989
  });
  const [currentRoute, setCurrentRoute] = useState({});
  const [selectedRoutes, setSelectedRoutes] = useState([]);

  function getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        setCurrentPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  useEffect(() => {
    getPosition();
  }, []);

  const pickRoute = route => {
    const indexOfDuplicateRoute = selectedRoutes.findIndex(
      item => item === route
    );

    if (indexOfDuplicateRoute > -1) {
      setSelectedRoutes(
        selectedRoutes.filter((route, index) => index !== indexOfDuplicateRoute)
      );
    } else {
      setSelectedRoutes([...selectedRoutes, route]);
      setCurrentRoute(route);
      setCurrentPosition({
        lat: route.stops[0].lat,
        lng: route.stops[0].lon
      });
    }
  };

  return (
    <ApolloProvider client={client}>
      <div className='App'>
        <Map
          containerElement={<div style={{ height: '100vh', width: '100%' }} />}
          mapElement={<div style={{ height: '100%' }} />}
          currentPosition={currentPosition}
          currentRoute={currentRoute}
          selectedRoutes={selectedRoutes}
        ></Map>
      </div>
    </ApolloProvider>
  );
}

export default App;
