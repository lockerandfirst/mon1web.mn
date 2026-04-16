"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// This is the magic part: it only loads the map on the client side
const MapInstance = dynamic(
  () => import("./MapInstance").then((mod) => mod.MapInstance),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-72 w-full items-center justify-center rounded-4xl bg-slate-50 border border-dashed border-slate-200">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    ),
  },
);

export function LocationPicker(props: any) {
  return <MapInstance {...props} />;
}
