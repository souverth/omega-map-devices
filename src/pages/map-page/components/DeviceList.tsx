/* eslint-disable @typescript-eslint/no-explicit-any */
import { Empty, Input, Select, Skeleton } from "antd";
import debounce from "lodash/debounce";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useShallow } from "zustand/shallow";
import { formatNumber, getNameStatus } from "../../../utils/AppUtils";
import type { TMapProps } from "../data";
import usePageState from "../useStatePage";
import styles from "./component.module.css";
interface DeviceListProps {
  onDeviceClick: (device: TMapProps) => void;
}

/** Chuẩn hóa text: lowercase + bỏ dấu */
function normalizeText(input?: string | null): string {
  return (input ?? "")
    .toString()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("vi");
}

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

  // Keyword đã chuẩn hóa cho việc so khớp
  const normalizedKeyword = useMemo(() => normalizeText(Keyword), [Keyword]);

  const filterRef = useRef(filter); // trích lỏ 
  useEffect(() => {
    filterRef.current = filter;
  }, [filter]);

  const debouncedSearch = useMemo(
    () =>
      debounce((keyword: string) => {
        setFilter({ ...filterRef.current, Keyword: keyword });
      }, 0),
    [setFilter]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Cancel lần trước để đảm bảo keyword cũ không bị chạy
      debouncedSearch.cancel();
      debouncedSearch(e.target.value);
    },
    [debouncedSearch]
  );

  const handleStateChange = useCallback(
    (value: number) => {
      setFilter({ ...filterRef.current, State: value });
    },
    [setFilter]
  );

  // Lọc danh sách theo Keyword 
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const next = (devices ?? []).filter((device) => {
        // Kiểm tra State trước để tối ưu (fail-fast)
        const matchesState = State === 0 ? true : device?.State === State;
        if (!matchesState) return false;

        // Nếu không có keyword thì không cần check search
        if (!normalizedKeyword) return true;

        const site = normalizeText(device?.SitesName);
        const id = normalizeText(device?.DeviceId);
        const tpl = normalizeText(device?.Template);
        const grp = normalizeText(device?.Group);

        return (
          site.includes(normalizedKeyword) ||
          id.includes(normalizedKeyword) ||
          tpl.includes(normalizedKeyword) ||
          grp.includes(normalizedKeyword)
        );
      });

      setFilteredDevices(next);

      // Giữ selected nếu vẫn còn trong danh sách; nếu không, chọn phần tử đầu (nếu có)
      const stillSelected =
        selectedDevice &&
        next.some((d) => d.DeviceId === selectedDevice.DeviceId);

      if (!stillSelected) {
          setSelectedDevice(undefined as any);
      }
    }, 300); // 300ms debounce để tránh filtering quá nhiều lần

    return () => clearTimeout(timeoutId);
  }, [
    devices,
    normalizedKeyword,
    State,
    setFilteredDevices,
    selectedDevice,
    setSelectedDevice,
  ]);

  const handleItemClick = useCallback(
    (device: TMapProps) => {
      setSelectedDevice(device);
      onDeviceClick(device);
    },
    [onDeviceClick, setSelectedDevice]
  );

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>
        Devices ({formatNumber(filteredDevices?.length ?? 0)})
      </h3>

      <div className={styles.filters}>
        <Input
          type="text"
          placeholder="Tìm kiếm thiết bị..."
          value={Keyword}
          onChange={handleSearch}
          allowClear
          className={styles.searchInput}
        />

        <Select
          value={State} 
          options={stateOptions}
          onChange={handleStateChange}
          className="min-w-100px"
        />
      </div>

      <div className={styles.list}>
        {isLoading &&
          Array.from({ length: 5 }).map((_, index) => (
            <div
              className={styles.item}
              key={index}
              style={{ marginBottom: "10px" }}
            >
              <Skeleton active />
            </div>
          ))}

        {!isLoading &&
          (filteredDevices?.length ?? 0) > 0 &&
          filteredDevices!.map((device) => (
            <div
              key={device.DeviceId}
              className={`${styles.item} ${
                selectedDevice?.DeviceId === device.DeviceId
                  ? styles.activeItem
                  : ""
              }`}
              onClick={() => handleItemClick(device)}
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

        {!isLoading && (filteredDevices?.length ?? 0) === 0 && (
          <Empty style={{ marginTop: 50 }} />
        )}
      </div>
    </div>
  );
};

export default DeviceList;
