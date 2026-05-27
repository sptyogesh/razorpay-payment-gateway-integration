import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// 1️⃣ Create Order
export const createOrder = async (amount: number) => {
  const response = await axios.post(`${BASE_URL}/razorpay/create-order`, {
    amount,
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
  });
  return response.data.order;
};

// 2️⃣ Verify Payment
export const verifyPayment = async (
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string,
) => {
  const response = await axios.post(`${BASE_URL}/razorpay/verify-payment`, {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });
  return response.data;
};