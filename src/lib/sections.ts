import { unstable_cache } from "next/cache"
import { createClient } from "@supabase/supabase-js"

// Server-side loader for the single-row "section" tables that drive the home page.
// Fetching them here (in parallel, cached) lets the page render with content in the
// initial HTML instead of each client component fetching after hydration.

const ORDER_COLUMN: Record<string, string> = {
  hero_sections: "created_at",
  features_section: "created_at",
  about_section: "created_at",
  services_section: "id",
  process_section: "created_at",
  whatwedo_section: "created_at",
  testimonials_section: "created_at",
  faqs_section: "created_at",
  footer_section: "created_at",
}

export type SectionTable = keyof typeof ORDER_COLUMN

export const SECTION_REVALIDATE_SECONDS = 60

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
  auth: { persistSession: false },
})

async function fetchSection(table: SectionTable) {
  try {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order(ORDER_COLUMN[table], { ascending: false })
      .limit(1)
      .maybeSingle()
    if (error) {
      console.error(`Error prefetching ${table}:`, error.message)
      return null
    }
    return data
  } catch (error) {
    console.error(`Error prefetching ${table}:`, error)
    return null
  }
}

export const getSections = unstable_cache(
  async (tables: SectionTable[]) => {
    const rows = await Promise.all(tables.map(fetchSection))
    return Object.fromEntries(tables.map((table, i) => [table, rows[i]])) as Record<string, any>
  },
  ["home-sections"],
  { revalidate: SECTION_REVALIDATE_SECONDS, tags: ["sections"] },
)
