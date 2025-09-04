import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req, Put, Query } from "@nestjs/common";
import { CartService } from "./cart.service";
import { AuthGuard } from "src/auth/auth.guard";

@UseGuards(AuthGuard)
@Controller("cart")
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Get(":userId")
    async getCart(@Param("userId") userId: string) {
        return this.cartService.getCart(userId);
    }

    @Post("add")
    async addToCart(@Req() req: any, @Body() body: { productId: string; sellerId: string; quantity: number }) {
        const userId = req.user?.id;
        if(!userId) return;
        return this.cartService.addItem({...body, userId});
    }

    @Put("update")
    async updateCart(@Body() body: { id: string; quantity: number }) {
        return this.cartService.updateItem(body);
    }

    @Delete("remove")
    async removeFromCart(@Query() id: string ) {
        return this.cartService.removeItem(id);
    }
}
