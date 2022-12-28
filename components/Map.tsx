import Map, { Marker, NavigationControl } from 'react-map-gl';

import { UserLocationMarker } from './UserLocationMarker';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function MapComp({ children, longitude, latitude }: any) {
  return (
    <Map
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAP_API_KEY}
      initialViewState={{ longitude: longitude, latitude: latitude, zoom: 10 }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      style={{ width: 'inherit', height: 'inherit' }}
      reuseMaps
      minZoom={8}
      maxZoom={12}
    >
      <NavigationControl position="bottom-right" showZoom={true} />
      <Marker latitude={latitude} longitude={longitude} anchor="center">
        <UserLocationMarker />
      </Marker>
      {children}
    </Map>
  );
}
