"use client"

import { useMemo, useState } from "react"
import { useCart } from "@/hooks/use-cart"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckoutButton } from "@/components/checkout-button"

export default function CheckoutPage() {
    const { items, total } = useCart()
    const [form, setForm] = useState({
        name: "",
        phone: "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        pincode: "",
    })

    const lineItems = useMemo(() => {
        return items.map((i) => ({
            productId: i.productId,
            name: i.product?.name,
            quantity: i.quantity,
            amount: total,
            sellerId: i.sellerId,
        }))
    }, [items, total])

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
            <section className="space-y-4">
                <h1 className="text-xl font-semibold">Checkout</h1>
                <div className="rounded-md border p-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
                        </div>
                        <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" value={form.phone} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="line1">Address Line 1</Label>
                        <Input id="line1" value={form.line1} onChange={(e) => setForm((s) => ({ ...s, line1: e.target.value }))} />
                    </div>
                    <div>
                        <Label htmlFor="line2">Address Line 2</Label>
                        <Input id="line2" value={form.line2} onChange={(e) => setForm((s) => ({ ...s, line2: e.target.value }))} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                            <Label htmlFor="city">City</Label>
                            <Input id="city" value={form.city} onChange={(e) => setForm((s) => ({ ...s, city: e.target.value }))} />
                        </div>
                        <div>
                            <Label htmlFor="state">State</Label>
                            <Input id="state" value={form.state} onChange={(e) => setForm((s) => ({ ...s, state: e.target.value }))} />
                        </div>
                        <div>
                            <Label htmlFor="pincode">Pincode</Label>
                            <Input
                                id="pincode"
                                value={form.pincode}
                                onChange={(e) => setForm((s) => ({ ...s, pincode: e.target.value }))}
                                inputMode="numeric"
                                maxLength={6}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <aside className="rounded-md border p-4 h-max space-y-3">
                <div className="font-medium">Your Cart</div>

                <div className="space-y-2">
                    {items.length === 0 ? (
                        <div className="text-sm text-muted-foreground">Your cart is empty</div>
                    ) : (
                        items.map((item) => (
                            <div key={`${item.productId}-${item.sellerId}`} className="flex justify-between text-sm">
                                <span>
                                    {item.product?.name} × {item.quantity}
                                </span>
                                <span>
                                    ₹
                                    {(
                                        (item.price) *
                                        item.quantity
                                    ).toFixed(2)}
                                </span>
                            </div>
                        ))
                    )}
                </div>

                <div className="border-t pt-2 text-sm flex justify-between font-medium">
                    <span>Subtotal</span>
                    <span>₹ {total.toFixed(2)}</span>
                </div>

                <CheckoutButton payload={{ address: form }} />

                {!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && (
                    <div className="text-xs text-muted-foreground">
                        Running in mock mode. Add Stripe keys to enable real test checkout.
                    </div>
                )}
            </aside>
        </div>
    )
}
