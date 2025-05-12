/* eslint-disable react-hooks/exhaustive-deps */
import type { SelectProps } from "antd";
import type React from "react";
import { useCallback, useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { generateFakeData } from "../../utils/AppUtils";
import { DeviceList, MapView } from "./components";
import styles from "./DashboardPage.module.css";
import type { TMapProps } from "./data";
import usePageState from "./useStatePage";

const DashboardPage: React.FC = () => {
  const [
    setDevices,
    setSelectedInfo,
    resetState,
    setFilteredDevices,
    setIsLoading,
    setOptionState
  ] = usePageState(
    useShallow((s) => [
      s.setData,
      s.setSelectedInfo,
      s.resetState,
      s.setDataFiltered,
      s.setIsLoading,
      s.setStateOptions
    ])
  );

  useEffect(() => {
    const initialPage = async () => {
      setIsLoading(true);

      setOptionState(DEVICE_STATES)

      const dataGenerate = await generateFakeData(5_000);

      setDevices(dataGenerate);
      setFilteredDevices(dataGenerate);
      setSelectedInfo(dataGenerate[0]);

      setIsLoading(false);
    };

    initialPage();

    return () => {
      resetState();
    };
  }, []);

  const handleDeviceClick = useCallback((device: TMapProps) => {
    setSelectedInfo(device);
  }, []);

  return (
    <div className={styles.container}>
      <DeviceList onDeviceClick={handleDeviceClick} />
      <MapView />
    </div>
  );
};

export default DashboardPage;

const DEVICE_STATES: SelectProps["options"] = [
  { label: "All", value: 0 },
  { label: "Online", value: 1 },
  { label: "Offline", value: 2 },
  { label: "Warning", value: 3 },
];