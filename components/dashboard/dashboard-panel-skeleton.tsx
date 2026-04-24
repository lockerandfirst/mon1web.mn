import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardListingsTableSkeleton } from "@/components/skeletons";

/**
 * `DashboardPanel`-ийн layout-тай ойролцоо placeholder (агент мэдээлэл + зарууд).
 */
export function DashboardPanelSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto mt-16 px-3 py-5 pb-24 md:mt-18 md:px-4 md:py-8 md:pb-10">
        <div className="mb-5 flex flex-col justify-between gap-3 md:mb-5 md:gap-4 md:flex-row md:items-center">
          <div className="space-y-2.5 md:space-y-3">
            <Skeleton className="h-9 w-56 rounded-lg bg-[#2a00ff]/20 md:h-10 md:w-70" />
            <Skeleton className="h-4 w-44 max-w-full md:h-5 md:w-54" />
          </div>
        </div>

        <div className="mb-5 flex w-fit gap-1 rounded-xl border border-[#2a00ff]/12 bg-white p-1 md:mb-11 md:gap-1.5 md:rounded-2xl md:p-1.5">
          <Skeleton className="h-10 w-34 rounded-lg md:h-9 md:w-40 md:rounded-xl" />
          <Skeleton className="h-10 w-30 rounded-lg md:h-9 md:w-36 md:rounded-xl" />
        </div>

        <Card className="overflow-hidden rounded-3xl border border-[#2a00ff]/10 bg-white shadow-xl shadow-[#2a00ff]/8 md:rounded-[2.5rem] md:shadow-2xl">
          <CardHeader className="p-3 max-md:pb-2 md:border-b md:border-[#2a00ff]/10 md:p-5">
            <div className="flex flex-col justify-between gap-2 md:gap-4 md:flex-row md:items-center">
              <Skeleton className="h-7 w-40 rounded-lg md:h-8 md:w-48" />
              <Skeleton className="h-10 w-full rounded-xl md:w-80" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <DashboardListingsTableSkeleton rows={6} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
