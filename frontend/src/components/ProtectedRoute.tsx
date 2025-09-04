"use client"

import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const user = useSelector((state: RootState) => state.auth.user)
    const router = useRouter()

    useEffect(() => {
        if (!user) {
            router.push("/auth")
        }
    }, [user, router])

    if (!user) {
        return <div className="p-4">Checking authentication...</div>
    }

    return <>{children}</>
}
