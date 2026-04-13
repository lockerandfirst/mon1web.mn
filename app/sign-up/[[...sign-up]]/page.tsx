import { SignUp } from "@clerk/nextjs";
import { AuthShell } from "@/components/auth-shell";
import { clerkAuthPageAppearance } from "@/lib/clerk-theme";

export default function SignUpPage() {
  return (
    <AuthShell
      badge="Mon1 шинэ бүртгэл"
      title="Mon1.mn дээр шинэ хэрэглэгч үүсгээд эхлээрэй."
      description="Бүртгэлээ нээгээд зар хадгалах, өөрийн үл хөдлөхөө оруулах, агентын урсгал руу хурдан шилжих боломжтой. Шинэ auth дэлгэц нь одоо танай сайтын хэлтэй илүү сайн нийлж байна."
      highlights={[
        "Sign up card нь одоо танай homepage дээрх soft glass, bright accent загвартай нийцнэ.",
        "Primary CTA, inputs, links, modal states бүгд нэг мөр Mon1 өнгөөр шинэчлэгдсэн.",
        "Desktop болон mobile дээр auth screen нь илүү intentional, landing-page feel-тэй харагдана.",
      ]}
    >
      <SignUp
        path="/sign-up"
        signInUrl="/sign-in"
        forceRedirectUrl="/home"
        appearance={clerkAuthPageAppearance}
      />
    </AuthShell>
  );
}
