/* eslint-disable react-hooks/exhaustive-deps */
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import { useShallow } from "zustand/shallow";
import iconUrl from "../../../assets/placeholder.png";
import type { ExtendedMap } from "../data";
import usePageState from "../useStatePage";
import PopupViewer from "./PopupView";

// --- CẤU HÌNH MẶC ĐỊNH ---

// Tạo một icon mặc định cho tất cả các marker trên bản đồ.
const defaultIcon = L.icon({
  iconUrl: iconUrl, // Đường dẫn đến ảnh icon.
  shadowUrl: iconShadow, // Đường dẫn đến ảnh bóng của icon.
  iconSize: [25, 25], // Kích thước của icon.
  iconAnchor: [12, 25], // Vị trí "mỏ neo" của icon (điểm trên icon tương ứng với tọa độ).
  popupAnchor: [1, -25], // Vị trí của popup so với icon.
  shadowSize: [35, 25], // Kích thước của ảnh bóng.
});

// Ghi đè icon mặc định của Leaflet Marker bằng icon tùy chỉnh đã tạo.
L.Marker.prototype.options.icon = defaultIcon;

// --- COMPONENT MAPVIEW ---

const MapView = () => {
  // Lấy danh sách thiết bị và thiết bị đang được chọn từ state chung của trang.
  // `useShallow` giúp component chỉ re-render khi các giá trị trong mảng thực sự thay đổi.
  const [devices, selectedDevice] = usePageState(
    useShallow((s) => [s.data, s.selectedInfo, s.dataFiltered])
  );

  // Sử dụng `useRef` để lưu trữ đối tượng bản đồ (map instance), giúp nó không bị khởi tạo lại sau mỗi lần re-render.
  const mapRef = useRef<ExtendedMap | null>(null);

  // Hàm khởi tạo bản đồ.
  const initMap = () => {
    // Lấy đối tượng map từ ref.
    let map = mapRef.current;
    // Nếu bản đồ đã được khởi tạo rồi thì không làm gì cả.
    if (map) return;

    // Nếu không có danh sách thiết bị hoặc chưa có thiết bị nào được chọn thì không khởi tạo.
    if (devices.length === 0 || selectedDevice == null) return;

    // Lấy tọa độ (kinh độ, vĩ độ) của thiết bị đang được chọn.
    const [x, y] = selectedDevice.Point;
    // Tạo đối tượng LatLng của Leaflet từ tọa độ.
    const targetLatLng = L.latLng(x, y);

    // Khởi tạo bản đồ, gắn nó vào thẻ div có id="map", và đặt vị trí trung tâm ban đầu.
    map = L.map("map").setView(targetLatLng, 13); // 13 là mức zoom.
    // Lưu lại đối tượng map vào ref để sử dụng sau này.
    mapRef.current = map;

    // Thêm lớp nền cho bản đồ (tile layer) từ OpenStreetMap.
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "IOTSOFTVN", // Dòng chữ ghi công ở góc bản đồ.
    }).addTo(map);

    // Tạo một nhóm cluster để quản lý các marker. `chunkedLoading` giúp tải marker theo từng cụm.
    const clusterGroup = L.markerClusterGroup({ chunkedLoading: true });

    // Duyệt qua danh sách các thiết bị để tạo marker cho từng cái.
    devices.forEach((device) => {
      const [dx, dy] = device.Point; // Lấy tọa độ của thiết bị.
      // Tạo marker tại tọa độ và gắn nội dung popup cho nó.
      const marker = L.marker([dx, dy]).bindPopup(PopupViewer(device));
      // Thêm marker vào nhóm cluster.
      clusterGroup.addLayer(marker);
    });

    // Thêm nhóm cluster (chứa tất cả marker) vào bản đồ.
    map.addLayer(clusterGroup);

    // Mở rộng đối tượng map, thêm một hàm tùy chỉnh để lấy tất cả các marker.
    map.getAllMarkers = () => clusterGroup.getLayers() as L.Marker[];
  };

  // Hàm cập nhật bản đồ khi có một thiết bị mới được chọn.
  const updateSelectedMarker = () => {
    // Nếu không có dữ liệu hoặc không có thiết bị được chọn thì thoát.
    if (devices.length === 0 || !selectedDevice) return;

    // Lấy tọa độ của thiết bị mới được chọn.
    const [x, y] = selectedDevice.Point;
    const targetLatLng = L.latLng(x, y);

    // Lấy đối tượng map từ ref.
    const map = mapRef.current;

    // Di chuyển (bay) mượt mà đến tọa độ của thiết bị được chọn.
    map.flyTo(targetLatLng, 13, { animate: true });

    // Sau khi "bay" xong, thực hiện hành động tiếp theo.
    map.once("moveend", () => {
      // Lấy danh sách tất cả các marker trên bản đồ.
      const markers = map.getAllMarkers?.() || [];

      // Tìm marker tương ứng với thiết bị đang được chọn bằng cách so sánh tọa độ.
      const targetMarker = markers.find((m: L.Marker) => {
        const latlng = m.getLatLng();
        return latlng.lat === x && latlng.lng === y;
      });

      // Nếu tìm thấy marker, mở popup của nó lên.
      if (targetMarker) {
        targetMarker.openPopup();
      }
    });
  };

  // Hook `useEffect` sẽ chạy mỗi khi `selectedDevice` thay đổi.
  useEffect(() => {
    // Khởi tạo bản đồ (nếu chưa có).
    initMap();
    // Cập nhật vị trí và mở popup cho marker được chọn.
    updateSelectedMarker();

    // Hàm dọn dẹp (cleanup function) sẽ được gọi khi component bị unmount.
    return () => {
      // Xóa đối tượng bản đồ để giải phóng bộ nhớ.
      mapRef.current?.remove();
      // Đặt ref về null.
      mapRef.current = null;
    };
  }, [selectedDevice]); // Dependency array: chỉ chạy lại effect khi `selectedDevice` thay đổi.

  // Render một thẻ div để Leaflet sử dụng làm container cho bản đồ.
  return (
    <div id="map" style={{ minHeight: "calc(100vh - 79px)", width: "100%" }} />
  );
};

// Xuất component để có thể sử dụng ở nơi khác.
export default MapView;
