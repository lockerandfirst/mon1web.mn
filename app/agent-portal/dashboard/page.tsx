import { redirect } from "next/navigation";

/** Хуучин холбоосуудыг `/agent-portal` самбартай нэгтгэсэн */
export default function AgentPortalDashboardLegacyRedirect() {
  redirect("/agent-portal");
}
