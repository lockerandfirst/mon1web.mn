"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";
import {
  CheckCircle2,
  Home,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  UserRound,
} from "lucide-react";

import type { AgentPortalPickListing } from "@/components/portal/portal-types";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/safe-image";
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
import {
  type BuyRequest,
  type BuyRequestAgentRecommendation,
} from "@/lib/buy-requests";
import { getPropertyTypeLabel } from "@/lib/property-types";
import { BuyRequestsTabSkeleton } from "@/components/portal/agent-portal-tab-skeleton";

function recommendedListingIds(request: BuyRequest): Set<string> {
  return new Set((request.agentRecommendations ?? []).map((r) => r.listingId));
}

/** Энэ хүсэлтэд аль хэдийн санал болгосон заруудыг хасна — dialog-д зөвхөн үл илгээсэн. */
function pickListingsNotYetRecommended(
  request: BuyRequest | null,
  picks: AgentPortalPickListing[],
): AgentPortalPickListing[] {
  if (!request) return picks;
  const sent = recommendedListingIds(request);
  return picks.filter((p) => !sent.has(p.id));
}

function hasUnsentPickListings(
  request: BuyRequest,
  picks: AgentPortalPickListing[],
): boolean {
  const sent = recommendedListingIds(request);
  return picks.some((p) => !sent.has(p.id));
}

function emailMatchesSubmitter(
  request: BuyRequest,
  userEmail: string | null | undefined,
): boolean {
  const u = userEmail?.trim().toLowerCase();
  const r = request.submittedBy.email?.trim().toLowerCase();
  return Boolean(u && r && u === r);
}

function AgentContactForRecommendation({
  rec,
  className = "",
}: {
  rec: BuyRequestAgentRecommendation;
  className?: string;
}) {
  const name = rec.agentName?.trim();
  const phone = rec.agentPhone?.trim();
  const email = rec.agentEmail?.trim();
  if (!name && !phone && !email) {
    return (
      <p className="text-[10px] font-semibold text-slate-400">
        Агентын холбоо барих мэдээлэл олдсонгүй.
      </p>
    );
  }
  return (
    <div
      className={`space-y-1 text-[10px] font-semibold leading-snug text-slate-600 ${className}`}
    >
      {name ? (
        <p className="flex items-center gap-1.5 font-black text-slate-800">
          <UserRound className="h-3.5 w-3.5 shrink-0 text-[#2a00ff]" />
          {name}
        </p>
      ) : null}
      {phone ? (
        <p className="flex items-center gap-1.5">
          <Phone className="h-3.5 w-3.5 shrink-0 text-[#ff3bad]" />
          <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:underline">
            {phone}
          </a>
        </p>
      ) : null}
      {email ? (
        <p className="flex items-center gap-1.5">
          <Mail className="h-3.5 w-3.5 shrink-0 text-[#ff3bad]" />
          <a href={`mailto:${email}`} className="break-all hover:underline">
            {email}
          </a>
        </p>
      ) : null}
    </div>
  );
}

export function BuyRequestFeed({
  requests,
  agentPickListings,
  connectedAgentId,
  connectedAgentAvatar,
  connectedAgentName,
  onRefresh,
  initialDataLoading = false,
  /** Хянах самбар зэрэг — хэрэглэгчид зориулсан, «Санал болгох» харуулахгүй. */
  hideAgentRecommendActions = false,
}: {
  requests: BuyRequest[];
  agentPickListings: AgentPortalPickListing[];
  connectedAgentId: string | null;
  connectedAgentAvatar: string;
  connectedAgentName: string;
  onRefresh: () => void;
  /** Эхний fetch дуусах хүртэл «хүсэлт алга»-г харуулахгүй. */
  initialDataLoading?: boolean;
  hideAgentRecommendActions?: boolean;
}) {
  const { user } = useUser();
  const { getToken } = useAuth();
  const viewerEmail = user?.primaryEmailAddress?.emailAddress ?? null;
  const canAct =
    Boolean(connectedAgentId) ||
    isAgent({ publicMetadata: user?.publicMetadata });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [target, setTarget] = useState<BuyRequest | null>(null);
  const [detailTarget, setDetailTarget] = useState<BuyRequest | null>(null);
  const [pickedIds, setPickedIds] = useState<string[]>([]);
  const [recommendSubmitting, setRecommendSubmitting] = useState(false);
  const sorted = useMemo(
    () => [...requests].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [requests],
  );

  const unsentPicksForDialog = useMemo(
    () => pickListingsNotYetRecommended(target, agentPickListings),
    [target, agentPickListings],
  );

  useEffect(() => {
    setPickedIds((prev) =>
      prev.filter((id) => unsentPicksForDialog.some((p) => p.id === id)),
    );
  }, [unsentPicksForDialog]);

  const togglePickedId = (id: string) => {
    setPickedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const submitRecommend = async () => {
    if (!target || pickedIds.length === 0 || !connectedAgentId) return;
    const validIds = pickedIds.filter((id) =>
      unsentPicksForDialog.some((p) => p.id === id),
    );
    if (validIds.length === 0) return;
    setRecommendSubmitting(true);
    try {
      const token = await getToken();
      if (!token) return;
      await apiFetch(`/api/buy-requests/${target.id}/recommendations`, {
        method: "POST",
        token,
        body: { listingIds: validIds },
      });
      onRefresh();
      setDialogOpen(false);
      setTarget(null);
      setPickedIds([]);
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

  if (initialDataLoading && sorted.length === 0) {
    return (
      <div className="space-y-6">
        <BuyRequestsTabSkeleton />
      </div>
    );
  }

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
          {sorted.map((request) => {
            const isSubmitter = emailMatchesSubmitter(request, viewerEmail);
            const canRecommendHere =
              !hideAgentRecommendActions &&
              canAct &&
              !isSubmitter &&
              Boolean(connectedAgentId) &&
              request.workflowStatus !== "closed";
            const recsOnCard = hideAgentRecommendActions
              ? (request.agentRecommendations ?? [])
              : (request.agentRecommendations ?? []).slice(0, 3);
            const recsOverflow =
              !hideAgentRecommendActions &&
              (request.agentRecommendations?.length ?? 0) > 3;
            return (
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
                  <p className="mt-2 text-xs font-black uppercase tracking-wide text-[#2a00ff]">
                    Санал болгосон зар:{" "}
                    {request.agentRecommendations?.length}
                  </p>
                ) : null}
                {(request.agentRecommendations?.length ?? 0) > 0 ? (
                  <ul
                    className={`mt-2 space-y-3 border-t border-[#ff3bad]/10 pt-2 ${
                      hideAgentRecommendActions
                        ? "max-h-64 overflow-y-auto pr-0.5"
                        : ""
                    }`}
                  >
                    {recsOnCard.map((rec) => (
                        <li
                          key={`${request.id}-${rec.listingId}`}
                          className="rounded-2xl border border-slate-100 bg-slate-50/80 p-2.5"
                        >
                          <Link
                            href={`/apartment/${encodeURIComponent(rec.listingId)}`}
                            className="flex items-start gap-1.5 text-left text-[11px] font-black text-[#2a00ff] hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Sparkles className="mt-0.5 h-3 w-3 shrink-0" />
                            <span className="line-clamp-2">
                              {rec.listingTitle}
                            </span>
                          </Link>
                          <AgentContactForRecommendation
                            rec={rec}
                            className="mt-2 border-l-2 border-[#2a00ff]/25 pl-2.5"
                          />
                        </li>
                      ))}
                    {recsOverflow ? (
                      <li className="text-[10px] font-semibold text-slate-400">
                        +{(request.agentRecommendations?.length ?? 0) - 3}{" "}
                        нэмэлт…
                      </li>
                    ) : null}
                  </ul>
                ) : null}
                {canRecommendHere ? (
                  <div className="mt-3 flex items-center gap-2">
                    <SafeImage
                      src={connectedAgentAvatar}
                      variant="avatar"
                      alt={connectedAgentName || "Agent"}
                      className="h-7 w-7 rounded-full border border-[#ff3bad]/20 object-cover"
                    />
                    <p className="text-[11px] font-bold text-slate-500">
                      {connectedAgentName || "Таны агент"} санал илгээх
                      боломжтой
                    </p>
                  </div>
                ) : null}
                {canRecommendHere ? (
                  hasUnsentPickListings(request, agentPickListings) ? (
                    <Button
                      type="button"
                      className="mt-4 h-11 w-full rounded-3xl bg-[#ff3bad] text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-[#ff3bad]/25 hover:bg-[#e232a3]"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTarget(request);
                        setPickedIds([]);
                        setDialogOpen(true);
                      }}
                    >
                      Санал болгох
                    </Button>
                  ) : agentPickListings.length > 0 ? (
                    <p className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-center text-xs font-semibold text-slate-500">
                      Энэ хүсэлтэд санал болгож болох заруудаа бүгдийг нь
                      илгээсэн байна.
                    </p>
                  ) : (
                    <p className="mt-4 text-center text-xs font-semibold text-slate-400">
                      Санал болгох зар нэмэхээс өмнө «Миний зарууд»-аас зар
                      оруулна уу.
                    </p>
                  )
                ) : isSubmitter ? null : !hideAgentRecommendActions &&
                  canAct ? (
                  <p className="mt-4 text-center text-xs font-semibold text-slate-400">
                    Агент эрх идэвхжээгүй байна. Дахин нэвтэрч орно уу эсвэл
                    профайлаа refresh хийнэ үү.
                  </p>
                ) : null}
                {!hideAgentRecommendActions &&
                isSubmitter &&
                (request.agentRecommendations?.length ?? 0) === 0 ? (
                  <p className="mt-4 text-center text-xs font-semibold text-slate-500">
                    Агент санал илгээхэд энд харагдана.
                  </p>
                ) : null}
                {hideAgentRecommendActions &&
                (request.agentRecommendations?.length ?? 0) === 0 ? (
                  <p className="mt-4 text-center text-xs font-semibold text-slate-500">
                    Одоогоор санал болгосон зар алга.
                  </p>
                ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          overlayClassName="bg-[#2a00ff]/20 backdrop-blur-[1px]"
          className="pointer-events-auto z-80 w-full h-180 max-w-[calc(100vw-2rem)] md:max-w-2xl rounded-4xl border-[#2a00ff]/15 bg-white text-slate-900 shadow-xl"
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
            {unsentPicksForDialog.length > 0 ? (
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <p className="text-sm font-semibold text-slate-600">
                  {pickedIds.length > 0
                    ? `Сонгосон: ${pickedIds.length} зар — нэг дор илгээнэ`
                    : "Олон зар дарж сонгоно"}
                </p>
                <div className="flex flex-wrap gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 rounded-full text-xs font-bold text-[#2a00ff] hover:bg-[#2a00ff]/10"
                    onClick={() =>
                      setPickedIds(unsentPicksForDialog.map((p) => p.id))
                    }
                  >
                    Бүгдийг сонгох
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 rounded-full text-xs font-bold text-slate-500 hover:bg-slate-100"
                    onClick={() => setPickedIds([])}
                    disabled={pickedIds.length === 0}
                  >
                    Цэвэрлэх
                  </Button>
                </div>
              </div>
            ) : null}
          </DialogHeader>
          {agentPickListings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-6 text-center">
              <p className="text-base font-black text-slate-700 md:text-lg">
                Таны худалдаалах хүсэлтэй байгаа зарууд алга байна
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-500 md:text-base">
                Эхлээд «Миний зарууд»-аас зар оруулна уу.
              </p>
            </div>
          ) : unsentPicksForDialog.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#ff3bad]/30 bg-[#fff7fc] px-5 py-6 text-center">
              <p className="text-base font-black text-[#1a0b3b] md:text-lg">
                Энэ хүсэлтэд үл илгээх санал үлдээгүй
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-600 md:text-base">
                Таны бүх зарыг энэ хүсэлтэд аль хэдийн санал болгосон байна. Өөр
                зар нэмсэн бол дахин орж ирнэ үү.
              </p>
            </div>
          ) : (
            <ul className="max-h-[60vh] space-y-3 overflow-y-auto pr-1.5">
              {unsentPicksForDialog.map((row) => (
                <li key={`${row.source}-${row.id}`}>
                  <Button
                    type="button"
                    onClick={() => togglePickedId(row.id)}
                    className={pickCls(pickedIds.includes(row.id))}
                  >
                    <div className="flex w-full items-start gap-4">
                      {/* Thumbnail */}
                      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl border border-black/5 bg-slate-100 shadow-sm md:h-24 md:w-32">
                        <SafeImage
                          src={row.imageUrl}
                          variant="listing"
                          alt={row.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                        {pickedIds.includes(row.id) && (
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
                                pickedIds.includes(row.id)
                                  ? "text-white/70"
                                  : "text-[#2a00ff]"
                              }`}
                            >
                              {row.district}
                            </p>
                            <div
                              className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${
                                pickedIds.includes(row.id)
                                  ? "bg-white/20 text-white"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              <Home className="h-3 w-3" />
                              Миний зар
                            </div>
                          </div>

                          <p
                            className={`line-clamp-2 wrap-break-word text-base font-black leading-tight ${
                              pickedIds.includes(row.id)
                                ? "text-white"
                                : "text-slate-900"
                            }`}
                          >
                            {row.title}
                          </p>
                        </div>

                        <p
                          className={`text-lg font-black ${
                            pickedIds.includes(row.id)
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
                pickedIds.length === 0 ||
                !connectedAgentId ||
                unsentPicksForDialog.length === 0
              }
              className="h-11 w-full rounded-4xl bg-[#2a00ff] font-black text-white hover:bg-[#2400d9] disabled:opacity-50"
              onClick={() => void submitRecommend()}
            >
              {recommendSubmitting
                ? "Илгээж байна…"
                : `Илгээх${pickedIds.length > 0 ? ` (${pickedIds.length})` : ""}`}
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
          {detailTarget &&
          (detailTarget.agentRecommendations?.length ?? 0) > 0 ? (
            <div className="rounded-3xl border border-[#2a00ff]/15 bg-[#f5f3ff] p-4">
              <p className="text-[11px] font-black uppercase tracking-wide text-[#2a00ff]">
                Агентуудын санал болгосон зарууд
              </p>
              <ul className="mt-2 space-y-3">
                {(detailTarget.agentRecommendations ?? []).map((rec) => (
                  <li
                    key={rec.listingId}
                    className="rounded-2xl border border-white/60 bg-white/70 p-3"
                  >
                    <Link
                      href={`/apartment/${encodeURIComponent(rec.listingId)}`}
                      className="text-sm font-black text-[#2a00ff] underline-offset-2 hover:underline"
                    >
                      {rec.listingTitle}
                    </Link>
                    <AgentContactForRecommendation
                      rec={rec}
                      className="mt-2 border-l-2 border-[#2a00ff]/25 pl-2.5"
                    />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
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
