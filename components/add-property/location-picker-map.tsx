"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Coordinates = {
  lat: number;
  lng: number;
};

export function LocationPickerMap({
  coordinates,
  currentCoordinates,
  onPinChange,
}: {
  coordinates: Coordinates;
  currentCoordinates: Coordinates | null;
  onPinChange: (coords: Coordinates) => void;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const currentMarkerRef = useRef<L.CircleMarker | null>(null);
  const onPinChangeRef = useRef(onPinChange);

  useEffect(() => {
    onPinChangeRef.current = onPinChange;
  }, [onPinChange]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !mapElementRef.current || mapRef.current) return;

    const map = L.map(mapElementRef.current, {
      center: [coordinates.lat, coordinates.lng],
      zoom: 16,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      { attribution: "" },
    ).addTo(map);

    const marker = L.marker([coordinates.lat, coordinates.lng], {
      draggable: true,
      icon: L.divIcon({
        className: "location-picker-pin",
        html: `<div class="pin-wrapper"><div class="pin-head"></div></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      }),
    }).addTo(map);

    marker.on("dragend", () => {
      const latLng = marker.getLatLng();
      onPinChangeRef.current({ lat: latLng.lat, lng: latLng.lng });
    });

    map.on("click", (e) => {
      marker.setLatLng(e.latlng);
      onPinChangeRef.current({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    markerRef.current = marker;
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [isMounted]);

  useEffect(() => {
    if (markerRef.current && mapRef.current) {
      const currentPos = markerRef.current.getLatLng();
      if (
        currentPos.lat !== coordinates.lat ||
        currentPos.lng !== coordinates.lng
      ) {
        markerRef.current.setLatLng([coordinates.lat, coordinates.lng]);
        mapRef.current.panTo([coordinates.lat, coordinates.lng], {
          animate: true,
        });
      }
    }
  }, [coordinates.lat, coordinates.lng]);

  useEffect(() => {
    if (!mapRef.current || !currentCoordinates) return;
    if (currentMarkerRef.current) {
      currentMarkerRef.current.setLatLng([
        currentCoordinates.lat,
        currentCoordinates.lng,
      ]);
    } else {
      currentMarkerRef.current = L.circleMarker(
        [currentCoordinates.lat, currentCoordinates.lng],
        {
          radius: 8,
          fillColor: "#2a00ff",
          fillOpacity: 1,
          color: "white",
          weight: 3,
          className: "gps-pulse-dot",
        },
      ).addTo(mapRef.current);
    }
  }, [currentCoordinates]);

  if (!isMounted)
    return (
      <div className="h-72 w-full animate-pulse rounded-3xl bg-slate-100" />
    );

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
      <div ref={mapElementRef} className="h-72 w-full" />

      {/* Zoom Controls */}
      <div className="absolute right-3 top-3 z-[20] flex flex-col gap-1">
        <button
          type="button"
          onClick={() => mapRef.current?.zoomIn()}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white font-bold text-[#1a0b3b] shadow-md"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => mapRef.current?.zoomOut()}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white font-bold text-[#1a0b3b] shadow-md"
        >
          -
        </button>
      </div>

      <style jsx global>{`
        .pin-wrapper {
          height: 30px;
          width: 30px;
          background: #2a00ff;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(42, 0, 255, 0.4);
        }
        .pin-head {
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
        }
        .leaflet-container {
          cursor: crosshair !important;
        }
      `}</style>
    </div>
  );
}
