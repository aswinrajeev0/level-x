"use client"

import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useOrders } from "@/hooks/use-orders"
import { useCart } from "@/hooks/use-cart"
import type { Order } from "@/lib/types"

export default function CheckoutSuccessPage() {
    const params = useSearchParams()
    const router = useRouter()
    const orderId = params.get("orderId") || `order_${Date.now()}`
    const trackingId = `TRK${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    const { add } = useOrders()
    const { items, clear, total } = useCart()

    useEffect(() => {
        const record: Order = {
            id: orderId,
            items: items.map((i) => ({
                productId: i.productId,
                quantity: i.quantity,
                sellerId: i.sellerId,
                price: 0,
            })),
            total,
            address: {
                name: "",
                phone: "",
                line1: "",
                city: "",
                state: "",
                pincode: "",
            },
            trackingId,
            status: "paid",
            placedAt: new Date().toISOString(),
        }
        add(record)
        clear()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="rounded-md border p-6">
            <h1 className="text-xl font-semibold">Payment Successful</h1>
            <p className="text-sm text-muted-foreground mt-2">Thank you! Your order has been placed.</p>
            <div className="mt-4 text-sm">
                <div>Order ID: {orderId}</div>
                <div>
                    Tracking ID:{" "}
                    <button className="text-blue-600 underline" onClick={() => router.push(`/track?tracking=${trackingId}`)}>
                        {trackingId}
                    </button>
                </div>
            </div>
        </div>
    )
}
