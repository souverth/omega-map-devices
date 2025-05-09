import { Input, Select, type SelectProps } from "antd";
import { useCallback, useMemo, useState } from "react";
import type { TMapProps } from "../data";
import styles from "./DeviceList.module.css";

const DeviceList = ({ devices, onDeviceClick, selectedDeviceId }: DeviceListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState<string>("All");

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleStateChange = useCallback((value: string) => {
    setSelectedState(value);
  }, []);

  const filteredDevices = useMemo(() => {
    return devices.filter((device) => {
      const matchesSearch =
        device.SitesName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.DeviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.Template.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.Group.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesState =
        selectedState === "All" ? true : device.State === selectedState;

      return matchesSearch && matchesState;
    });
  }, [devices, searchTerm, selectedState]);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Devices ({filteredDevices.length})</h3>

      <div className={styles.filters}>
        <Input
          type="text"
          placeholder="Tìm kiếm thiết bị..."
          value={searchTerm}
          onChange={handleSearch}
          className={styles.searchInput}
        />

        <Select
          defaultValue="All"
          options={DEVICE_STATES}
          onChange={handleStateChange}
          className="min-w-100px"
        ></Select>
      </div>

      <div className={styles.list}>
        {filteredDevices.map((device) => (
          <div
            key={device.DeviceId}
            className={`${styles.item} ${
              selectedDeviceId === device.DeviceId ? styles.activeItem : ""
            }`}
            onClick={() => onDeviceClick(device)}
          >
            <div className={styles.header}>
              <span className={styles.name}>
                {device.SitesName}{" "}
                <span className={styles.deviceIdTitle}>
                  [{device.DeviceId}]{" "}
                </span>
              </span>
              <span
                className={`${styles.status} ${
                  styles[device.State.toLowerCase()]
                }`}
              >
                {device.State}
              </span>
            </div>
            <div className={styles.details}>
              <p>Last: {device.LastCommunication}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeviceList;

const DEVICE_STATES: SelectProps["options"] = [
  { label: "Tất cả", value: "All" },
  { label: "Online", value: "Online" },
  { label: "Offline", value: "Offline" },
  { label: "Warning", value: "Warning" },
];

interface DeviceListProps {
  devices: TMapProps[];
  onDeviceClick: (device: TMapProps) => void;
  selectedDeviceId?: string | null;
}
