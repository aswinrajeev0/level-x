"use client"

import { useLocalStorage } from "./use-local-storage"

export function useWishlist() {
    const [ids, setIds] = useLocalStorage<string[]>("wishlist:v1", [])
    const toggle = (id: string) => {
        setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
    }
    const has = (id: string) => ids.includes(id)
    return { ids, toggle, has }
}
