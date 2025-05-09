/* eslint-disable react-hooks/exhaustive-deps */
import type { Marker } from "leaflet";
import type React from "react";
import { useCallback, useEffect } from "react";
import { useShallow } from "zustand/shallow";
import generateFakeData from "../../utils/fakeDataUtils";
import { DeviceList, MapView } from "./components";
import styles from "./DashboardPage.module.css";
import type { TMapProps } from "./data";
import usePageState from "./useStatePage";

const DashboardPage: React.FC = () => {
  const [setDevices, setSelectedInfo, mapRef, setMapRef, resetState] =
    usePageState(
      useShallow((s) => [
        s.setData,
        s.setSelectedInfo,
        s.mapRef,
        s.setMapRef,
        s.resetState,
      ])
    );

  useEffect(() => {
    setDevices(generateFakeData(20));
    return () => {
      resetState();
    };
  }, []);

  const handleDeviceClick = useCallback((device: TMapProps) => {
    if (!mapRef) return;

    if (mapRef.current) {
      setSelectedInfo(device);

      const [x, y] = device.Point;
      mapRef.current.flyTo([x, y], 17, { animate: true });
      setMapRef(mapRef.current);

      // Tìm và mở popup của marker được chọn
      const markers = mapRef.current.getAllMarkers();
      const targetMarker = markers.find(
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
      <DeviceList onDeviceClick={handleDeviceClick} />
      <MapView />
    </div>
  );
};

export default DashboardPage;
