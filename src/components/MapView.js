import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';

const busIcon = new L.Icon({
  iconUrl: '/icons/School_Bus.png',
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

const MapView = ({ route, currentIndex }) => {
  const current = route[currentIndex];
  const fullPath = route.map(p => [p.latitude, p.longitude]);
  const traveledPath = route.slice(0, currentIndex + 1).map(p => [p.latitude, p.longitude]);

  return (
    <MapContainer center={[route[0].latitude, route[0].longitude]} zoom={15} style={{ height: '80vh' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <Polyline positions={fullPath} color="gray" weight={4} />

      <Polyline positions={traveledPath} color="blue" weight={5} />

      <Marker position={[current.latitude, current.longitude]} icon={busIcon} />
    </MapContainer>
  );
};

export default MapView;
