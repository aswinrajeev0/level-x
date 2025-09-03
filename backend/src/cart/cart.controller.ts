import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from "@nestjs/common";
import { CartService } from "./cart.service";
import { AuthGuard } from "src/auth/auth.guard";

@Controller("cart")
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @UseGuards(AuthGuard)
    @Get(":userId")
    async getCart(@Param("userId") userId: string) {
        return this.cartService.getCart(userId);
    }

    @Post("add")
    async addToCart(@Req() req: any, @Body() body: { productId: string; sellerId: string; quantity: number }) {
        const userId = req.user.id;
        return this.cartService.addItem({...body, userId});
    }

    // @Post("update")
    // async updateCart(@Body() body: { userId: string; productId: string; sellerId?: string; quantity: number }) {
    //     return this.cartService.updateItem(body);
    // }

    // @Delete("remove")
    // async removeFromCart(@Body() body: { userId: string; productId: string; sellerId?: string }) {
    //     return this.cartService.removeItem(body);
    // }
}
