import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
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
        const address = body.address;
        return this.checkoutService.checkout(userId, address);
    }

    @Post('confirm')
    async confirm(@Body() body: any) {
        const { orderId, paymentId } = body;
        return this.checkoutService.confirmPayment(orderId, paymentId);
    }
}
