import { AgentProfileSkeleton } from "@/components/skeletons";

/**
 * Next.js route-level Suspense fallback для `/agents/[id]`.
 * Хэрэглэгч руу хуудас шилжих үед (esp. RSC streaming) шууд
 * бодит геометрийн skeleton харагдана — CLS үүсэхгүй.
 */
export default function Loading() {
  return <AgentProfileSkeleton listingsCount={3} />;
}
