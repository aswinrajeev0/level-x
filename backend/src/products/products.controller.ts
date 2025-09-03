import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get()
    async getProducts(
        @Query('category') category?: string,
        @Query('minPrice') minPrice?: string,
        @Query('maxPrice') maxPrice?: string,
    ) {
        return this.productsService.fetchProducts(category, minPrice, maxPrice);
    }

    @Get(':id')
    async productDetails(@Param('id') id: string) {
        return this.productsService.findOneById(id);
    }
}
