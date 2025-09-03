"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CATEGORIES } from "@/lib/data"
import { SearchBar } from "./search-bar"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function Header() {
    const pathname = usePathname()
    const { items } = useCart()
    const { ids } = useWishlist()
    const [open, setOpen] = useState(false)

    return (
        <header className="border-b bg-background">
            <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
                <Link href="/" className="font-bold text-lg text-balance">
                    ShopMate
                </Link>

                <div className="relative">
                    <Button
                        variant="ghost"
                        className={cn("hidden md:flex items-center gap-2")}
                        onClick={() => setOpen((o) => !o)}
                        aria-expanded={open}
                        aria-haspopup="menu"
                    >
                        Categories
                        <span aria-hidden>▾</span>
                    </Button>
                    {open && (
                        <nav
                            className="absolute mt-2 w-56 rounded-md border bg-background shadow-lg z-30"
                            role="menu"
                            onMouseLeave={() => setOpen(false)}
                        >
                            <ul className="py-1">
                                {CATEGORIES.map((cat) => (
                                    <li key={cat}>
                                        <Link
                                            href={`/products?category=${encodeURIComponent(cat)}`}
                                            className="block px-3 py-2 text-sm hover:bg-muted"
                                            role="menuitem"
                                            onClick={() => setOpen(false)}
                                        >
                                            {cat}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    )}
                </div>

                <div className="flex-1 max-w-xl">
                    <SearchBar />
                </div>

                <nav className="ml-auto flex items-center gap-3">
                    <Link href="/wishlist" className={cn("text-sm hover:underline", pathname === "/wishlist" && "text-blue-600")}>
                        Wishlist ({ids.length})
                    </Link>
                    <Link href="/cart" className={cn("text-sm hover:underline", pathname === "/cart" && "text-blue-600")}>
                        Cart ({items.reduce((a, b) => a + b.quantity, 0)})
                    </Link>
                    <Link href="/track" className={cn("text-sm hover:underline", pathname === "/track" && "text-blue-600")}>
                        Track Order
                    </Link>
                </nav>
            </div>
        </header>
    )
}
