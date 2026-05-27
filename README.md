# 💳 Razorpay Full-Stack Integration Showcase

This repository demonstrates a complete, secure, and production-ready integration of the **Razorpay Payment Gateway**. It consists of a modern **React (Vite)** frontend and a robust **NestJS** backend, showcasing best practices for processing online payments, verifying signatures, and handling webhooks securely.

## 🚀 Tech Stack

### Frontend (`/RazorPay-Frontend`)
* **Framework:** React 19 + TypeScript
* **Build Tool:** Vite
* **Integration:** Razorpay Standard Checkout (`razorpay` SDK)
* **HTTP Client:** Axios

### Backend (`/razor-pay-backend`)
* **Framework:** NestJS + TypeScript
* **Integration:** Razorpay Node.js SDK
* **Features:** Order Creation, Signature Verification, Secure Webhook Handling

## ✨ Key Features

- **Order Generation:** Securely generates Razorpay order IDs from the backend to prevent tampering.
- **Payment Verification:** Backend verification of `razorpay_signature` using HMAC SHA256 to ensure data integrity.
- **Webhook Handling:** Secure webhook endpoint that processes asynchronous payment events directly from Razorpay.
- **Type Safety:** End-to-end TypeScript implementation.

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- A [Razorpay Dashboard](https://dashboard.razorpay.com/) account (Test Mode)

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/yourusername/razorpay-fullstack-showcase.git
cd razorpay-fullstack-showcase
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd razor-pay-backend
npm install
\`\`\`
Create a `.env` file in the `razor-pay-backend` directory and add your Razorpay API keys:
\`\`\`env
RAZORPAY_KEY_ID=your_test_key_id
RAZORPAY_KEY_SECRET=your_test_key_secret
\`\`\`
Start the NestJS development server:
\`\`\`bash
npm run start:dev
\`\`\`
*The backend will run on `http://localhost:3000`*

### 3. Frontend Setup
Open a new terminal window:
\`\`\`bash
cd RazorPay-Frontend
npm install
\`\`\`
Create a `.env` file in the `RazorPay-Frontend` directory:
\`\`\`env
VITE_RAZORPAY_KEY_ID=your_test_key_id
VITE_API_URL=http://localhost:3000
\`\`\`
Start the Vite development server:
\`\`\`bash
npm run dev
\`\`\`
*The frontend will run on `http://localhost:5173`*

## 🔒 Security Best Practices Implemented
1. **Never pass the amount directly from the frontend** (Order creation is handled server-side).
2. **Signature Verification:** The backend cross-checks the payment signature sent by the frontend before confirming the payment.
3. **Webhook Validation:** Incoming webhooks from Razorpay are verified using a secret hash to ensure they originated from Razorpay.
