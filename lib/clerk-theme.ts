export const clerkAppearance = {
  layout: {
    socialButtonsPlacement: "top",
    socialButtonsVariant: "blockButton",
    unsafe_disableDevelopmentModeWarnings: true,
  },
  variables: {
    colorPrimary: "#2a00ff",
    colorBackground: "#ffffff",
    colorText: "#2a00ff",
    colorTextSecondary: "#8f4d88",
    colorInputText: "#2a00ff",
    colorInputBackground: "rgba(255,255,255,0.92)",
    colorDanger: "#e11d48",
    colorSuccess: "#16a34a",
    borderRadius: "2rem",
    fontFamily: "var(--font-inter)",
  },
  elements: {
    modalBackdrop: "bg-[#2a00ff]/20 backdrop-blur-md",
    modalContent:
      "overflow-hidden rounded-[62] border border-white/70 bg-white/90 shadow-[0_36px_80px_-28px_rgba(42,0,255,0.38)] backdrop-blur-xl",
    card: "rounded-xl border border-[#f4ddea] bg-white/95 shadow-[0_28px_70px_-30px_rgba(42,0,255,0.32)]",
    headerTitle: "text-3xl font-black tracking-tight text-[#2a00ff]",
    headerSubtitle: "text-sm font-medium text-[#a25691]",
    socialButtonsBlockButton:
      "h-12 rounded-4xl border border-[#dcd3ff] bg-[#f8f6ff] text-[#2a00ff] shadow-none transition-all hover:-translate-y-0.5 hover:border-[#ff9cd5] hover:bg-white",
    socialButtonsBlockButtonText: "text-sm font-bold",
    dividerLine:
      "bg-gradient-to-r from-transparent via-[#e8dcff] to-transparent",
    dividerText:
      "text-[10px] font-black uppercase tracking-[0.24em] text-[#ff70d1]",
    formFieldLabel: "text-[13px] font-bold tracking-wide text-[#2a00ff]",
    formFieldInput:
      "h-12 rounded-4xl border border-[#eadcf3] bg-white/90 text-[#2a00ff] shadow-[0_16px_30px_-24px_rgba(42,0,255,0.55)] placeholder:text-[#d48abd] focus:border-[#2a00ff] focus:ring-4 focus:ring-[#2a00ff]/10",
    formFieldInputShowPasswordButton: "text-[#ff3bad] hover:text-[#2a00ff]",
    formButtonPrimary:
      "h-12 rounded-4xl border-0 bg-brand-gradient text-sm font-black text-white shadow-[0_22px_40px_-20px_rgba(42,0,255,0.58)] transition-transform hover:-translate-y-0.5 hover:opacity-95",
    footerActionLink: "font-black text-[#ff3bad] hover:text-[#2a00ff]",
    formResendCodeLink: "font-black text-[#ff3bad] hover:text-[#2a00ff]",
    otpCodeFieldInput:
      "h-12 w-12 rounded-4xl border border-[#dcd3ff] bg-white text-[#2a00ff] shadow-none",
    alternativeMethodsBlockButton:
      "rounded-4xl border border-[#dcd3ff] bg-white text-[#2a00ff] hover:border-[#ff9cd5] hover:bg-[#fff6fb]",
    identityPreviewEditButton: "font-black text-[#ff3bad] hover:text-[#2a00ff]",
    alert:
      "rounded-xl border border-[#ffd0e8] bg-[#fff5fb] text-[#b42372] shadow-none",
    alertText: "text-sm font-medium",
    footerAction: "text-sm text-[#8f4d88]",
    userButtonAvatarBox:
      "h-10 w-10 rounded-4xl ring-2 ring-white shadow-[0_14px_30px_-18px_rgba(42,0,255,0.5)]",
    userButtonPopoverCard:
      "overflow-hidden rounded-4xl border border-white/70 bg-white/95 shadow-[0_24px_60px_-24px_rgba(42,0,255,0.34)] backdrop-blur-xl",
    userButtonPopoverActionButton:
      "rounded-2xl text-[#2a00ff] hover:bg-[#f7f4ff] hover:text-[#ff3bad]",
    userButtonPopoverActionButtonText: "font-semibold",
    userButtonPopoverFooter: "hidden",
  },
} as const;

export const clerkAuthPageAppearance = {
  ...clerkAppearance,
  elements: {
    ...clerkAppearance.elements,
    rootBox: "w-full",
    cardBox: "w-full shadow-none",
    card: "rounded-4xl border border-slate-200 bg-white shadow-sm",
    footer: "pb-0",
  },
} as const;

export const clerkUserButtonAppearance = {
  elements: {
    avatarBox: clerkAppearance.elements.userButtonAvatarBox,
    userButtonPopoverCard: clerkAppearance.elements.userButtonPopoverCard,
    userButtonPopoverActionButton:
      clerkAppearance.elements.userButtonPopoverActionButton,
    userButtonPopoverActionButtonText:
      clerkAppearance.elements.userButtonPopoverActionButtonText,
    userButtonPopoverFooter: clerkAppearance.elements.userButtonPopoverFooter,
  },
} as const;
