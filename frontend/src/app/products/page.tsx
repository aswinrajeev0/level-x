'use client'

import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Product } from "@/lib/types"
import { apiClient } from "../../../api/api.client"
import { useSearchParams } from "next/navigation"

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([])
    const searchParams = useSearchParams()

    // Read query params safely
    const category = searchParams.get("category") ?? ""
    const min = searchParams.get("min") ?? ""
    const max = searchParams.get("max") ?? ""

    useEffect(() => {
        async function fetchProducts() {
            const response = await apiClient.get("/products", {
                params: { category, min, max }
            })
            setProducts(response.data as Product[])
        }

        async function fetchCategories() {
            const response = await apiClient.get("/categories")
            setCategories(response.data)
        }

        fetchProducts()
        fetchCategories()
    },[category, min, max])

    return (
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
            <aside className="rounded-md border p-4 h-max">
                <form className="space-y-4" action="/products" method="get">
                    <div>
                        <Label htmlFor="category">Category</Label>
                        <select
                            id="category"
                            name="category"
                            defaultValue={category ?? ""}
                            className="mt-1 w-full rounded-md border bg-background px-2 py-2"
                        >
                            <option value="">{category ? category : "All"}</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.name}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label htmlFor="min">Min Price</Label>
                            <Input id="min" name="min" type="number" placeholder="0" defaultValue={min || ""} />
                        </div>
                        <div>
                            <Label htmlFor="max">Max Price</Label>
                            <Input id="max" name="max" type="number" placeholder="20000" defaultValue={max || ""} />
                        </div>
                    </div>
                    <Button type="submit" className="w-full">
                        Apply Filters
                    </Button>
                </form>
            </aside>

            <section>
                <div className="flex items-center justify-between mb-3">
                    <h1 className="text-xl font-semibold">Products</h1>
                    <div className="text-sm text-muted-foreground">{products.length} results</div>
                </div>
                {products.length === 0 ? (
                    <div className="rounded-md border p-6 text-center text-sm text-muted-foreground">No products found.</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {products.map((p) => {
                            const lowest = Math.min(...p.sellers.map((s) => s.price))
                            return (
                                <Link key={p.id} href={`/products/${p.id}`} className="rounded-md border hover:shadow-sm">
                                    <img
                                        src={p.imageUrl || "/placeholder.svg?height=200&width=300&query=product%20image"}
                                        alt={p.name}
                                        className="w-full rounded-t-md"
                                    />
                                    <div className="p-3">
                                        <div className="font-medium text-pretty">{p.name}</div>
                                        <div className="text-xs text-muted-foreground">{p.category?.name}</div>
                                        <div className="text-sm mt-1">₹ {(lowest).toFixed(2)}</div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </section>
        </div>
    )
}
