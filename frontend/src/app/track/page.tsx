"use client"

import { useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import { apiClient } from "../../../api/api.client"
import { Order } from "@/lib/types"

export default function TrackPage() {
    const params = useSearchParams()
    const initial = params.get("tracking") ?? ""
    const [order, setOrder] = useState<Order | null>(null);
    const [id, setId] = useState(initial)
    
    const track = async() => {
        const res = await apiClient.get(`/checkout/track/${id}`)
        setOrder(res.data)
    }

    useEffect(() => {
        track()
    },[])

    return (
        <ProtectedRoute>
            <div className="space-y-4">
                <h1 className="text-xl font-semibold">Track My Order</h1>
                <div className="flex items-center gap-2 max-w-md">
                    <Input placeholder="Enter tracking ID" value={id} onChange={(e) => setId(e.target.value)} />
                    <Button onClick={() => track()}>Track</Button>
                </div>

                {order && (
                    <div className="rounded-md border p-4 space-y-3">
                        <div className="text-sm">Tracking ID: {order.id}</div>
                        <div className="text-sm">Status: {order.status}</div>
                        <div className="text-sm">OrderedAt: {new Date(order.createdAt).toLocaleDateString()}</div>
                        <div className="text-sm">Total: ₹ {order.total.toLocaleString()}</div>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    )
}
