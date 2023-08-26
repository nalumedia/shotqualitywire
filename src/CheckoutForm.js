import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

function CheckoutForm() {
  const [email, setEmail] = useState('');
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: { email }
    });

    if (error) {
      console.error(error);
    } else {
      console.log('[PaymentMethod]', paymentMethod);
      // Send paymentMethod.id to your server for processing
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
      </div>
      <div>
        <CardElement />
      </div>
      <button type="submit" disabled={!stripe}>Pay</button>
    </form>
  );
}

export default CheckoutForm;
