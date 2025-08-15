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
import PopupViewer from "./PopupView.tsx";

const defaultIcon = L.icon({
  iconUrl: iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [1, -25],
  shadowSize: [35, 25],
});

L.Marker.prototype.options.icon = defaultIcon;

const DEFAULT_BOUNDS = L.latLngBounds(
  [-35, -25], // Góc Tây Nam (Nam Phi)
  [55, 150]   // Góc Đông Bắc (Nhật Bản)
);

const MapView = () => {
  const [devices, selectedDevice, shouldResetMap] = usePageState(
    useShallow((s) => [s.data, s.selectedInfo, s.shouldResetMap])
  );

  const mapRef = useRef<ExtendedMap | null>(null);
  const isDefaultView = useRef(true); // Theo dõi trạng thái view mặc định

  const initMap = () => {
    let map = mapRef.current;
    if (map) return;
    if (devices.length === 0) return;

    map = L.map("map");
    mapRef.current = map;

    // Theo dõi sự thay đổi của view (zoom/pan)
    map.on('zoomend moveend', () => {
      const currentBounds = map.getBounds();
      const currentZoom = map.getZoom();
      
      // Kiểm tra xem view hiện tại có phải là view mặc định không
      isDefaultView.current = (
        currentZoom === 4 &&
        DEFAULT_BOUNDS.contains(currentBounds) &&
        currentBounds.contains(DEFAULT_BOUNDS)
      );
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "IOTSOFTVN",
      //  noWrap: true, // Ngăn lặp tile theo chiều ngang
    }).addTo(map);

    const clusterGroup = L.markerClusterGroup({ chunkedLoading: true });

    devices.forEach((device) => {
      const [dx, dy] = device.Point;
      const marker = L.marker([dx, dy]).bindPopup(PopupViewer(device));
      clusterGroup.addLayer(marker);
    });

    map.addLayer(clusterGroup);

    // Set initial view to default bounds
    map.fitBounds(DEFAULT_BOUNDS, { 
      padding: [20, 20],
      duration: 1.5,
      easeLinearity: 0.25,
      animate: true 
    });

    map.getAllMarkers = () => clusterGroup.getLayers() as L.Marker[];
  };

  const resetMapView = () => {
    const map = mapRef.current;
    if (!map) return;

    map.flyToBounds(DEFAULT_BOUNDS, {
      animate: true,
      duration: 1.5,
      easeLinearity: 0.25,
      padding: [20, 20]
    });
    
    // Reset trạng thái view mặc định
    isDefaultView.current = true;
  };

  const updateSelectedMarker = () => {
    const map = mapRef.current;
    if (!map) return;

    // Nếu không có selectedDevice, thực hiện reset view
    if (!selectedDevice) {
      resetMapView();
      return;
    }

    const [x, y] = selectedDevice.Point;
    const targetLatLng = L.latLng(x, y); 

    
    map.flyTo(targetLatLng, 13, {
      animate: true,
      duration: 1.5,
      easeLinearity: 0.25,
    });

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
    initMap();
  }, [devices]); 

 
  useEffect(() => {
    if (!mapRef.current) return;
    
    const isResettingToDefault = !selectedDevice && !isDefaultView.current;
    
    if (selectedDevice || isResettingToDefault) {
      updateSelectedMarker();
    }
  }, [selectedDevice, shouldResetMap]);

  useEffect(() => {
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div id="map" style={{ minHeight: "calc(100vh - 79px)", width: "100%" }} />
  );
};

export default MapView;
