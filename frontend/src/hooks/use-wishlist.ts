"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { apiClient } from "../../api/api.client"
import { WishlistItem } from "@/lib/types"

export function useWishlist() {
    const [items, setItems] = useState<WishlistItem[]>([])
    const { user } = useSelector((state: RootState) => state.auth)

    useEffect(() => {
        if (!user?.id) return;
        const fetchWishlist = async () => {
            const res = await apiClient.get(`/wishlist`);
            const data = res.data;
            setItems(data);
        }

        fetchWishlist()
    }, [user?.id])

    const refreshWishlist = async () => {
        if (!user?.id) return
        const res = await apiClient.get(`/wishlist`);
        setItems(res.data)
    }

    const remove = async (id: string) => {
        await apiClient.delete(`/wishlist?id=${id}`);
        refreshWishlist()
    }
    const has = (id: string) => items.some(item => item.id === id)
    return { items, remove, has }
}
