import { Module } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CartModule } from 'src/cart/cart.module';
import { CheckoutController } from './checkout.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [CheckoutService],
  imports: [CartModule, AuthModule],
  controllers: [CheckoutController],
  exports: [CheckoutService]
})
export class CheckoutModule {}
