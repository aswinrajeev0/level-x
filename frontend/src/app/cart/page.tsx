"use client"

import Link from "next/link"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ProtectedRoute from "@/components/ProtectedRoute"
import Image from "next/image"

export default function CartPage() {
    const { items, update, remove, total } = useCart()

    return (
        <>
            <ProtectedRoute>
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
                    <section>
                        <h1 className="text-xl font-semibold mb-4">Shopping Cart</h1>
                        {items.length === 0 ? (
                            <div className="rounded-md border p-6 text-sm text-muted-foreground">Your cart is empty.</div>
                        ) : (
                            <div className="space-y-3">
                                {items.map(item => (
                                    <div key={`${item.id}-${item.sellerId ?? "lowest"}`} className="flex gap-4 border rounded-md p-3">
                                        <Image
                                            src={item.product.imageUrl || "/placeholder.svg?height=96&width=96&query=product%20image"}
                                            alt={item.product.name}
                                            className="w-24 h-24 rounded-md object-cover"
                                        />
                                        <div className="flex-1">
                                            <Link href={`/products/${item.productId}`} className="font-medium hover:underline">
                                                {item.product.name}
                                            </Link>
                                            <div className="text-sm text-muted-foreground">{item.product.category.name}</div>
                                            <div className="text-sm mt-1">₹ {(item.price).toFixed(2)} each</div>
                                            <div className="mt-2 flex items-center gap-2">
                                                <label htmlFor={`qty-${item.productId}`} className="text-sm">
                                                    Qty
                                                </label>
                                                <Input
                                                    id={`qty-${item.productId}`}
                                                    type="number"
                                                    min={1}
                                                    value={item.quantity}
                                                    onChange={(e) => update(item.id, Math.max(1, Number(e.target.value) || 1))}
                                                    className="w-20"
                                                />
                                                <Button variant="outline" onClick={() => remove(item.productId, item.sellerId)}>
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <aside className="rounded-md border p-4 h-max">
                        <div className="font-medium">Order Summary</div>
                        <div className="mt-2 flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">Subtotal</div>
                            <div className="text-sm">₹ {(total).toFixed(2)}</div>
                        </div>
                        <div className="mt-4">
                            {items.length > 0 ? (
                                <Link href="/checkout">
                                    <Button className="w-full">Proceed to Checkout</Button>
                                </Link>
                            ) : (
                                <Button className="w-full" disabled>
                                    Proceed to Checkout
                                </Button>
                            )}
                        </div>
                    </aside>
                </div>
            </ProtectedRoute>
        </>
    )
}
