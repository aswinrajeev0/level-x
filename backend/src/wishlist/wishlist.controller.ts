import { Controller, Delete, Get, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('wishlist')
export class WishlistController {
    constructor(
        private wishlistService: WishlistService
    ){}

    @Get()
    async wishlist(@Req() req: any){
        const userId = req.user?.id;
        if(!userId){
            throw new UnauthorizedException("Unauthorized user");
        }

        return await this.wishlistService.getWishlist(userId)
    }

    @Delete()
    async remove(@Query() id: string){
        await this.wishlistService.removeFromWishlist(id);
    }
}
