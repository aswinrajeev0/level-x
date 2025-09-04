"use client"

import Link from "next/link"
import { useWishlist } from "@/hooks/use-wishlist"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import ProtectedRoute from "@/components/ProtectedRoute"
import Image from "next/image"

export default function WishlistPage() {
    const { items, remove } = useWishlist()
    const { add } = useCart()

    return (
        <ProtectedRoute>
            <div>
                <h1 className="text-xl font-semibold mb-4">Wishlist</h1>
                {items.length === 0 ? (
                    <div className="rounded-md border p-6 text-sm text-muted-foreground">
                        Your wishlist is empty. Browse products to add favorites.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {items.map((item) => {
                            const lowest = Math.min(...item.product.sellers.map((s) => s.price))
                            return (
                                <div key={item.id} className="border rounded-md overflow-hidden">
                                    <Link href={`/products/${item.id}`}>
                                        <Image
                                            src={item.product.imageUrl || "/placeholder.svg?height=180&width=240&query=product%20image"}
                                            alt={item.product.name}
                                            className="w-full"
                                        />
                                    </Link>
                                    <div className="p-3 space-y-2">
                                        <Link href={`/products/${item.product.id}`} className="font-medium hover:underline">
                                            {item.product.name}
                                        </Link>
                                        <div className="text-sm text-muted-foreground">{item.product.category.name}</div>
                                        <div className="text-sm">From ₹ {(lowest).toFixed(2)}</div>
                                        <div className="flex gap-2">
                                            <Button size="sm" onClick={() => add(item.product.id, 1)}>
                                                Add to Cart
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={() => remove(item.id)}>
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </ProtectedRoute>
    )
}
