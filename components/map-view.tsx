"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { formatPrice, type Apartment } from "@/lib/data";

type MapViewProps = {
  apartments: Apartment[];
  selectedId: string | null;
  onSelectApartment: (id: string) => void;
};

export function MapView({
  apartments,
  selectedId,
  onSelectApartment,
}: MapViewProps) {
  const [isMounted, setIsMounted] = useState(false);
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !mapElementRef.current || mapRef.current) {
      return;
    }

    const defaultCenter: [number, number] = [47.9188, 106.9176];
    const map = L.map(mapElementRef.current, {
      center: defaultCenter,
      zoom: 13,
      zoomControl: false,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      },
    ).addTo(map);

    markerLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      markerLayerRef.current?.clearLayers();
      markerLayerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, [isMounted]);

  useEffect(() => {
    const map = mapRef.current;
    const markerLayer = markerLayerRef.current;

    if (!map || !markerLayer) {
      return;
    }

    const defaultCenter: [number, number] = [47.9188, 106.9176];
    const activeApt = apartments.find(
      (apartment) => apartment.id === selectedId,
    );
    const currentCenter: [number, number] = activeApt
      ? [activeApt.coordinates.lat, activeApt.coordinates.lng]
      : defaultCenter;

    map.setView(currentCenter, activeApt ? 16 : 13, {
      animate: true,
    });

    markerLayer.clearLayers();

    apartments.forEach((apt) => {
      const customIcon = L.divIcon({
        className: "custom-div-icon",
        iconSize: [0, 0],
        iconAnchor: [0, 0],
        html: `
          <div class="marker-wrapper ${selectedId === apt.id ? "is-active" : ""}">
            <div class="marker-bubble">${formatPrice(apt.price)}</div>
            <div class="marker-arrow"></div>
          </div>
        `,
      });

      L.marker([apt.coordinates.lat, apt.coordinates.lng], {
        icon: customIcon,
      })
        .on("click", () => onSelectApartment(apt.id))
        .addTo(markerLayer);
    });
  }, [apartments, onSelectApartment, selectedId]);

  if (!isMounted)
    return <div className="h-full w-full animate-pulse bg-slate-100" />;

  return (
    <div className="relative z-0 h-full w-full">
      <div ref={mapElementRef} className="h-full w-full" />

      <style jsx global>{`
        .custom-div-icon {
          border: none !important;
          background: none !important;
        }

        .marker-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: translate(-50%, -100%);
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
          transition: all 0.2s ease;
        }

        .marker-bubble {
          background: white;
          color: #1e293b;
          width: max-content;
          white-space: nowrap;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          padding: 6px 12px;
          font-size: 11px;
          font-weight: 800;
          transition: all 0.2s ease;
        }

        .marker-arrow {
          width: 0;
          height: 0;
          margin-top: -1px;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid white;
        }

        .marker-wrapper.is-active {
          z-index: 999 !important;
        }

        .marker-wrapper.is-active .marker-bubble {
          background: var(--brand-start);
          color: white;
          border-color: var(--brand-start);
          transform: scale(1.08);
        }

        .marker-wrapper.is-active .marker-arrow {
          border-top-color: var(--brand-start);
        }
      `}</style>
    </div>
  );
}
