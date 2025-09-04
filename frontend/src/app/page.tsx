'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { apiClient } from "../../api/api.client"
import { Product } from "@/lib/types"
import Image from "next/image"

export default function HomePage() {

    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        async function fetchProducts() {
            const response = await apiClient.get("/products");
            setProducts(response.data as Product[])
        }

        fetchProducts()
    },[])
    
    return (
        <div className="space-y-8">
            <section className="rounded-lg border p-6 bg-card">
                <h1 className="text-2xl font-semibold text-balance">Discover quality products at great prices</h1>
                <p className="text-muted-foreground mt-2">
                    Shop electronics, home essentials, books, fashion, and more from trusted sellers.
                </p>
                <div className="mt-4">
                    <Link href="/products">
                        <Button>Browse All Products</Button>
                    </Link>
                </div>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-3">Featured</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {products.map((p) => {
                        const lowest = Math.min(...p.sellers.map((s) => s.price))
                        return (<Link key={p.id} href={`/products/${p.id}`} className="rounded-md border hover:shadow-sm">
                            <Image src={p.imageUrl || "/placeholder.svg"} alt={p.name} className="w-full rounded-t-md" unoptimized />
                            <div className="p-3">
                                <div className="font-medium">{p.name}</div>
                                <div className="text-sm text-muted-foreground">{p.category.name}</div>
                                <div className="text-sm mt-1">₹ {(lowest).toFixed(2)}</div>
                            </div>
                        </Link>
                    )})}
                </div>
            </section>
        </div>
    )
}
