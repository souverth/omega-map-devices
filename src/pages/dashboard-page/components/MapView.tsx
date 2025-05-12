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

const defaultIcon = L.icon({
  iconUrl: iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [1, -25],
  shadowSize: [35, 25],
});

L.Marker.prototype.options.icon = defaultIcon;

const MapView = () => {
  const [devices, selectedDevice] = usePageState(
    useShallow((s) => [s.data, s.selectedInfo, s.dataFiltered])
  );

  const mapRef = useRef<ExtendedMap | null>(null);

  const handleMapping = () => {
    if (devices.length === 0 || !selectedDevice) return;

    const [x, y] = selectedDevice.Point;
    const targetLatLng = L.latLng(x, y);

    let map = mapRef.current;

    // Nếu chưa có map: khởi tạo và thêm tile + markers
    if (!map) {
      map = L.map("map").setView(targetLatLng, 13);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "IOTSOFTVN",
      }).addTo(map);

      // Tạo và lưu cluster
      const clusterGroup = L.markerClusterGroup({ chunkedLoading: true });

      devices.forEach((device) => {
        const [dx, dy] = device.Point;
        const marker = L.marker([dx, dy], { draggable: true }).bindPopup(
          PopupViewer(device)
        );
        clusterGroup.addLayer(marker);
      });

      map.addLayer(clusterGroup);

      // Gắn vào mapRef nếu cần dùng lại
      map.getAllMarkers = () => clusterGroup.getLayers() as L.Marker[];
    }

    // Từ đây map đã sẵn sàng
    map.flyTo(targetLatLng, 13, { animate: true });

    // Mở popup sau khi bay xong
    map.once("moveend", () => {
      const markers = map.getAllMarkers?.() || [];

      const targetMarker = markers.find((m: L.Marker) => {
        const latlng = m.getLatLng();
        return latlng.lat === x && latlng.lng === y;
      });

      if (targetMarker) {
        targetMarker.openPopup();
      }
    });
  };

  useEffect(() => {
    handleMapping();
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [selectedDevice]);

  return (
    <div id="map" style={{ minHeight: "calc(100vh - 79px)", width: "100%" }} />
  );
};

export default MapView;
