import React, { useState } from 'react';
import useRazorpay from '../hooks/useRazorpay';

interface PaymentButtonProps {
  amount: number;
  label?: string;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  amount,
  label = 'Pay Now',
}) => {
  const { initiatePayment } = useRazorpay();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      await initiatePayment(amount);
    } catch (error) {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      style={{
        backgroundColor: loading ? '#aaa' : '#3399cc',
        color: '#fff',
        padding: '12px 24px',
        fontSize: '16px',
        border: 'none',
        borderRadius: '8px',
        cursor: loading ? 'not-allowed' : 'pointer',
      }}
    >
      {loading ? 'Processing...' : `${label} ₹${amount}`}
    </button>
  );
};

export default PaymentButton;