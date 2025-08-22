/* eslint-disable react-hooks/exhaustive-deps */
import { FloatButton, type SelectProps } from "antd";
import type React from "react";
import { useCallback, useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { generateFakeData } from "../../utils/AppUtils";
import { DeviceList, MapView } from "./components";
import styles from "./MapPage.module.css";
import type { TMapProps } from "./data";
import usePageState from "./useStatePage";
import { ReloadOutlined } from "@ant-design/icons";

const MapPage: React.FC = () => {
  const [
    setDevices,
    setSelectedInfo,
    resetState,
    setFilteredDevices,
    setIsLoading,
    setOptionState,
    triggerMapReset,
  ] = usePageState(
    useShallow((s) => [
      s.setData,
      s.setSelectedInfo,
      s.resetState,
      s.setDataFiltered,
      s.setIsLoading,
      s.setStateOptions,
      s.triggerMapReset,
      s.data,
    ])
  );

  useEffect(() => {
    const initialPage = async () => {
      setIsLoading(true);
      setOptionState(DEVICE_STATES);

      const dataGenerate = await generateFakeData(100);

      setDevices(dataGenerate);
      setFilteredDevices(dataGenerate);
      // setSelectedInfo(dataGenerate[0]);

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

  const handleResetMap = useCallback(() => {
    setSelectedInfo(undefined as unknown as TMapProps); // Clear selected device
    triggerMapReset(); // Trigger map reset bất kể có selected device hay không
  }, [setSelectedInfo, triggerMapReset]);

  return (
    <div className={styles.container}>
      <DeviceList onDeviceClick={handleDeviceClick} />
      <MapView />
      <FloatButton
        icon={<ReloadOutlined />}
        style={{ insetInlineEnd: 20 }}
        onClick={handleResetMap}
        tooltip="Reset map view"
      />
    </div>
  );
};

export default MapPage;

const DEVICE_STATES: SelectProps["options"] = [
  { label: "All", value: 0 },
  { label: "Online", value: 1 },
  { label: "Offline", value: 2 },
  { label: "Warning", value: 3 },
];
