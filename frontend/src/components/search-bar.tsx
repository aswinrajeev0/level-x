"use client"

import useSWR from "swr"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type ProductLite = { id: string; title: string; slug: string; category: string }
const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function SearchBar({ className }: { className?: string }) {
    const [q, setQ] = useState("")
    const { data } = useSWR<{ products: ProductLite[] }>(
        q.length > 0 ? `/api/products?query=${encodeURIComponent(q)}&limit=6` : null,
        fetcher,
    )
    const router = useRouter()
    const suggestions = useMemo(() => data?.products ?? [], [data])

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                e.preventDefault()
                router.push(`/products?query=${encodeURIComponent(q)}`)
            }
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [q, router])

    return (
        <div className={cn("relative w-full", className)}>
            <Input
                aria-label="Search products"
                placeholder="Search products..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="font-sans"
            />
            {q && suggestions.length > 0 && (
                <div className="absolute mt-1 w-full rounded-md border bg-background shadow-lg z-20">
                    <ul className="max-h-64 overflow-auto">
                        {suggestions.map((s) => (
                            <li
                                key={s.id}
                                className="px-3 py-2 hover:bg-muted cursor-pointer"
                                onClick={() => router.push(`/products/${s.slug}`)}
                            >
                                <div className="text-sm font-medium">{s.title}</div>
                                <div className="text-xs text-muted-foreground">{s.category}</div>
                            </li>
                        ))}
                        <li
                            className="px-3 py-2 text-sm text-blue-600 hover:bg-muted cursor-pointer"
                            onClick={() => router.push(`/products?query=${encodeURIComponent(q)}`)}
                        >
                            See all results →
                        </li>
                    </ul>
                </div>
            )}
        </div>
    )
}
