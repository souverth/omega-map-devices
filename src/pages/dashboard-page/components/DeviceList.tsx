import { Input, Select, type SelectProps } from "antd";
import { useCallback, useMemo } from "react";
import { useShallow } from "zustand/shallow";
import type { TMapProps } from "../data";
import usePageState from "../useStatePage";
import styles from "./DeviceList.module.css";

const DeviceList = ({ onDeviceClick, selectedDeviceId }: DeviceListProps) => {
  const [devices, filter, setFilter] = usePageState(useShallow((s) => [s.data, s.filter, s.setFilter]))

  const { Keyword, State } = filter

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, Keyword: e.target.value })
  }, [filter, setFilter]);

  const handleStateChange = useCallback((value: string) => {
     setFilter({ ...filter, State: value })
  }, [filter, setFilter]);

  const filteredDevices = useMemo(() => {
    return devices.filter((device) => {
      const matchesSearch =
        device.SitesName.toLowerCase().includes(Keyword.toLowerCase()) ||
        device.DeviceId.toLowerCase().includes(Keyword.toLowerCase()) ||
        device.Template.toLowerCase().includes(Keyword.toLowerCase()) ||
        device.Group.toLowerCase().includes(Keyword.toLowerCase());

      const matchesState =
        State === "All" ? true : device.State === State;

      return matchesSearch && matchesState;
    });
  }, [devices, Keyword, State]);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Devices ({filteredDevices.length})</h3>

      <div className={styles.filters}>
        <Input
          type="text"
          placeholder="Tìm kiếm thiết bị..."
          value={Keyword}
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
  onDeviceClick: (device: TMapProps) => void;
  selectedDeviceId?: string | null;
}
