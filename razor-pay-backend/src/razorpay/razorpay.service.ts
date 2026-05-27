import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';
import { CreateOrderDto } from './dto/create-order.dto';
import * as crypto from 'crypto';

@Injectable()
export class RazorpayService {
  private razorpay: Razorpay;
  private readonly logger = new Logger(RazorpayService.name);

  constructor(private configService: ConfigService) {
    this.razorpay = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_KEY_ID'),
      key_secret: this.configService.get<string>('RAZORPAY_KEY_SECRET'),
    });
  }

  // 1️⃣ Create Order
  async createOrder(createOrderDto: CreateOrderDto) {
    const { amount, currency, receipt } = createOrderDto;
    const order = await this.razorpay.orders.create({
      amount: amount * 100,
      currency,
      receipt,
    });
    return order;
  }

  // 2️⃣ Verify Payment Signature
  verifyPayment(
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string,
  ): boolean {
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', this.configService.get<string>('RAZORPAY_KEY_SECRET')!)
      .update(body)
      .digest('hex');

    return expectedSignature === razorpay_signature;
  }

  // 3️⃣ Verify Webhook Signature
  verifyWebhookSignature(rawBody: Buffer, signature: string): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', this.configService.get<string>('RAZORPAY_WEBHOOK_SECRET')!)
      .update(rawBody)
      .digest('hex');

    return expectedSignature === signature;
  }

  // 4️⃣ Handle Webhook Events
  async handleWebhookEvent(payload: any): Promise<void> {
    const event = payload.event;

    this.logger.log(`📩 Webhook received: ${event}`);

    switch (event) {

      case 'payment.captured':
        await this.onPaymentCaptured(payload.payload.payment.entity);
        break;

      case 'payment.failed':
        await this.onPaymentFailed(payload.payload.payment.entity);
        break;

      case 'order.paid':
        await this.onOrderPaid(payload.payload.order.entity);
        break;

      case 'refund.created':
        await this.onRefundCreated(payload.payload.refund.entity);
        break;

      default:
        this.logger.warn(`⚠️ Unhandled event: ${event}`);
    }
  }

  private async onPaymentCaptured(payment: any) {
    this.logger.log(`✅ Payment captured!`);
    this.logger.log(`   Payment ID : ${payment.id}`);
    this.logger.log(`   Amount     : ₹${payment.amount / 100}`);
    this.logger.log(`   Email      : ${payment.email}`);
  }

  private async onPaymentFailed(payment: any) {
    this.logger.log(`❌ Payment failed!`);
    this.logger.log(`   Payment ID    : ${payment.id}`);
    this.logger.log(`   Error Reason  : ${payment.error_description}`);
  }

  private async onOrderPaid(order: any) {
    this.logger.log(`🛒 Order paid!`);
    this.logger.log(`   Order ID : ${order.id}`);
    this.logger.log(`   Amount   : ₹${order.amount / 100}`);
  }

  private async onRefundCreated(refund: any) {
    this.logger.log(`🔁 Refund created!`);
    this.logger.log(`   Refund ID  : ${refund.id}`);
    this.logger.log(`   Amount     : ₹${refund.amount / 100}`);
  }
}