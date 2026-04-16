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

const DEFAULT_CENTER: [number, number] = [47.9188, 106.9176];
const DEFAULT_ZOOM = 13;
const SELECTED_ZOOM = 16;

function fitMapToApartments(map: L.Map, apartments: Apartment[]) {
  if (apartments.length === 0) {
    map.setView(DEFAULT_CENTER, DEFAULT_ZOOM, { animate: true });
    return;
  }

  if (apartments.length === 1) {
    const [apartment] = apartments;
    map.setView(
      [apartment.coordinates.lat, apartment.coordinates.lng],
      SELECTED_ZOOM,
      { animate: true },
    );
    return;
  }

  const bounds = L.latLngBounds(
    apartments.map(
      (apartment) =>
        [apartment.coordinates.lat, apartment.coordinates.lng] as [
          number,
          number,
        ],
    ),
  );

  map.fitBounds(bounds.pad(0.18), {
    animate: true,
    duration: 0.35,
    maxZoom: 15,
    padding: [48, 48],
  });
}

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

    const map = L.map(mapElementRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      },
    ).addTo(map);

    L.control.zoom({ position: "topright" }).addTo(map);

    markerLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    requestAnimationFrame(() => {
      map.invalidateSize();
    });

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

    if (!isMounted || !map || !markerLayer) {
      return;
    }

    const activeApt = apartments.find(
      (apartment) => apartment.id === selectedId,
    );

    if (activeApt) {
      map.setView(
        [activeApt.coordinates.lat, activeApt.coordinates.lng],
        SELECTED_ZOOM,
        {
          animate: true,
        },
      );
    } else {
      fitMapToApartments(map, apartments);
    }

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
  }, [apartments, isMounted, onSelectApartment, selectedId]);

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
          cursor: pointer;
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

        .marker-wrapper:hover .marker-bubble {
          border-color: #93c5fd;
          transform: translateY(-1px);
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

        .leaflet-top.leaflet-right {
          top: 16px;
          right: 16px;
        }

        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 20px 45px -24px rgba(15, 23, 42, 0.45) !important;
        }

        .leaflet-control-zoom a {
          height: 44px !important;
          width: 44px !important;
          border: none !important;
          color: #0f172a !important;
          font-size: 20px !important;
          font-weight: 800;
          line-height: 44px !important;
        }

        .leaflet-control-zoom a:first-child {
          border-radius: 18px 18px 0 0 !important;
        }

        .leaflet-control-zoom a:last-child {
          border-radius: 0 0 18px 18px !important;
        }
      `}</style>

      <div className="pointer-events-none absolute bottom-4 left-4 z-[400] max-w-72 rounded-3xl bg-white/92 px-4 py-3 shadow-2xl backdrop-blur-xl">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-600">
          {apartments.length} байр харагдаж байна
        </p>
        <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">
          {selectedId
            ? "Сонгосон pin дээр төвлөрлөө. Карт эсвэл pin дарж өөр байр сонгоно."
            : "Үнэ харагдаж байгаа pin эсвэл зүүн талын карт дээр дарж дэлгэрэнгүй үзээрэй."}
        </p>
      </div>
    </div>
  );
}
