"use client"
import { createContext, useContext, type ReactNode } from "react"

// Holds section rows prefetched on the server (see lib/sections.ts). Components read
// their row synchronously so they can render on the server; when a row is missing
// (or the component is used outside the provider) they fall back to fetching it.

const SectionDataContext = createContext<Record<string, any>>({})

export function SectionDataProvider({ data, children }: { data: Record<string, any>; children: ReactNode }) {
  return <SectionDataContext.Provider value={data}>{children}</SectionDataContext.Provider>
}

export function usePrefetchedSection<T = any>(table: string): T | undefined {
  return useContext(SectionDataContext)[table] ?? undefined
}
