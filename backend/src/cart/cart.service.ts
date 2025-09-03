import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
    constructor(
        private prisma: PrismaService
    ) { }

    async getCart(userId: string) {
        const cartItems = await this.prisma.cart.findMany({
            where: { userId },
            include: {
                product: { include: { category: true } },
                seller: true,
            },
        });

        // attach seller's price to each cart item
        return Promise.all(
            cartItems.map(async (item) => {
                const listing = await this.prisma.sellerProduct.findUnique({
                    where: {
                        productId_sellerId: {
                            productId: item.productId,
                            sellerId: item.sellerId,
                        },
                    },
                });

                return {
                    ...item,
                    price: listing?.price ?? null,
                };
            }),
        );
    }

    async getCartTotal(userId: string) {
        const cartItems = await this.prisma.cart.findMany({
            where: { userId },
            include: { product: true, seller: true },
        });

        let total = 0;

        for (const item of cartItems) {
            const listing = await this.prisma.sellerProduct.findUnique({
                where: {
                    productId_sellerId: {
                        productId: item.productId,
                        sellerId: item.sellerId!,
                    },
                },
            });
            const price = listing?.price ?? 0;
            total += price * item.quantity;
        }

        return total;
    }

    async addItem(cartData: {userId: string, sellerId: string, productId: string, quantity: number}){
        await this.prisma.cart.create({
            data: cartData
        })
    }

}
