import type { Marker } from "leaflet";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import generateFakeData from "../../utils/fakeDataUtils";
import { DeviceList, MapView } from "./components";
import type { ExtendedMap } from "./components/MapView";
import styles from "./DashboardPage.module.css";
import type { TMapProps } from "./data";

const DashboardPage: React.FC = () => {
  const [fakeData, setFakeData] = useState<TMapProps[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  useEffect(() => {
    setFakeData(generateFakeData(20));
    console.log(fakeData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mapRef = useRef<ExtendedMap | null>(null);

const handleDeviceClick = useCallback((device: TMapProps) => {
    if (mapRef.current) {
      setSelectedDeviceId(device.DeviceId);

      const [ x, y ] = device.Point;
      mapRef.current.flyTo([x, y], 17, { animate: true });

      // Tìm và mở popup của marker được chọn
      const markers = mapRef.current.getAllMarkers();
      const targetMarker =  markers.find(
        (marker: Marker) =>
          marker.getLatLng().lat === x && marker.getLatLng().lng === y
      );

      if (targetMarker) {
        targetMarker.openPopup();
      }
    }
  }, []);


  return (
    <div className={styles.container}>
      <DeviceList
        devices={fakeData}
        onDeviceClick={handleDeviceClick}
        selectedDeviceId={selectedDeviceId}
      />
      <MapView
        devices={fakeData}
        onMapReady={(map) => (mapRef.current = map)}
      />
    </div>
  );
};

export default DashboardPage;
