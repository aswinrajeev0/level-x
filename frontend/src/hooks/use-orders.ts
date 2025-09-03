"use client"

import { useLocalStorage } from "./use-local-storage"
import type { Order } from "@/lib/types"

export function useOrders() {
    const [orders, setOrders] = useLocalStorage<Order[]>("orders:v1", [])
    const add = (order: Order) => setOrders((prev) => [order, ...prev])
    const getById = (id: string) => orders.find((o) => o.id === id)
    return { orders, add, getById }
}
