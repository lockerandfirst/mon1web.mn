"use client"

import { Apartment, formatPrice } from "@/lib/data"
import { MapPin } from "lucide-react"

interface MapViewProps {
  apartments: Apartment[]
  selectedId?: string | null
  onSelectApartment?: (id: string) => void
}

export function MapView({ apartments, selectedId, onSelectApartment }: MapViewProps) {
  // Calculate center of all apartments
  const center = {
    lat: apartments.reduce((sum, apt) => sum + apt.coordinates.lat, 0) / apartments.length || 47.9184,
    lng: apartments.reduce((sum, apt) => sum + apt.coordinates.lng, 0) / apartments.length || 106.9177
  }

  // Map dimensions
  const mapWidth = 100
  const mapHeight = 100

  // Convert lat/lng to x/y positions (simple projection)
  const getPosition = (apt: Apartment) => {
    const latRange = { min: 47.85, max: 47.95 }
    const lngRange = { min: 106.85, max: 106.95 }
    
    const x = ((apt.coordinates.lng - lngRange.min) / (lngRange.max - lngRange.min)) * mapWidth
    const y = ((latRange.max - apt.coordinates.lat) / (latRange.max - latRange.min)) * mapHeight
    
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) }
  }

  return (
    <div className="relative w-full h-full bg-secondary/5 rounded-lg overflow-hidden">
      {/* Mapbox-style background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-muted to-secondary/5">
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(10)].map((_, i) => (
            <div key={`h-${i}`} className="absolute w-full h-px bg-secondary/30" style={{ top: `${(i + 1) * 10}%` }} />
          ))}
          {[...Array(10)].map((_, i) => (
            <div key={`v-${i}`} className="absolute h-full w-px bg-secondary/30" style={{ left: `${(i + 1) * 10}%` }} />
          ))}
        </div>
        
        {/* Decorative elements to look like a map */}
        <div className="absolute top-1/4 left-1/4 w-32 h-24 bg-secondary/10 rounded-lg opacity-50" />
        <div className="absolute bottom-1/3 right-1/3 w-40 h-16 bg-secondary/10 rounded-lg opacity-50" />
        <div className="absolute top-1/2 left-1/2 w-48 h-1 bg-muted-foreground/20 -rotate-45" />
        <div className="absolute top-1/3 left-1/3 w-32 h-1 bg-muted-foreground/20 rotate-12" />
      </div>

      {/* Location label */}
      <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm border border-border">
        <p className="text-sm font-medium text-foreground">Ulaanbaatar, Mongolia</p>
        <p className="text-xs text-muted-foreground">{apartments.length} properties</p>
      </div>

      {/* Map markers */}
      {apartments.map((apt) => {
        const pos = getPosition(apt)
        const isSelected = selectedId === apt.id
        
        return (
          <button
            key={apt.id}
            className={`absolute transform -translate-x-1/2 -translate-y-full transition-all duration-200 z-10 group ${
              isSelected ? "z-20 scale-110" : "hover:z-20 hover:scale-105"
            }`}
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            onClick={() => onSelectApartment?.(apt.id)}
          >
            {/* Price tag marker */}
            <div className={`px-2 py-1 rounded-lg shadow-lg whitespace-nowrap transition-colors ${
              isSelected 
                ? "bg-primary text-primary-foreground" 
                : "bg-card text-foreground group-hover:bg-primary group-hover:text-primary-foreground"
            }`}>
              <span className="text-xs font-semibold">{formatPrice(apt.price)}</span>
            </div>
            {/* Pointer */}
            <div className={`w-0 h-0 mx-auto border-l-[6px] border-r-[6px] border-t-[8px] border-transparent transition-colors ${
              isSelected 
                ? "border-t-primary" 
                : "border-t-card group-hover:border-t-primary"
            }`} />
          </button>
        )
      })}

      {/* Zoom controls placeholder */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1">
        <button className="w-8 h-8 bg-card rounded-lg shadow-sm border border-border flex items-center justify-center text-foreground hover:bg-muted transition-colors">
          +
        </button>
        <button className="w-8 h-8 bg-card rounded-lg shadow-sm border border-border flex items-center justify-center text-foreground hover:bg-muted transition-colors">
          -
        </button>
      </div>

      {/* Attribution */}
      <div className="absolute bottom-4 left-4 text-xs text-muted-foreground/50">
        Map data preview
      </div>
    </div>
  )
}
