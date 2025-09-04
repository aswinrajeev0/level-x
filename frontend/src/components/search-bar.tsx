"use client"

import useSWR from "swr"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type ProductLite = { id: string; title: string; slug: string; category: string }
const fetcher = async (url: string): Promise<ProductLite[]> => {
    const res = await fetch(url);
    const products = await res.json();
    return products.map((p: any) => ({
        id: p.id,
        title: p.name,
        slug: p.id,
        category: p.category?.name ?? "",
    }));
};

export function SearchBar({ className }: { className?: string }) {
    const [q, setQ] = useState("")
    const { data } = useSWR<ProductLite[]>(
        q.length > 0 ? `${process.env.NEXT_PUBLIC_BASE_URL}/products?query=${encodeURIComponent(q)}` : null,
        fetcher,
    )
    const router = useRouter()
    const suggestions = useMemo(() => data ?? [], [data])

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
