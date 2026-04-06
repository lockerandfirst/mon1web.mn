import { redirect } from "next/navigation";

export const metadata = {
  title: "Mon1.mn - Find Your Dream Home in Mongolia",
  description:
    "Mongolia's premier real estate marketplace. Find apartments, houses, and commercial properties in Ulaanbaatar and beyond.",
};

export default function EntryPage() {
  redirect("/home");
}
