import React from 'react';
import { withGoogleMap, GoogleMap, Marker, Polyline } from 'react-google-maps';

const colors = Object.freeze({
  BUS: 'rgb(3, 154, 229)',
  FERRY: 'rgb(0, 170, 193)',
  SUBWAY: 'rgb(255, 145, 0)',
  RAIL: 'rgb(198, 40, 40)',
  TRAM: 'rgb(67, 160, 72)'
});

const Map = withGoogleMap(props => {
  return (
    <GoogleMap
      defaultZoom={14}
      defaultCenter={{ lat: -34.397, lng: 150.644 }}
      center={props.currentPosition}
    >
      <Marker position={props.currentPosition} />
      {props.selectedRoutes.map(route => (
        <Polyline
          key={route.gtfsId}
          path={route.stops.map(stop => {
            const test = { lat: stop.lat, lng: stop.lon };
            return test;
          })}
          geodesic={true}
          options={{
            strokeColor: `${
              route.gtfsId === props.currentRoute.gtfsId
                ? 'gray'
                : colors[route.mode]
            }`,
            strokeWeight: 2
          }}
        />
      ))}
    </GoogleMap>
  );
});

export default Map;
