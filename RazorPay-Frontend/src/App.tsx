import React from 'react';
import PaymentButton from './components/PaymentButton';

const App: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>🛒 My Store</h1>
      <p>Click below to make a test payment</p>

      {/* ₹500 payment */}
      <PaymentButton amount={500} label="Buy Now" />
    </div>
  );
};

export default App;