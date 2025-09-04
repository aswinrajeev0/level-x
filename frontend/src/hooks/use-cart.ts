"use client"

import type { CartItem } from "@/lib/types"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { apiClient } from "../../api/api.client"

export function useCart() {
    const [items, setItems] = useState<CartItem[]>([])
    const [_loading, setLoading] = useState(false)
    const { user } = useSelector((state: RootState) => state.auth)

    useEffect(() => {
        if (!user?.id) return
        const fetchCart = async () => {
            const res = await apiClient.get(`/cart/${user.id}`)
            const data = res.data
            setItems(data)
            setLoading(false)
        }
        fetchCart()
    }, [user?.id])

    const refreshCart = async () => {
        if (!user?.id) return
        const res = await apiClient.get(`/cart/${user.id}`)
        setItems(res.data)
    }

    const add = async (productId: string, quantity = 1, sellerId?: string) => {
        await apiClient.post(`/cart/add`,
            { productId, sellerId, quantity },
        )

        await refreshCart()
    }

    const update = async (id: string, quantity: number) => {
        await apiClient.put(`/cart/update`, {
            id,
            quantity,
        })

        await refreshCart()
    }

    const remove = async (productId: string, sellerId?: string) => {
        await apiClient.put(`/cart/remove`, {
            userId: user?.id,
            productId,
            sellerId
        })

        await refreshCart()
    }

    const clear = () => setItems([])

    const total = items.reduce((sum, i) => {
        return sum + i.price * i.quantity
    }, 0)

    return { items, add, update, remove, clear, total }
}
