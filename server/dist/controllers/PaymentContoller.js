"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class paymentController {
    static async client_secret(request, response) {
        const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
        if (!stripeSecretKey) {
            return response.status(500).json({
                success: false,
                message: "Stripe Secret Key is missing in environment variables.",
            });
        }
        console.log(stripeSecretKey);
        // Initialize Stripe with the secret key
        const stripe = new stripe_1.default(stripeSecretKey, {
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
        }
        catch (error) {
            response.status(500).json({
                success: false,
                message: "somthing went wrong please try again letter!",
            });
        }
    }
}
exports.default = paymentController;