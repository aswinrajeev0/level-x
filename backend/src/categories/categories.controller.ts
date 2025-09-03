import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
    constructor(
        private categoriesService: CategoriesService
    ){}

    @Get()
    async categories(){
        return await this.categoriesService.getCategories()
    }
}
