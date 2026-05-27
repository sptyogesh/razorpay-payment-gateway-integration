import type { Request } from 'express';
import { RazorpayService } from './razorpay.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Body, Controller, Headers, HttpException, HttpStatus, Post, Req } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';

@Controller('razorpay')
export class RazorpayController {
  constructor(private readonly razorpayService: RazorpayService) {}

  @Post('create-order')
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    try {
      const order = await this.razorpayService.createOrder(createOrderDto);
      return { success: true, order };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('verify-payment')
  verifyPayment(
    @Body()
    body: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    },
  ) {
    const isValid = this.razorpayService.verifyPayment(
      body.razorpay_order_id,
      body.razorpay_payment_id,
      body.razorpay_signature,
    );

    if (!isValid) {
      throw new HttpException('Invalid payment signature', HttpStatus.BAD_REQUEST);
    }

    return { success: true, message: 'Payment verified ✅' };
  }


  @Post('webhook')
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('x-razorpay-signature') signature: string,
    @Body() body: any,
  ) {
    // 1️⃣ Verify webhook signature
    const isValid = this.razorpayService.verifyWebhookSignature(
      req.rawBody!,
      signature,
    );

    if (!isValid) {
      throw new HttpException('Invalid webhook signature', HttpStatus.BAD_REQUEST);
    }

    // 2️⃣ Handle events
    await this.razorpayService.handleWebhookEvent(body);

    return { received: true };
  }
}