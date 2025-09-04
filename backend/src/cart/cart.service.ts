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

    async addItem(cartData: { userId: string; sellerId: string; productId: string; quantity: number }) {
        return await this.prisma.cart.create({
            data: {
                quantity: cartData.quantity,
                user: { connect: { id: cartData.userId } },
                product: { connect: { id: cartData.productId } },
                seller: { connect: { id: cartData.sellerId } },
            },
            include: {
                user: true,
                product: true,
                seller: true,
            },
        })
    }


    async updateItem(data: { id: string, quantity: number }) {
        await this.prisma.cart.update({
            where: { id: data.id },
            data: { quantity: data.quantity }
        })
    }

    async removeItem(id: string) {
        await this.prisma.cart.delete({ where: { id } })
    }

}
