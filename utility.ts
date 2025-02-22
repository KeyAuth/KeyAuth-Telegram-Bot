import axios from "axios";
import { Bot, Context } from "grammy";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.KEYAUTH_SELLER_KEY) {
    throw new Error("Environment variables 'bottoken' and 'sellerkey' must be defined in the .env file.");
}

// Export environment variables
export const env = {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN!,
    KEYAUTH_SELLER_KEY: process.env.KEYAUTH_SELLER_KEY!,
};

// Configure axios instance
export const axiosInstance = axios.create({
    baseURL: `https://keyauth.win/api/seller/`,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
    params: {
        sellerkey: env.KEYAUTH_SELLER_KEY,
    },
});

// Add default error handling for axios
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("Axios request failed:", error.message);
        return Promise.reject(error);
    }
);

export default axiosInstance;
