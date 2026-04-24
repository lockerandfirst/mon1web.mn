import type { Variants } from "framer-motion";

/** Shared skeleton fade-out for AnimatePresence `mode="wait"` handoffs. */
export const listingsSkeletonExitTransition = {
  duration: 0.2,
  ease: "easeOut" as const,
};

/** Parent wrapper for staggered listing cards (listings grid, featured, related). */
export const listingsStaggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

/** Per-card entrance when driven by parent `staggerChildren`. */
export const listingsStaggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};
