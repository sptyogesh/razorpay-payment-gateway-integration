export class CreateOrderDto {
  amount: number;   // in paise (₹1 = 100 paise)
  currency: string; // "INR"
  receipt: string;  // unique receipt id
}