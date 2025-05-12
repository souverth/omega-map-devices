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

const MapView = ({ onMapReady }: MapViewProps) => {
  const [devices, selectedDevice, filteredDevices] = usePageState(
    useShallow((s) => [s.dataFiltered, s.selectedInfo, s.dataFiltered])
  );

  const mapRef = useRef<ExtendedMap | null>(null);

  useEffect(() => {
    if (mapRef.current || devices.length === 0) return; // Map đã được khởi tạo
    console.log(filteredDevices[0], selectedDevice);

    const [x, y] =
      selectedDevice == null ? filteredDevices[0].Point : selectedDevice.Point;
    const map = L.map("map").setView([x, y], 17) as ExtendedMap;
    mapRef.current = map;

    mapRef.current.flyTo([x, y], 17, { animate: true });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "IOTSOFTVN",
    }).addTo(map);

    // Tạo marker cluster group
    const markerCluster = L.markerClusterGroup();

    // Thêm marker vào cluster
    devices.forEach((device) => {
      const [x, y] = device.Point;
      const marker = L.marker([x, y]).bindPopup(PopupViewer(device));
      markerCluster.addLayer(marker);
    });

    map.addLayer(markerCluster);

    // Thêm phương thức getAllMarkers vào map instance
    map.getAllMarkers = () => {
      return markerCluster.getLayers() as L.Marker[];
    };

    // Mở popup cho điểm đầu tiên

    markerCluster.once("animationend", () => {
      // mở popup tại đây
    });

    setTimeout(() => {
      const target = selectedDevice ?? filteredDevices[0];
      if (!target) return;

      const [tx, ty] = target.Point;
      const markers = markerCluster.getLayers() as L.Marker[];

      const targetMarker = markers.find(
        (marker) =>
          marker.getLatLng().lat === tx && marker.getLatLng().lng === ty
      );

      if (targetMarker) {
        map.setView([tx, ty], 17, { animate: true });
        targetMarker.openPopup();
      }
    }, 300); // Delay nhẹ để đảm bảo marker đã render xong

    // Gọi callback onMapReady với map instance
    onMapReady?.(map);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [onMapReady]);

  return (
    <div id="map" style={{ minHeight: "calc(100vh - 79px)", width: "100%" }} />
  );
};

export default MapView;

interface MapViewProps {
  onMapReady?: (map: ExtendedMap) => void;
}
