/** Mon1 brand — keep in sync with `app/globals.css` :root tokens */
export const BRAND = {
  primary: "#2a00ff",
  accent: "#ff3bad",
  text: "#2a00ff",
  textSoft: "#8f4d88",
  danger: "#e11d48",
  success: "#15803d",
} as const;

/** Muted copy still on the blue axis (no pink-mauve — Clerk maps this widely in menus). */
const clerkTextSecondaryBlue = "rgba(42, 0, 255, 0.58)";

const clerkVariables = {
  colorPrimary: BRAND.primary,
  colorBackground: "#ffffff",
  colorText: BRAND.primary,
  colorTextSecondary: clerkTextSecondaryBlue,
  colorTextOnPrimaryBackground: "#ffffff",
  colorInputText: BRAND.primary,
  colorInputBackground: "rgba(255, 255, 255, 0.96)",
  colorNeutral: "#e8dcff",
  colorDanger: "#e11d48",
  colorSuccess: BRAND.success,
  colorWarning: "#ff9800",
  borderRadius: "1.5rem",
  fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
  fontSize: "0.9375rem",
  fontWeight: { normal: "500", medium: "600", bold: "800" },
} as const;

/**
 * Clerk «development» / test instance
 * - `unsafe_disableDevelopmentModeWarnings` hides some in-widget dev notices only.
 * - Keys `pk_test_…` / `sk_test_…` always use a **development** Clerk instance (badges, limits, UI).
 * - For real production: Clerk Dashboard → **Production** → API keys → set
 *   `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_…` and `CLERK_SECRET_KEY=sk_live_…` on your host (e.g. Vercel).
 */
const clerkLayout = {
  logoImageUrl: "/ok.png",
  logoLinkUrl: "/home",
  socialButtonsPlacement: "top" as const,
  socialButtonsVariant: "blockButton" as const,
  helpPageUrl: "/home",
  termsPageUrl: "/terms",
  privacyPageUrl: "/privacy",
  unsafe_disableDevelopmentModeWarnings: true,
};

const sharedElements = {
  modalBackdrop: "bg-[#2a00ff]/20 backdrop-blur-md",
  modalContent:
    "overflow-hidden rounded-[2rem] border border-white/70 bg-white/92 shadow-[0_36px_80px_-28px_rgba(42,0,255,0.38)] backdrop-blur-xl",
  card: "rounded-[1.5rem] border border-[#f4ddea] bg-white/95 shadow-[0_28px_70px_-30px_rgba(42,0,255,0.28)]",
  rootBox: "font-sans",
  main: "gap-6",
  scrollBox: "rounded-[inherit]",
  header: "gap-1",
  headerTitle: "text-2xl font-black tracking-tight text-[#2a00ff] sm:text-3xl",
  headerSubtitle: "text-sm font-semibold text-[#2a00ff]/65",
  navbar: "rounded-2xl border border-[#ebe3ff] bg-[#faf8ff]/90 shadow-none",
  navbarButton:
    "rounded-xl font-bold text-[#2a00ff] hover:bg-[#fff5fb] hover:text-[#ff3bad]",
  footer: "rounded-b-[inherit] bg-transparent",
  socialButtonsBlockButton:
    "h-12 rounded-4xl border border-[#dcd3ff] bg-[#f8f6ff] text-[#2a00ff] shadow-none transition-all hover:-translate-y-0.5 hover:border-[#ff9cd5] hover:bg-white",
  socialButtonsBlockButtonText: "text-sm font-bold",
  dividerLine:
    "bg-gradient-to-r from-transparent via-[#e8dcff] to-transparent h-px",
  dividerText:
    "text-[10px] font-black uppercase tracking-[0.24em] text-[#ff70d1]",
  formFieldLabel: "text-[13px] font-bold tracking-wide text-[#2a00ff]",
  formFieldHintText: "text-xs font-medium text-[#2a00ff]/55",
  formFieldInput:
    "h-12 rounded-4xl border border-[#eadcf3] bg-white/95 text-[#2a00ff] shadow-[0_16px_30px_-24px_rgba(42,0,255,0.45)] placeholder:text-[#b8a0c4] focus:border-[#2a00ff] focus:ring-4 focus:ring-[#2a00ff]/10",
  formFieldInputShowPasswordButton: "text-[#ff3bad] hover:text-[#2a00ff]",
  formButtonPrimary:
    "h-12 rounded-4xl border-0 bg-brand-gradient text-sm font-black text-white shadow-[0_22px_40px_-20px_rgba(42,0,255,0.58)] transition-transform hover:-translate-y-0.5 hover:opacity-95",
  formButtonSecondary:
    "h-12 rounded-4xl border border-[#dcd3ff] bg-white font-bold text-[#2a00ff] hover:border-[#ff9cd5] hover:bg-[#fff8fc]",
  footerActionLink: "font-black text-[#ff3bad] hover:text-[#2a00ff]",
  formResendCodeLink: "font-black text-[#ff3bad] hover:text-[#2a00ff]",
  otpCodeFieldInput:
    "h-12 w-12 rounded-4xl border border-[#dcd3ff] bg-white text-[#2a00ff] shadow-none font-black",
  alternativeMethodsBlockButton:
    "rounded-4xl border border-[#dcd3ff] bg-white text-[#2a00ff] hover:border-[#ff9cd5] hover:bg-[#fff6fb]",
  identityPreviewEditButton: "font-black text-[#ff3bad] hover:text-[#2a00ff]",
  identityPreviewText: "font-semibold text-[#2a00ff]",
  alert:
    "rounded-xl border border-[#ffd0e8] bg-[#fff5fb] text-[#b42372] shadow-none",
  alertText: "text-sm font-medium",
  footerAction: "text-sm text-[#2a00ff]/60",
  spinner: "text-[#2a00ff]",
  formFieldSuccessText: "text-sm font-semibold text-[#15803d]",
  badge:
    "rounded-full border border-[#ebe3ff] bg-[#f5f2ff] text-[10px] font-black uppercase tracking-widest text-[#2a00ff]",
  userButtonAvatarBox:
    "h-10 w-10 rounded-4xl ring-2 ring-[#2a00ff]/50 shadow-[0_14px_30px_-18px_rgba(42,0,255,0.45)]",
  /** Account menu — white card, Mon1 blue accents */
  userButtonPopoverCard:
    "overflow-hidden rounded-4xl border border-[#eadcf3] bg-white shadow-[0_24px_50px_-20px_rgba(42,0,255,0.22)] backdrop-blur-xl",
  userButtonPopoverMain: "gap-1 bg-white",
  userButtonPopoverActions: "border-t border-[#eadcf3] bg-white",
  userButtonPopoverScrollBox: "bg-white",
  userButtonPopoverActionButton:
    "rounded-2xl font-semibold !text-[#2a00ff] text-[#2a00ff] hover:bg-[#f5f3ff] hover:!text-[#2300d9] focus:bg-[#f5f3ff]",
  userButtonPopoverActionButtonText:
    "font-semibold !text-[#2a00ff] group-hover:!text-[#2300d9]",
  userButtonPopoverFooter: "hidden",
  userPreview: "gap-3 border-b border-[#eadcf3] bg-white px-4 py-3",
  userPreviewTextContainer: "gap-0.5",
  userPreviewMainIdentifier:
    "font-bold tracking-tight text-[#2a00ff] [&_*]:!text-[#2a00ff]",
  userPreviewSecondaryIdentifier:
    "text-sm font-medium text-[#2a00ff]/60 [&_*]:text-[#2a00ff]/60",
  userButtonTrigger:
    "rounded-4xl ring-2 ring-transparent transition-shadow hover:ring-[#2a00ff]/50",
} as const;

export const clerkAppearance = {
  layout: clerkLayout,
  variables: clerkVariables,
  elements: sharedElements,
} as const;

export const clerkAuthPageAppearance = {
  ...clerkAppearance,
  elements: {
    ...clerkAppearance.elements,
    rootBox: "w-full mx-auto",
    cardBox: "w-full shadow-none",
    card: `rounded-4xl border border-[#eadcf3] bg-white/95 shadow-[0_32px_80px_-32px_rgba(42,0,255,0.22)] backdrop-blur-sm`,
    navbar: "hidden",
    footer: "pb-0 pt-2",
  },
} as const;

export const clerkUserButtonAppearance = {
  layout: clerkAppearance.layout,
  variables: {
    ...clerkAppearance.variables,
    colorBackground: "#ffffff",
    colorText: BRAND.primary,
    colorTextSecondary: clerkTextSecondaryBlue,
    colorNeutral: "rgba(42, 0, 255, 0.12)",
  },
  elements: {
    avatarBox: clerkAppearance.elements.userButtonAvatarBox,
    userButtonPopoverCard: clerkAppearance.elements.userButtonPopoverCard,
    userButtonPopoverMain: clerkAppearance.elements.userButtonPopoverMain,
    userButtonPopoverActions: clerkAppearance.elements.userButtonPopoverActions,
    userButtonPopoverScrollBox:
      clerkAppearance.elements.userButtonPopoverScrollBox,
    userButtonPopoverActionButton:
      clerkAppearance.elements.userButtonPopoverActionButton,
    userButtonPopoverActionButtonText:
      clerkAppearance.elements.userButtonPopoverActionButtonText,
    userButtonPopoverFooter: clerkAppearance.elements.userButtonPopoverFooter,
    userPreview: clerkAppearance.elements.userPreview,
    userPreviewTextContainer: clerkAppearance.elements.userPreviewTextContainer,
    userPreviewMainIdentifier:
      clerkAppearance.elements.userPreviewMainIdentifier,
    userPreviewSecondaryIdentifier:
      clerkAppearance.elements.userPreviewSecondaryIdentifier,
    userButtonTrigger: clerkAppearance.elements.userButtonTrigger,
  },
} as const;
