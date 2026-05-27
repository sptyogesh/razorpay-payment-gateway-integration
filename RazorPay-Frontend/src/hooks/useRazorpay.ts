import { useCallback } from 'react';
import { createOrder, verifyPayment } from '../services/payment.service';

// Load Razorpay script dynamically
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const useRazorpay = () => {
  const initiatePayment = useCallback(async (amount: number) => {
    // 1️⃣ Load Razorpay script
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert('Failed to load Razorpay. Check your internet connection.');
      return;
    }

    // 2️⃣ Create order from backend
    const order = await createOrder(amount);

    // 3️⃣ Open Razorpay Checkout
    const options: RazorpayOptions = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'My Store 🛒',
      description: 'Test Payment',
      order_id: order.id,

      // 4️⃣ Handle success
      handler: async (response: RazorpayResponse) => {
        try {
          const result = await verifyPayment(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature,
          );
          if (result.success) {
            alert('✅ Payment Successful! ID: ' + response.razorpay_payment_id);
          }
        } catch (error) {
          alert('❌ Payment verification failed!');
        }
      },

      prefill: {
        name: 'Test User',
        email: 'test@example.com',
        contact: '9999999999',
      },

      theme: { color: '#3399cc' },

      modal: {
        ondismiss: () => {
          console.log('Payment popup closed by user');
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  }, []);

  return { initiatePayment };
};

export default useRazorpay;