import type { Product, Seller } from "./types"

export const CATEGORIES = ["Electronics", "Home & Kitchen", "Books", "Fashion", "Gaming", "Sports"] as const

const sellers: Seller[] = [
    { id: "s1", name: "Acme Retail", price: 0, baseLeadDays: 2, rating: 4.6 },
    { id: "s2", name: "BestBuy Co", price: 0, baseLeadDays: 3, rating: 4.4 },
    { id: "s3", name: "MegaMart", price: 0, baseLeadDays: 1, rating: 4.2 },
]

function withSellers(base: number, variance = 1500): Seller[] {
    return sellers.map((s, idx) => ({
        ...s,
        price: base + (idx - 1) * Math.round(variance * 0.3) + Math.round(Math.random() * 200),
    }))
}

export const PRODUCTS: Product[] = [
    {
        id: "p1",
        slug: "noise-cancelling-headphones",
        title: "Noise Cancelling Headphones",
        description: "Over-ear, active noise cancellation with 30h battery life.",
        price: 15999,
        category: "Electronics",
        image: "/noise-cancelling-headphones.png",
        sellers: withSellers(15999),
        attributes: { brand: "Sonic", color: "Black" },
    },
    {
        id: "p2",
        slug: "smart-speaker",
        title: "Smart Speaker",
        description: "Voice assistant, room-filling sound, multi-room pairing.",
        price: 8999,
        category: "Electronics",
        image: "/smart-speaker.png",
        sellers: withSellers(8999),
        attributes: { brand: "EchoWave", color: "White" },
    },
    {
        id: "p3",
        slug: "cast-iron-skillet",
        title: 'Cast Iron Skillet 12"',
        description: "Pre-seasoned cast iron skillet for perfect sear.",
        price: 3499,
        category: "Home & Kitchen",
        image: "/cast-iron-skillet.png",
        sellers: withSellers(3499),
        attributes: { brand: "ChefPro", weight: "3.2kg" },
    },
    {
        id: "p4",
        slug: "bestseller-novel",
        title: "Bestseller Novel",
        description: "Award-winning fiction with gripping narrative.",
        price: 1299,
        category: "Books",
        image: "/bestseller-novel.png",
        sellers: withSellers(1299),
        attributes: { author: "A. Writer", pages: 356 },
    },
    {
        id: "p5",
        slug: "running-shoes",
        title: "Lightweight Running Shoes",
        description: "Breathable mesh, cushioned midsole for daily runs.",
        price: 5999,
        category: "Fashion",
        image: "/running-shoes.png",
        sellers: withSellers(5999),
        attributes: { brand: "FleetFoot", color: "Blue" },
    },
    {
        id: "p6",
        slug: "gaming-mouse",
        title: "Gaming Mouse RGB",
        description: "12K DPI, programmable buttons, ergonomic shape.",
        price: 2499,
        category: "Gaming",
        image: "/gaming-mouse.png",
        sellers: withSellers(2499),
        attributes: { brand: "Pulse", color: "Black" },
    },
]
