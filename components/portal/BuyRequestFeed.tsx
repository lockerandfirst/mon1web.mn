"use client";

import { useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { MapPin } from "lucide-react";

import type { AgentPortalPickListing } from "@/components/portal/portal-types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { isAgent } from "@/lib/auth";
import {
  type BuyRequest,
  persistBuyRequestRecommendation,
} from "@/lib/buy-requests";
import { getPropertyTypeLabel } from "@/lib/property-types";

export function BuyRequestFeed({
  requests,
  agentPickListings,
  connectedAgentId,
  onRefresh,
}: {
  requests: BuyRequest[];
  agentPickListings: AgentPortalPickListing[];
  connectedAgentId: string | null;
  onRefresh: () => void;
}) {
  const { user } = useUser();
  const canAct = isAgent({ publicMetadata: user?.publicMetadata });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [target, setTarget] = useState<BuyRequest | null>(null);
  const [detailTarget, setDetailTarget] = useState<BuyRequest | null>(null);
  const [pickedId, setPickedId] = useState<string | null>(null);
  const sorted = useMemo(
    () => [...requests].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [requests],
  );

  const submitRecommend = () => {
    if (!target || !pickedId || !connectedAgentId) return;
    const pick = agentPickListings.find((p) => p.id === pickedId);
    if (!pick) return;
    persistBuyRequestRecommendation(target.id, {
      listingId: pick.id,
      listingTitle: pick.title,
      agentId: connectedAgentId,
    });
    onRefresh();
    setDialogOpen(false);
    setTarget(null);
    setPickedId(null);
  };

  const pickCls = (on: boolean) =>
    `flex w-full flex-col rounded-3xl border px-4 py-3 text-left transition-colors ${
      on
        ? "border-[#2a00ff] bg-[#f5f3ff]"
        : "border-slate-200 bg-slate-50 hover:border-[#2a00ff]/40"
    }`;

  return (
    <div className="space-y-6">
      {sorted.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#ff3bad]/30 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-black text-[#1a0b3b]">
            Нээлттэй хүсэлт алга
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Шинэ хүсэлт оруулахад энд харагдана.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {sorted.map((request) => (
            <article
              key={request.id}
              className="flex flex-col overflow-hidden rounded-3xl border border-[#ff3bad]/20 bg-white shadow-sm ring-1 ring-[#ff3bad]/10"
              onClick={() => {
                setDetailTarget(request);
                setDetailOpen(true);
              }}
            >
              <div className="relative aspect-16/10 bg-slate-50">
                <img
                  src={request.image}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-4 top-4 rounded-full bg-[#ff3bad] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                  Авна
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="line-clamp-2 text-base font-black leading-tight text-[#1a0b3b]">
                  {request.title}
                </h3>
                <p className="mt-2 flex items-center gap-1 text-xs font-bold text-slate-500">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-[#ff3bad]" />
                  <span className="truncate">
                    {request.district}
                    {request.location ? `, ${request.location}` : ""}
                  </span>
                </p>
                <p className="mt-3 text-lg font-black text-[#ff3bad]">
                  {request.propertyType === "barter" && request.budget <= 0
                    ? "Бартер"
                    : `${request.budget.toLocaleString("mn-MN")}₮`}
                </p>
                <p className="mt-1 text-[11px] font-semibold text-slate-400">
                  {getPropertyTypeLabel(request.propertyType)} · {request.rooms}{" "}
                  өрөө · {request.sqm}м²
                </p>
                {(request.agentRecommendations?.length ?? 0) > 0 ? (
                  <p className="mt-2 text-xs font-bold text-[#ff3bad]">
                    Таны санал: {request.agentRecommendations?.length}
                  </p>
                ) : null}
                {canAct ? (
                  <Button
                    type="button"
                    className="mt-4 h-11 w-full rounded-3xl bg-[#ff3bad] text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-[#ff3bad]/25 hover:bg-[#e232a3]"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTarget(request);
                      setPickedId(null);
                      setDialogOpen(true);
                    }}
                  >
                    Санал болгох
                  </Button>
                ) : (
                  <p className="mt-4 text-center text-xs font-semibold text-slate-400">
                    Зөвхөн баталгаажсан агент үйлдэл хийж болно.
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          overlayClassName="bg-black/20 backdrop-blur-[1px]"
          className="max-w-lg rounded-4xl border-slate-200 bg-white text-slate-900 shadow-sm"
        >
          <DialogHeader>
            <DialogTitle className="font-black text-slate-900">
              Өөрийн зар холбох
            </DialogTitle>
            <DialogDescription className="text-sm font-semibold text-slate-500">
              {target?.title}
            </DialogDescription>
          </DialogHeader>
          {agentPickListings.length === 0 ? (
            <p className="text-sm font-semibold text-slate-500">
              Зар олдсонгүй. «Миний зарууд»-аас зар нэмнэ үү.
            </p>
          ) : (
            <ul className="max-h-64 space-y-2 overflow-y-auto pr-1">
              {agentPickListings.map((row) => (
                <li key={`${row.source}-${row.id}`}>
                  <Button
                    type="button"
                    onClick={() => setPickedId(row.id)}
                    className={pickCls(pickedId === row.id)}
                  >
                    <span className="text-sm font-black text-slate-900">
                      {row.title}
                    </span>
                    <span className="mt-1 text-xs font-bold text-slate-500">
                      {row.district} · {row.price.toLocaleString("mn-MN")}₮
                    </span>
                  </Button>
                </li>
              ))}
            </ul>
          )}
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button
              type="button"
              disabled={
                !pickedId || !connectedAgentId || agentPickListings.length === 0
              }
              className="h-11 w-full rounded-4xl bg-[#2a00ff] font-black text-white hover:bg-[#2400d9] disabled:opacity-50"
              onClick={submitRecommend}
            >
              Илгээх
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full rounded-4xl border-slate-300 bg-white font-black text-slate-700 hover:bg-slate-100"
              onClick={() => setDialogOpen(false)}
            >
              Болих
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent
          overlayClassName="bg-black/20 backdrop-blur-[1px]"
          className="max-w-md rounded-4xl border-slate-200 bg-white text-slate-900 shadow-sm"
        >
          <DialogHeader>
            <DialogTitle className="font-black text-slate-900">
              Худалдан авагчийн холбоо барих
            </DialogTitle>
            <DialogDescription className="text-sm font-semibold text-slate-500">
              {detailTarget?.title}
            </DialogDescription>
          </DialogHeader>
          {detailTarget ? (
            <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-900">
              <p>
                <span className="text-slate-500">Нэр: </span>
                {detailTarget.submittedBy.name}
              </p>
              <p>
                <span className="text-slate-500">Имэйл: </span>
                {detailTarget.submittedBy.email}
              </p>
              <p>
                <span className="text-slate-500">Утас: </span>
                {detailTarget.contactPhone || "Оруулаагүй"}
              </p>
            </div>
          ) : null}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full rounded-4xl border-slate-300 bg-white font-black text-slate-700 hover:bg-slate-100"
              onClick={() => setDetailOpen(false)}
            >
              Хаах
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
