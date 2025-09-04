import { BadRequestException, Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('checkout')
export class CheckoutController {
    constructor(
        private checkoutService: CheckoutService
    ) { }

    @Post()
    async checkout(@Req() req: any, @Body() body: any) {
        const userId = req.user.id;
        return this.checkoutService.checkout(userId);
    }

    @Post('confirm')
    async confirm(@Body() body: any) {
        const { orderId, paymentId } = body;
        return this.checkoutService.confirmPayment(orderId, paymentId);
    }

    @Get('track/:id')
    async track(@Param('id') id: string){
        if(!id) throw new BadRequestException("id is required")
        return this.checkoutService.track(id)
    }
}
