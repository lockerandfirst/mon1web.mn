"use client";

import { useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";

import { ApartmentCard } from "@/components/apartment-card";
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
import type { Agent } from "@/lib/data";
import type { MarketplaceListing } from "@/lib/marketplace";
import {
  claimSaleListingForAgent,
  readMarketplaceListings,
  writeMarketplaceListings,
} from "@/lib/marketplace";

export function SaleRequestFeed({
  listings,
  connectedAgent,
  onRefresh,
}: {
  listings: MarketplaceListing[];
  connectedAgent: Agent | null;
  onRefresh: () => void;
}) {
  const { user } = useUser();
  const canAct = isAgent({ publicMetadata: user?.publicMetadata });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<MarketplaceListing | null>(null);

  const sorted = useMemo(
    () => [...listings].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [listings],
  );

  const handleClaim = () => {
    if (!active || !connectedAgent) {
      return;
    }
    const next = claimSaleListingForAgent(
      active.id,
      connectedAgent.id,
      readMarketplaceListings(),
    );
    writeMarketplaceListings(next);
    onRefresh();
    setOpen(false);
    setActive(null);
  };

  return (
    <div className="space-y-6">
      {sorted.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
          <p className="text-lg font-black text-[#1a0b3b]">
            Одоогоор агент хайж буй зар алга
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Хэрэглэгч &quot;Агентаар заруулах&quot; сонгоход энд харагдана.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {sorted.map((listing) => (
            <div key={listing.id} className="relative">
              <ApartmentCard
                apartment={listing}
                onCardClick={() => {
                  setActive(listing);
                  setOpen(true);
                }}
                actionLabel="Би заръя"
              />
              {!canAct ? (
                <p className="mt-3 text-center text-xs font-semibold text-slate-400">
                  Зөвхөн баталгаажсан агент үйлдэл хийж болно.
                </p>
              ) : null}
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          overlayClassName="bg-black/20 backdrop-blur-[1px]"
          className="max-w-md rounded-4xl border-slate-200 bg-white text-slate-900 shadow-sm"
        >
          <DialogHeader>
            <DialogTitle className="font-black text-slate-900">
              Эзэмшэгчийн холбоо барих мэдээлэл
            </DialogTitle>
            <DialogDescription className="text-sm font-semibold text-slate-500">
              {active?.title}
            </DialogDescription>
          </DialogHeader>
          {active && (
            <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-900">
              <p>
                <span className="text-slate-500">Нэр: </span>
                {active.submittedBy.name}
              </p>
              <p>
                <span className="text-slate-500">Имэйл: </span>
                {active.submittedBy.email}
              </p>
              {active.submittedBy.phone ? (
                <p>
                  <span className="text-slate-500">Утас: </span>
                  {active.submittedBy.phone}
                </p>
              ) : null}
            </div>
          )}
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            {canAct && connectedAgent && active && !active.takingAgentId ? (
              <Button
                type="button"
                className="h-11 w-full rounded-4xl bg-[#2a00ff] font-black text-white hover:bg-[#2400d9]"
                onClick={handleClaim}
              >
                Зарыг хариуцах
              </Button>
            ) : null}
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full rounded-4xl border-slate-300 bg-white font-black text-slate-700 hover:bg-slate-100"
              onClick={() => setOpen(false)}
            >
              Хаах
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
