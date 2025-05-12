/* eslint-disable react-hooks/exhaustive-deps */
import type React from "react";
import { useCallback, useEffect, useRef } from "react";
import { useShallow } from "zustand/shallow";
import generateFakeData from "../../utils/fakeDataUtils";
import { DeviceList, MapView } from "./components";
import styles from "./DashboardPage.module.css";
import type { ExtendedMap, TMapProps } from "./data";
import usePageState from "./useStatePage";

const DashboardPage: React.FC = () => {
  const [
    setDevices,
    setSelectedInfo,
    resetState,
    devices,
    setFilteredDevices,
    filteredDevices,
    selectedDevice,
    setIsLoading,
  ] = usePageState(
    useShallow((s) => [
      s.setData,
      s.setSelectedInfo,
      s.resetState,
      s.data,
      s.setDataFiltered,
      s.dataFiltered,
      s.selectedInfo,
      s.setIsLoading,
    ])
  );

  const mapRef = useRef<ExtendedMap | null>(null);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);

      const data = await generateFakeData(20);
      setDevices(data);
      setFilteredDevices(devices);
      setSelectedInfo(filteredDevices[0]);

      console.log("filteredDevices:", data);
      console.log("selectedDevice:", devices);

      setIsLoading(false);
    };

    init();
    console.log(filteredDevices, selectedDevice);

    return () => {
      resetState();
    };
  }, []);

  const handleDeviceClick = useCallback((device: TMapProps) => {
    if (!mapRef.current) return;
    setSelectedInfo(device);
  }, []);

  return (
    <div className={styles.container}>
      <DeviceList onDeviceClick={handleDeviceClick} />
      <MapView onMapReady={(map) => (mapRef.current = map)} />
    </div>
  );
};

export default DashboardPage;
