"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NearbyService } from "@/lib/data"
import { GraduationCap, ShoppingCart, Bus, Hospital, MapPin, Clock } from "lucide-react"

interface NearbyServicesProps {
  services: NearbyService[]
}

const serviceIcons = {
  school: GraduationCap,
  supermarket: ShoppingCart,
  bus: Bus,
  hospital: Hospital,
}

const serviceColors = {
  school: "bg-chart-4/10 text-chart-4",
  supermarket: "bg-chart-2/10 text-chart-2",
  bus: "bg-primary/10 text-primary",
  hospital: "bg-chart-5/10 text-chart-5",
}

const serviceLabels = {
  school: "Сургууль",
  supermarket: "Дэлгүүр",
  bus: "Автобусны буудал",
  hospital: "Эмнэлэг",
}

export function NearbyServices({ services }: NearbyServicesProps) {
  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Ойролцоох үйлчилгээ
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.map((service, index) => {
            const Icon = serviceIcons[service.type]
            const colorClass = serviceColors[service.type]
            const label = serviceLabels[service.type]
            
            return (
              <div 
                key={index}
                className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                  <p className="font-medium text-foreground text-sm truncate">{service.name}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {service.distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {service.walkTime} явган
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
