"use client"

import { useSearchParams, useRouter } from "next/navigation"

export default function CheckoutSuccessPage() {
    const params = useSearchParams()
    const router = useRouter()
    const orderId = params.get("orderId") || `order_${Date.now()}`

    return (
        <div className="rounded-md border p-6">
            <h1 className="text-xl font-semibold">Payment Successful</h1>
            <p className="text-sm text-muted-foreground mt-2">Thank you! Your order has been placed.</p>
            <div className="mt-4 text-sm">
                <div>Order ID: {orderId}</div>
                <div>
                    Tracking ID:{" "}
                    <button className="text-blue-600 underline" onClick={() => router.push(`/track?tracking=${orderId}`)}>
                        {orderId}
                    </button>
                </div>
            </div>
        </div>
    )
}
