import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WishlistService {
    constructor(
        private prisma: PrismaService
    ){}

    async getWishlist(userId: string){
        const wishlist = await this.prisma.wishlist.findMany({
            where: {
                userId
            },
            include: {
                product: {
                    include: {
                        sellers: true,
                        category: true
                    }
                }
            }
        })

        return wishlist;
    }

    async addToWishlist(userId: string, productId: string){
        await this.prisma.wishlist.create({
            data: {
                userId,
                productId
            }
        })
    }

    async removeFromWishlist(id: string){
        await this.prisma.wishlist.delete({where: {id}})
    }
}
