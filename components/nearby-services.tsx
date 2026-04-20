"use client"

import { NearbyService } from "@/lib/data"
import { GraduationCap, ShoppingCart, Bus, Hospital, MapPin, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

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
  school: "bg-blue-50 text-blue-600",
  supermarket: "bg-blue-50 text-blue-600",
  bus: "bg-blue-50 text-blue-600",
  hospital: "bg-blue-50 text-blue-600",
}

const serviceLabels = {
  school: "Сургууль",
  supermarket: "Дэлгүүр",
  bus: "Автобусны буудал",
  hospital: "Эмнэлэг",
}

export function NearbyServices({ services }: NearbyServicesProps) {
  return (
    <section className="space-y-3 md:space-y-4">
      <h3 className="flex items-center gap-2 text-xl font-black uppercase italic tracking-tight text-slate-900 md:gap-3 md:text-2xl">
        <MapPin className="h-5 w-5 text-blue-600 md:h-6 md:w-6" />
        Ойролцоох үйлчилгээ
      </h3>

      <div className="rounded-4xl border border-slate-100 bg-white p-4 shadow-sm md:rounded-[2.5rem] md:p-6">
        <div className="mb-3 flex items-center justify-between md:mb-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Ойр орчимд
          </p>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-slate-500">
            {services.length} цэг
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-4">
          {services.map((service, index) => {
            const Icon = serviceIcons[service.type]
            const colorClass = serviceColors[service.type]
            const label = serviceLabels[service.type]

            return (
              <div
                key={index}
                className={cn(
                  "rounded-3xl border border-slate-50 bg-white p-3.5 shadow-sm transition-colors hover:border-blue-200 md:p-5",
                )}
              >
                <div className="flex items-start gap-3 md:gap-4">
                  <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl md:h-12 md:w-12", colorClass)}>
                    <Icon className="h-4 w-4 md:h-5 md:w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="mb-0.5 text-[9px] font-black uppercase tracking-wide text-slate-400 md:tracking-widest">
                      {label}
                    </p>
                    <p className="truncate text-sm font-black uppercase italic text-slate-900 md:text-base">
                      {service.name}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-blue-600" />
                        {service.distance}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-400" />
                        {service.walkTime} явган
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
