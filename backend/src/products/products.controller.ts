import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get()
    async getProducts(
        @Query('category') category?: string,
        @Query('min') min?: string,
        @Query('max') max?: string,
        @Query('query') query?: string
    ) {
        return this.productsService.fetchProducts(query, category, min, max);
    }

    @Get(':id')
    async productDetails(@Param('id') id: string) {
        return this.productsService.findOneById(id);
    }
}
