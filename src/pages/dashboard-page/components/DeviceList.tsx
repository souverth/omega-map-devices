/* eslint-disable react-hooks/exhaustive-deps */
import { Empty, Input, Select, Skeleton } from "antd";
import debounce from "lodash/debounce";
import { useCallback, useEffect, useMemo } from "react";
import { useShallow } from "zustand/shallow";
import { formatNumber, getNameStatus } from "../../../utils/AppUtils";
import type { TMapProps } from "../data";
import usePageState from "../useStatePage";
import styles from "./DeviceList.module.css";

const DeviceList = ({ onDeviceClick }: DeviceListProps) => {
  const [
    devices,
    filter,
    setFilter,
    filteredDevices,
    setFilteredDevices,
    selectedDevice,
    isLoading,
    setSelectedDevice,
    stateOptions,
  ] = usePageState(
    useShallow((s) => [
      s.data,
      s.filter,
      s.setFilter,
      s.dataFiltered,
      s.setDataFiltered,
      s.selectedInfo,
      s.isLoading,
      s.setSelectedInfo,
      s.stateOptions,
    ])
  );

  const { Keyword, State } = filter;

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const keyword = e.target.value;
      debouncedSearch(keyword);
    },
    [filter, setFilter]
  );

  const debouncedSearch = useMemo(
    () =>
      debounce((keyword: string) => {
        setFilter({ ...filter, Keyword: keyword });
      }, 300), // delay 300ms
    [setFilter]
  );

  const handleStateChange = useCallback(
    (value: number) => {
      setFilter({ ...filter, State: value });
    },
    [filter, setFilter]
  );

  useEffect(() => {
    const newFiltered = devices.filter((device) => {
      const matchesSearch =
        device.SitesName.toLowerCase().includes(Keyword.toLowerCase()) ||
        device.DeviceId.toLowerCase().includes(Keyword.toLowerCase()) ||
        device.Template.toLowerCase().includes(Keyword.toLowerCase()) ||
        device.Group.toLowerCase().includes(Keyword.toLowerCase());

      const matchesState = State == 0 ? true : device.State === State;

      return matchesSearch && matchesState;
    });

    setFilteredDevices(newFiltered);

    if (
      !selectedDevice ||
      !newFiltered.find((d) => d.DeviceId === selectedDevice.DeviceId)
    )
      setSelectedDevice(newFiltered[0]);
  }, [State, Keyword]);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>
        Devices ({formatNumber(filteredDevices.length)})
      </h3>

      <div className={styles.filters}>
        <Input
          type="text"
          placeholder="Tìm kiếm thiết bị..."
          value={Keyword}
          onChange={handleSearch}
          className={styles.searchInput}
        />

        <Select
          defaultValue={State}
          options={stateOptions}
          onChange={handleStateChange}
          className="min-w-100px"
        ></Select>
      </div>

      <div className={styles.list}>
        {isLoading &&
          [...new Array(5)].map((_, index) => (
            <div
              className={styles.item}
              key={index}
              style={{ marginBottom: "10px" }}
            >
              <Skeleton active></Skeleton>
            </div>
          ))}

        {!isLoading &&
          filteredDevices.length > 0 &&
          filteredDevices.map((device) => (
            <div
              key={device.DeviceId}
              className={`${styles.item} ${
                selectedDevice?.DeviceId === device.DeviceId
                  ? styles.activeItem
                  : ""
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
                    styles[getNameStatus(device.State).toLowerCase()]
                  }`}
                >
                  {getNameStatus(device.State)}
                </span>
              </div>
              <div className={styles.details}>
                <p>Last: {device.LastCommunication}</p>
              </div>
            </div>
          ))}

        {!isLoading && filteredDevices.length == 0 && (
          <Empty style={{ marginTop: 50 }} />
        )}
      </div>
    </div>
  );
};

export default DeviceList;

interface DeviceListProps {
  onDeviceClick: (device: TMapProps) => void;
}
