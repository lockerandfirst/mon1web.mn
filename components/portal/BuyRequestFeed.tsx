"use client";

import { useMemo, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { CheckCircle2, Home, MapPin, Sparkles } from "lucide-react";

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
import { apiFetch } from "@/lib/backend-api";
import { type BuyRequest } from "@/lib/buy-requests";
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
  const { getToken } = useAuth();
  const canAct = isAgent({ publicMetadata: user?.publicMetadata });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [target, setTarget] = useState<BuyRequest | null>(null);
  const [detailTarget, setDetailTarget] = useState<BuyRequest | null>(null);
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [recommendSubmitting, setRecommendSubmitting] = useState(false);
  const sorted = useMemo(
    () => [...requests].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [requests],
  );

  const submitRecommend = async () => {
    if (!target || !pickedId || !connectedAgentId) return;
    const pick = agentPickListings.find((p) => p.id === pickedId);
    if (!pick) return;
    setRecommendSubmitting(true);
    try {
      const token = await getToken();
      if (!token) return;
      await apiFetch(`/api/buy-requests/${target.id}/recommendations`, {
        method: "POST",
        token,
        body: { listingId: pick.id },
      });
      onRefresh();
      setDialogOpen(false);
      setTarget(null);
      setPickedId(null);
    } catch {
      /* toast optional */
    } finally {
      setRecommendSubmitting(false);
    }
  };

  const pickCls = (on: boolean) =>
    `group flex w-full flex-col rounded-3xl h-30 border p-3 text-left transition-all duration-200 ${
      on
        ? "border-[#2a00ff] bg-[#2a00ff] shadow-lg shadow-[#2a00ff]/20 ring-2 ring-[#2a00ff]/10"
        : "border-slate-200 bg-white hover:border-[#2a00ff]/40 hover:bg-slate-50"
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
              <div className="flex items-center justify-between border-b border-[#ff3bad]/15 bg-[#fff7fc] px-5 py-3">
                <span className="rounded-full bg-[#ff3bad] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                  Авна
                </span>
                <span className="text-[11px] font-black uppercase tracking-wide text-[#ff3bad]">
                  {getPropertyTypeLabel(request.propertyType)}
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
                  {request.rooms} өрөө · {request.sqm}м²
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
          overlayClassName="bg-[#2a00ff]/20 backdrop-blur-[1px]"
          className="pointer-events-auto z-80 w-full max-w-[calc(100vw-2rem)] md:max-w-2xl rounded-4xl border-[#2a00ff]/15 bg-white text-slate-900 shadow-xl"
        >
          <DialogHeader>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#2a00ff]/20 bg-[#f5f3ff] px-4 py-1.5 text-xs font-black uppercase tracking-wide text-[#2a00ff]">
              <Sparkles className="h-4 w-4" />
              Санал болгох
            </div>
            <DialogTitle className="pt-2 text-xl font-black text-slate-900 md:text-2xl">
              Миний заруудаас сонгох
            </DialogTitle>
            <DialogDescription className="wrap-break-word text-base font-semibold text-slate-500">
              Хүсэлт: {target?.title}
            </DialogDescription>
          </DialogHeader>
          {agentPickListings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-6 text-center">
              <p className="text-base font-black text-slate-700 md:text-lg">
                «Миний зарууд» дээр санал болгох зар алга
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-500 md:text-base">
                Эхлээд «Би заръя»-аар авсан зарыг нэмээд дараа нь эндээс
                сонгоно.
              </p>
            </div>
          ) : (
            <ul className="max-h-[60vh] space-y-3 overflow-y-auto pr-1.5">
              {agentPickListings.map((row) => (
                <li key={`${row.source}-${row.id}`}>
                  <Button
                    type="button"
                    onClick={() => setPickedId(row.id)}
                    className={pickCls(pickedId === row.id)}
                  >
                    <div className="flex w-full items-start gap-4">
                      {/* Thumbnail */}
                      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl border border-black/5 bg-slate-100 shadow-sm md:h-24 md:w-32">
                        <img
                          src={row.imageUrl || "/placeholder.jpg"}
                          alt={row.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                        {pickedId === row.id && (
                          <div className="absolute inset-0 flex items-center justify-center scale-100 bg-[#000000]/20">
                            <CheckCircle2 className="h-8 w-8 text-white drop-shadow-md" />
                          </div>
                        )}
                      </div>

                      {/* Content Area */}
                      <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch py-1">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <p
                              className={`line-clamp-1 text-sm font-black uppercase tracking-wider ${
                                pickedId === row.id
                                  ? "text-white/70"
                                  : "text-[#2a00ff]"
                              }`}
                            >
                              {row.district}
                            </p>
                            <div
                              className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${
                                pickedId === row.id
                                  ? "bg-white/20 text-white"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              <Home className="h-3 w-3" />
                              Миний зар
                            </div>
                          </div>

                          <p
                            className={`line-clamp-2 break-words text-base font-black leading-tight ${
                              pickedId === row.id
                                ? "text-white"
                                : "text-slate-900"
                            }`}
                          >
                            {row.title}
                          </p>
                        </div>

                        <p
                          className={`text-lg font-black ${
                            pickedId === row.id
                              ? "text-white"
                              : "text-[#1a0b3b]"
                          }`}
                        >
                          {row.price.toLocaleString("mn-MN")}₮
                        </p>
                      </div>
                    </div>
                  </Button>
                </li>
              ))}
            </ul>
          )}
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button
              type="button"
              disabled={
                recommendSubmitting ||
                !pickedId ||
                !connectedAgentId ||
                agentPickListings.length === 0
              }
              className="h-11 w-full rounded-4xl bg-[#2a00ff] font-black text-white hover:bg-[#2400d9] disabled:opacity-50"
              onClick={() => void submitRecommend()}
            >
              {recommendSubmitting ? "Илгээж байна…" : "Илгээх"}
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
          overlayClassName="bg-[#2a00ff]/20 backdrop-blur-[1px]"
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
