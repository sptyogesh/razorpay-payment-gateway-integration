import { Module } from '@nestjs/common';
import { RazorpayModule } from './razorpay/razorpay.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), RazorpayModule],
})
export class AppModule {}
