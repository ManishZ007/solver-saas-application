import { Request, Response } from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

class paymentController {
  static async client_secret(request: Request, response: Response) {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return response.status(500).json({
        success: false,
        message: "Stripe Secret Key is missing in environment variables.",
      });
    }

    console.log(stripeSecretKey);

    // Initialize Stripe with the secret key
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2024-10-28.acacia",
    });
    try {
      const { amount, currency } = request.body;

      const price = amount * 100;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: price,
        currency,
      });

      response.status(200).json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      response.status(500).json({
        success: false,
        message: "somthing went wrong please try again letter!",
      });
    }
  }
}

export default paymentController;
