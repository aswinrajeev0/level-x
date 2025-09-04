import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { CartModule } from './cart/cart.module';
import { CheckoutController } from './checkout/checkout.controller';
import { CheckoutModule } from './checkout/checkout.module';
import { WishlistModule } from './wishlist/wishlist.module';

@Module({
  imports: [UsersModule, AuthModule, ProductsModule, CategoriesModule, CartModule, CheckoutModule, WishlistModule],
  controllers: [AppController, CheckoutController],
  providers: [AppService],
})
export class AppModule {}
