"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios, { AxiosError } from "axios";
import { CLIENT_SECRET_URL, CREDIT_FREE_COIN_URL } from "@/lib/apiEndPoints";
import { useParams, useRouter } from "next/navigation";
import { ApiResponse } from "@/types/ApiResponse";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const publishStripeKey: string =
  "pk_test_51PY0cC2KJtW07fJpOZuqogja4djP1gX0RAZ40XrrJp6EKBUsXpE304r6C1VFqhleg7QSLsfNikdHBpS450nAzGes00QP6upP9B";

const stripePromise = loadStripe(publishStripeKey); // Replace with your publishable key

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");
  const { price } = useParams();
  const router = useRouter();
  const { data: session, update } = useSession();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const payloadClientSecert = {
      amount: Number(price),
      currency: "usd",
    };
    const response = await axios.post<ApiResponse>(
      CLIENT_SECRET_URL,
      payloadClientSecert
    );

    const clientSecret = response.data.clientSecret;

    if (!clientSecret) {
      console.error("Client secret is missing or undefined");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      // Handle the case where the cardElement is null
      console.error("CardElement not found");
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
        },
      }
    );

    if (error) {
      setMessage(`Payment failed: ${error.message}`);
    } else {
      try {
        const payload = {
          coin: Number(price),
        };

        const response = await axios.post<ApiResponse>(
          `${CREDIT_FREE_COIN_URL}/?user_id=${session?.user?.id}`,
          payload
        );

        if (response.data.success) {
          const updatePayload = {
            coin: response.data.data?.coin,
            free_coin_use: response.data.data?.free_coin_use,
          };
          await update(updatePayload);
          router.push("/dashboard/profile");
          toast.success(response.data.message);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.message);
        } else {
          toast.error("somthing went wrong!");
        }
      }
      setMessage(`Payment succeeded: ${paymentIntent.id}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
      <p>{message}</p>
    </form>
  );
};

const PaymentPage = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default PaymentPage;
