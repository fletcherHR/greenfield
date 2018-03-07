import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker} from "react-google-maps";

const GoogleMaps = withScriptjs(withGoogleMap((props) => {
  console.log('these are the props in Map.js: ', this.props);
  return (
    <GoogleMap
      defaultZoom={13}
      defaultCenter={{ lat: 40.75062510000001, lng: -73.9766126 }}
      center={{ lat: 40.75062510000001, lng: -73.9766126 }}
    >
      {
        props.tasks.map(marker => (
          <Marker
            position={{ lat: marker.latitude, lng: marker.longitude }}
            key={marker.id}
          />
        ))
      }
    </GoogleMap>
  );
}));

export default GoogleMaps
