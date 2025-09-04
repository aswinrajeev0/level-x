"use client"

import { useMemo } from "react"
import { useCart } from "@/hooks/use-cart"
import { CheckoutButton } from "@/components/checkout-button"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function CheckoutPage() {
    const { items, total } = useCart()

    return (
        <ProtectedRoute>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
                <section className="space-y-6">
                    <h1 className="text-2xl font-semibold">Checkout</h1>

                    <div className="space-y-4">
                        <h2 className="text-lg font-medium">Order Details</h2>

                        {items.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <p>Your cart is empty</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div key={`${item.productId}-${item.sellerId}`} className="border rounded-lg p-4 bg-white shadow-sm">
                                        <div className="flex gap-4">
                                            {/* Product Image */}
                                            <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                                                {item.product?.imageUrl ? (
                                                    <img
                                                        src={item.product.imageUrl}
                                                        alt={item.product?.name || "Product"}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                                                        No Image
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg mb-2">
                                                    {item.product?.name || "Product Name"}
                                                </h3>

                                                {item.product?.description && (
                                                    <p className="text-sm text-gray-600 mb-3">
                                                        {item.product.description}
                                                    </p>
                                                )}

                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-gray-500">Price:</span>
                                                        <span className="ml-2 font-medium">₹{item.price?.toFixed(2) || "0.00"}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500">Quantity:</span>
                                                        <span className="ml-2 font-medium">{item.quantity}</span>
                                                    </div>
                                                    {item.product?.category && (
                                                        <div>
                                                            <span className="text-gray-500">Category:</span>
                                                            <span className="ml-2 font-medium">{item.product.category.name}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-3 pt-3 border-t">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-500">Subtotal:</span>
                                                        <span className="text-lg font-semibold">
                                                            ₹{((item.price || 0) * item.quantity).toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                <aside className="rounded-lg border p-6 h-fit space-y-4 bg-gray-50">
                    <div className="text-lg font-semibold">Order Summary</div>

                    <div className="space-y-3">
                        {items.map((item) => (
                            <div key={`${item.productId}-${item.sellerId}`} className="flex justify-between text-sm">
                                <span className="truncate pr-2">
                                    {item.product?.name} × {item.quantity}
                                </span>
                                <span className="font-medium">
                                    ₹{((item.price || 0) * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t pt-3 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Subtotal</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg border-t pt-2">
                            <span>Total</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                    </div>

                    {items.length > 0 && (
                        <CheckoutButton />
                    )}
                </aside>
            </div>
        </ProtectedRoute>
    )
}