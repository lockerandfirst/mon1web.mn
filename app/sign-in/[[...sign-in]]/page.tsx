import { SignIn } from "@clerk/nextjs";
import { AuthShell } from "@/components/auth-shell";
import { clerkAuthPageAppearance } from "@/lib/clerk-theme";

export default function SignInPage() {
  return (
    <AuthShell
      badge="Mon1 дансны нэвтрэлт"
      title="Тавтай морил. Данс руугаа нэвтэрч үргэлжлүүлээрэй."
      description="Таны Mon1 хэрэглэгчийн орчин одоо сайтын үндсэн өнгө төрхтэй бүрэн уялдсан. Нэвтрээд зар, агентын хэрэгсэл, хадгалсан мэдээллээ нэг дороос үргэлжлүүлээрэй."
      highlights={[
        "Нэвтрэх, бүртгүүлэх урсгалууд одоо homepage-тэй ижил brand gradient болон radius систем ашиглана.",
        "Modal болон full page auth хоёр хоёулаа нэг ижил Clerk theme-ээр ажиллана.",
        "Хэрэглэгчийн профайл цэс хүртэл header-ийн өнгө төрхтэй илүү зохицсон боллоо.",
      ]}
    >
      <SignIn
        path="/sign-in"
        signUpUrl="/sign-up"
        forceRedirectUrl="/home"
        appearance={clerkAuthPageAppearance}
      />
    </AuthShell>
  );
}
