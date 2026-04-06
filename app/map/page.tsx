"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { MapView } from "@/components/map-view"
import { apartments, formatPrice } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, MapPin, Bed, Bath, Square, BadgeCheck, Heart, ChevronLeft, ChevronRight, List } from "lucide-react"
import Link from "next/link"

export default function MapPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [rooms, setRooms] = useState("")
  const [showListings, setShowListings] = useState(true)
  const [favorites, setFavorites] = useState<string[]>([])

  const filteredApartments = apartments.filter((apt) => {
    const matchesSearch = apt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.district.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesRooms = !rooms || apt.rooms === parseInt(rooms) || (rooms === "5+" && apt.rooms >= 5)

    return matchesSearch && matchesRooms
  })

  const selectedApartment = apartments.find(apt => apt.id === selectedId)

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Toggle Button for Mobile */}
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 left-4 z-30 lg:hidden shadow-lg bg-card"
          onClick={() => setShowListings(!showListings)}
        >
          {showListings ? <ChevronLeft className="h-5 w-5" /> : <List className="h-5 w-5" />}
        </Button>

        {/* Listings Sidebar */}
        <aside className={`${showListings ? "flex" : "hidden"} lg:flex flex-col w-full lg:w-[400px] xl:w-[450px] border-r border-border bg-card z-20`}>
          {/* Search Header */}
          <div className="p-4 border-b border-border">
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10"
                />
              </div>
              <Select value={rooms} onValueChange={setRooms}>
                <SelectTrigger className="w-[100px] h-10">
                  <SelectValue placeholder="Rooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-muted-foreground">{filteredApartments.length} properties found</p>
          </div>

          {/* Listings */}
          <div className="flex-1 overflow-y-auto">
            {filteredApartments.map((apt) => (
              <div
                key={apt.id}
                className={`p-4 border-b border-border cursor-pointer transition-colors ${
                  selectedId === apt.id ? "bg-muted" : "hover:bg-muted/50"
                }`}
                onClick={() => setSelectedId(apt.id)}
              >
                <div className="flex gap-3">
                  <div className="relative w-28 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={apt.images[0]}
                      alt={apt.title}
                      className="w-full h-full object-cover"
                    />
                    {apt.verified && (
                      <Badge variant="secondary" className="absolute top-1 left-1 text-[10px] px-1.5 py-0 gap-0.5">
                        <BadgeCheck className="h-2.5 w-2.5" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-sm text-foreground line-clamp-1">{apt.title}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(apt.id)
                        }}
                      >
                        <Heart className={`h-4 w-4 ${favorites.includes(apt.id) ? "fill-primary text-primary" : ""}`} />
                      </Button>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{apt.location}</span>
                    </div>
                    <p className="font-bold text-primary text-sm mb-1">{formatPrice(apt.price)}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Bed className="h-3 w-3" />
                        {apt.rooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="h-3 w-3" />
                        {apt.bathrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <Square className="h-3 w-3" />
                        {apt.sqm}m²
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Map Area */}
        <div className="flex-1 relative">
          <MapView 
            apartments={filteredApartments}
            selectedId={selectedId}
            onSelectApartment={setSelectedId}
          />

          {/* Selected Apartment Detail Card */}
          {selectedApartment && (
            <Card className="absolute bottom-4 left-4 right-4 lg:left-auto lg:right-4 lg:w-80 shadow-lg border-border z-10">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="w-24 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={selectedApartment.images[0]}
                      alt={selectedApartment.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-foreground line-clamp-2 mb-1">{selectedApartment.title}</h3>
                    <p className="font-bold text-primary mb-2">{formatPrice(selectedApartment.price)}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <Bed className="h-3 w-3" />
                        {selectedApartment.rooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <Square className="h-3 w-3" />
                        {selectedApartment.sqm}m²
                      </span>
                    </div>
                    <Link href={`/apartment/${selectedApartment.id}`}>
                      <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
