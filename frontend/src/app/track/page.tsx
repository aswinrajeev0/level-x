"use client"

import { useSearchParams } from "next/navigation"
import useSWR from "swr"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function TrackPage() {
    const params = useSearchParams()
    const initial = params.get("tracking") ?? ""
    const [id, setId] = useState(initial)
    const { data, isLoading, error, mutate } = useSWR(id ? `/api/track/${encodeURIComponent(id)}` : null, fetcher)

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-semibold">Track My Order</h1>
            <div className="flex items-center gap-2 max-w-md">
                <Input placeholder="Enter tracking ID" value={id} onChange={(e) => setId(e.target.value)} />
                <Button onClick={() => mutate()}>Track</Button>
            </div>

            {isLoading && <div className="text-sm text-muted-foreground">Fetching tracking info...</div>}
            {error && <div className="text-sm text-red-600">Unable to fetch tracking info.</div>}
            {data && (
                <div className="rounded-md border p-4 space-y-3">
                    <div className="text-sm">Tracking ID: {data.trackingId}</div>
                    <div className="text-sm">Status: {data.status}</div>
                    <div className="text-sm">ETA: {data.eta}</div>
                    <div className="text-sm font-medium mt-2">History</div>
                    <ul className="text-sm list-disc pl-5">
                        {data.history.map((h: any) => (
                            <li key={h.time}>
                                {h.time} — {h.event}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
