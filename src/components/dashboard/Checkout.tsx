import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { Link } from 'react-router-dom';
import { toast, Toaster } from 'sonner';
import { paymentApi } from '../../features/api/paymentApiSlice';
import { userApi } from '../../features/api/userApiSlice';
import { apiDomain } from '../../proxxy/proxxy';
import axios from 'axios';

const stripePromise = loadStripe('pk_test_51PYWkuRsls6dWz1RBvlMFpPhiI1J9szlUjGxpgAvIXsx2kiC9OWDvnWD6PsEwbUU6CTdw0FJ2O3b0Y6rSXAZ0hc200wJCewxdF'); 


const Checkout = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const user_id = user?.user.user_id;
    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        couponCode: '',
        mobileMoneyNumber: '',
    });
    const [paymentMethod, setPaymentMethod] = useState<'voucher' | 'card' | 'mobile'>('voucher');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    // Call the hook at the top level of the component
    const { data: voucherData, error } = paymentApi.useCheckVoucherQuery(formData.couponCode, {
        skip: paymentMethod !== 'voucher' || !formData.couponCode,
    });
    const [upgradeUserMutation] = userApi.useUpgradeUserMutation(user_id);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPaymentMethod(e.target.value as 'voucher' | 'card' | 'mobile');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (paymentMethod === 'voucher') {
            if (voucherData && !error) {
                // Voucher code is valid
                try {
                    await upgradeUserMutation(user_id);
                    setSuccess(true);
                    setIsSubmitting(false);
                    toast.success('Upgrade successful 🎉');
                } catch (err: any) {
                    toast.error('Failed to upgrade: ' + (err.data?.msg || err.msg || err.error || err));
                    setIsSubmitting(false);
                }
            } else {
                // Voucher code is invalid or not checked
                toast.error('Invalid voucher code');
                setIsSubmitting(false);
            }
        } else if (paymentMethod === 'mobile') {
            toast.error('Mobile money payment coming soon 😊');
            // Handle mobile money payment
            // Simulate mobile money processing
            // setTimeout(() => {
            //     setSuccess(true);
            //     setIsSubmitting(false);
            // }, 2000);
        }
    };

    const handleStripeCheckout = async () => {
        try {
            const stripe = await stripePromise;
            const amount = 100;
            const checkoutPayload = {
                amount,
                user_id, // Include the user_id in the payload
            };
            const header = { 'Content-Type': 'application/json' };
            const checkoutResponse = await axios.post(`${apiDomain}create-checkout-session/${user_id}`, JSON.stringify(checkoutPayload), {
                headers: header,
            })
            const session = checkoutResponse.data;
            await stripe?.redirectToCheckout({ sessionId: session.id });
        } catch (error:any) {
            toast.error('Failed to checkout: ' + error.message);
        };
    };

    if (success) {
        return (
            <div className="bg-white text-gray-900 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Payment Successful!</h2>
                <p className="mb-4">Thank you for your purchase. You now have access to the premium content.</p>
                <button className='btn btn-outline btn-success'>
                    <Link to="/dashboard/me/historical-inflation">View</Link>
                </button>
            </div>
        );
    }

    return (
        <>
            <Toaster toastOptions={{
                classNames: {
                    error: 'bg-red-400',
                    success: 'text-green-400',
                    warning: 'text-yellow-400',
                    info: 'bg-blue-400',
                },
            }}
            />
            <div className="bg-white text-gray-900 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Premium Membership</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Payment Method</label>
                        <select
                            value={paymentMethod}
                            onChange={handlePaymentMethodChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        >
                            <option value="voucher">Voucher</option>
                            <option value="card">Credit/Debit Card</option>
                            <option value="mobile">Mobile Money</option>
                        </select>
                    </div>
                    {paymentMethod === 'voucher' && (
                        <div className="mb-4">
                            <label className="block mb-2">Voucher Code</label>
                            <input
                                type="text"
                                name="couponCode"
                                value={formData.couponCode}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                    )}
                    {paymentMethod === 'mobile' && (
                        <div className="mb-4">
                            <label className="block mb-2">Mobile Money Number</label>
                            <input
                                type="text"
                                name="mobileMoneyNumber"
                                value={formData.mobileMoneyNumber}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                    )}
                    {paymentMethod === 'card' && (
                        <button
                            type="button"
                            className={`bg-green-500 text-white px-4 py-2 rounded mt-4 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isSubmitting}
                            onClick={handleStripeCheckout}
                        >
                            Checkout
                        </button>
                    )}
                    {(paymentMethod === 'voucher' || paymentMethod === 'mobile') && (
                        <button
                            type="submit"
                            className={`bg-blue-500 text-white px-4 py-2 rounded mt-4 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Processing...' : 'Pay 100 Shillings'}
                        </button>
                    )}
                </form>
            </div>
        </>
    );
}

export default Checkout;
