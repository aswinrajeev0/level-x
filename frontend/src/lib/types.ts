export type Seller = {
    seller: {
        name: string
        shopName: string
    }
    id: string
    price: number
    baseLeadDays: number
    rating?: number
}

export type Product = {
    id: string
    slug: string
    name: string
    description: string
    price: number
    category: {
        id: string
        name: string
    }
    imageUrl: string
    sellers: Seller[]
    attributes?: Record<string, string | number>
}

export type CartItem = {
    id: string
    productId: string
    quantity: number
    sellerId?: string,
    product: Product,
    price: number

}

export type Address = {
    name: string
    phone: string
    line1: string
    line2?: string
    city: string
    state: string
    pincode: string
}

export type Order = {
    id: string
    items: Array<{ productId: string; quantity: number; sellerId?: string; price: number }>
    total: number
    address: Address
    trackingId: string
    status: "created" | "paid" | "shipped" | "out_for_delivery" | "delivered"
    placedAt: string
}
