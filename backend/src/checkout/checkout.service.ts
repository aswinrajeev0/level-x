import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import Razorpay from 'razorpay';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class CheckoutService {
    private razorpay: Razorpay;

    constructor(
        private prisma: PrismaService,
        private cartService: CartService
    ) {
        this.razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_SECRET!,
        });
    }

    async checkout(userId: string, address: any) {
        const cartItems = await this.prisma.cart.findMany({
            where: { userId },
            include: {
                product: true,
                seller: true,
            },
        });

        if (!cartItems.length) throw new BadRequestException('Cart is empty');

        const itemsWithPrice = await Promise.all(
            cartItems.map(async (item) => {
                const listing = await this.prisma.sellerProduct.findUnique({
                    where: {
                        productId_sellerId: {
                            productId: item.productId,
                            sellerId: item.sellerId!,
                        },
                    },
                });

                return {
                    productId: item.productId,
                    sellerId: item.sellerId!,
                    quantity: item.quantity,
                    price: listing?.price || 0,
                };
            }),
        );

        const total = itemsWithPrice.reduce((sum, i) => sum + i.price * i.quantity, 0);

        const order = await this.prisma.order.create({
            data: {
                userId,
                total,
                status: 'PENDING',
                items: {
                    create: itemsWithPrice,
                },
            },
        });

        const razorpayOrder = await this.razorpay.orders.create({
            amount: Math.round(total * 100),
            currency: 'INR',
            receipt: order.id,
            payment_capture: true,
        });

        return {
            orderId: order.id,
            razorpayOrderId: razorpayOrder.id,
            amount: total,
            currency: 'INR',
        };
    }

    async confirmPayment(orderId: string, paymentId: string) {
        const existingOrder = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!existingOrder) throw new BadRequestException('Order not found');
        const order = await this.prisma.order.update({
            where: { id: orderId },
            data: {
                status: 'CONFIRMED',
                payment: {
                    create: {
                        provider: 'Razorpay',
                        amount: existingOrder.total,
                        status: 'SUCCESS',
                        createdAt: new Date(),
                    },
                },
            },
            include: { items: true },
        });

        for (const item of order.items) {
            await this.prisma.sellerProduct.update({
                where: {
                    productId_sellerId: {
                        sellerId: item.sellerId,
                        productId: item.productId,
                    },
                },
                data: { stock: { decrement: item.quantity } },
            });
        }

        // await this.prisma.cart.deleteMany({ where: { userId: order.userId } });

        return order;
    }
}
