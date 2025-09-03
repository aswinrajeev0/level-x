// CheckoutButton.tsx
import { useState } from 'react';
import { apiClient } from '../../api/api.client';

export function CheckoutButton({ address }: { address: any }) {
    const [loading, setLoading] = useState(false);

    async function handleCheckout() {
        setLoading(true);
        try {
            const { data } = await apiClient.post('/checkout', { address });

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY!,
                amount: data.amount * 100,
                currency: data.currency,
                name: 'My Marketplace',
                order_id: data.razorpayOrderId,
                handler: async function (response: any) {
                    await apiClient.post('/checkout/confirm', {
                        orderId: data.orderId,
                        paymentId: response.razorpay_payment_id,
                    });
                    window.location.href = `/checkout/success?orderId=${data.orderId}`;
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error(err);
            alert('Payment failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <button onClick={handleCheckout} disabled={loading}>
            {loading ? 'Processing...' : 'Pay Now'}
        </button>
    );
}
