"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useWishlist } from "@/hooks/use-wishlist"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { apiClient } from "../../../../api/api.client"
import { Product } from "@/lib/types"
import Image from "next/image"

export default function ProductDetailPage() {
    const params = useParams<{ id: string }>()
    const [product, setProduct] = useState<Product>()
    const { remove, has } = useWishlist()
    const { add } = useCart()

    useEffect(() => {
        async function fetchProduct() {
            const response = await apiClient.get(`/products/${params.id}`)

            setProduct(response.data)
        }

        fetchProduct()
    },[params.id])

    if (!product) return <div className="text-sm text-muted-foreground">Product not found.</div>

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-md border p-3">
                <Image
                    src={product.imageUrl || "/placeholder.svg?height=320&width=480&query=product%20image"}
                    alt={product.name}
                    className="w-full rounded-md"
                />
            </div>

            <div className="space-y-4">
                <h1 className="text-2xl font-semibold text-balance">{product.name}</h1>
                <p className="text-muted-foreground">{product.description}</p>

                <div className="space-y-2">
                    <div className="font-medium">Available from multiple sellers</div>
                    <ul className="divide-y rounded-md border">
                        {product.sellers.map((s) => {
                            return (
                                <li key={s.id} className="p-3 flex items-center justify-between gap-3">
                                    <div>
                                        <div className="font-medium">{s.seller.shopName}</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="font-semibold">₹ {s.price.toFixed(2)}</div>
                                        <Button onClick={() => add(product.id, 1, s.seller.id)}>Add to Cart</Button>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant={has(product.id) ? "secondary" : "outline"} onClick={() => remove(product.id)}>
                        {has(product.id) ? "In Wishlist" : "Add to Wishlist"}
                    </Button>
                </div>

                {product.attributes && (
                    <div className="rounded-md border p-3">
                        <div className="font-medium mb-2">Details</div>
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {Object.entries(product.attributes).map(([k, v]) => (
                                <div key={k} className="flex items-center justify-between gap-4">
                                    <dt className="text-sm text-muted-foreground">{k}</dt>
                                    <dd className="text-sm">{String(v)}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                )}
            </div>
        </div>
    )
}
