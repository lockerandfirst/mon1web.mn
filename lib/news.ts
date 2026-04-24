import { createClient } from "@supabase/supabase-js";

import { debug } from "@/lib/debug";

export type NewsItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  source: string;
  sort_order: number;
};

export async function fetchNewsItems(): Promise<NewsItem[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!url || !key) {
    return [];
  }

  const supabase = createClient(url, key);
  const { data, error } = await supabase
    .from("news")
    .select("id,title,description,href,source,sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    debug.error("news", "supabase fetch failed", error.message);
    return [];
  }

  return (data ?? []) as NewsItem[];
}
