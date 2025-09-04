import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    async fetchProducts(query?: string, category?: string, minPrice?: string, maxPrice?: string) {
        const filters: any = {};

        if(query){
            filters.name = {startsWith: query, mode: 'insensitive'};
        }

        if (category) {
            filters.category = {
                name: { equals: category, mode: 'insensitive' },
            };
        }

        let priceFilter: any = {};
        if (minPrice) priceFilter.gte = parseFloat(minPrice);
        if (maxPrice) priceFilter.lte = parseFloat(maxPrice);

        const products = await this.prisma.product.findMany({
            where: {
                ...filters,
                sellers: Object.keys(priceFilter).length
                    ? { some: { price: priceFilter } }
                    : undefined,
            },
            include: {
                category: true,
                sellers: true,
            },
        });

        return products;
    }

    async findOneById(id: string){
        return await this.prisma.product.findUnique({
            where: {id},
            include: {
                category: true,
                sellers: {
                    include: {
                        seller: true
                    }
                }
            }
        })
    }
}
