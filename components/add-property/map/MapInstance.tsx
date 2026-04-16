"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export function MapInstance({ coordinates, onPinChange }: any) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (mapRef.current) return;

    // Initialize Map
    const map = L.map("map-container", {
      center: [coordinates.lat, coordinates.lng],
      zoom: 15,
      zoomControl: false,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution: "©OpenStreetMap",
      },
    ).addTo(map);

    // Custom Magenta Pin
    const customIcon = L.divIcon({
      className: "custom-pin",
      html: `<div class="pin-wrap"><div class="pin-dot"></div></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });

    const marker = L.marker([coordinates.lat, coordinates.lng], {
      draggable: true,
      icon: customIcon,
    }).addTo(map);

    marker.on("dragend", () => {
      const { lat, lng } = marker.getLatLng();
      onPinChange({ lat, lng });
    });

    map.on("click", (e) => {
      marker.setLatLng(e.latlng);
      onPinChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="relative group">
      <div
        id="map-container"
        className="h-72 w-full rounded-[2rem] border-2 border-[#ece3ff] shadow-inner overflow-hidden"
      />

      <style jsx global>{`
        .custom-pin {
          background: transparent !important;
          border: none !important;
        }
        .pin-wrap {
          width: 30px;
          height: 30px;
          background: linear-gradient(135deg, #ff3bad 0%, #2a00ff 100%);
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 20px -5px rgba(42, 0, 255, 0.5);
        }
        .pin-dot {
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          transform: rotate(45deg);
        }
      `}</style>
    </div>
  );
}
