import L from "leaflet";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import type { ExtendedMap } from "../data";


// 👇 Fix default icon không hiển thị
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { useShallow } from "zustand/shallow";
import iconUrl from "../../../assets/placeholder.png";
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
  const [mapRef, devices] = usePageState(useShallow((s) => [s.mapRef, s.data]))


  useEffect(() => {
    if (mapRef.current || devices.length === 0) return; // Map đã được khởi tạo

    const [x, y] = devices[0].Point;
    const map = L.map("map").setView([x, y], 13) as ExtendedMap;
    mapRef.current = map;

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
    // if (markerCluster.getLayers().length > 0) {
    //   const firstMarker = markerCluster.getLayers()[0] as L.Marker;
    //   const latlng = firstMarker.getLatLng();
    //   map.setView(latlng, 17, { animate: true });
    //   firstMarker.openPopup();
    // }

    // Gọi callback onMapReady với map instance


    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [devices]);

  return (
    <div id="map" style={{ minHeight: "calc(100vh - 79px)", width: "100%" }} />
  );
};

export default MapView;
