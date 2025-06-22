import axios from "axios";
import config from "../config";
import TelegramBot from "./bot";

import { Context } from "grammy";

export const Instance = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus: () => true,
})

/**
 * Makes a request to the KeyAuth API with the provided parameters.
 * @param params The parameters to send with the request.
 * @returns The response data from the API.
 * @throws Will throw an error if the request fails.
 */
export async function Request(params: Record<string, any>): Promise<any> {
  try {
    const response = await Instance.get("", { params });
    return response.data;
  } catch (error) {
    console.error("Error making request:", error);
    throw error;
  }
}

/**
 * Middleware to get the currently selected seller key for a user
 * @param ctx The Telegram context
 * @param bot The bot instance
 * @returns The seller key if it exists, otherwise responds with an error message
 */
export async function GetSellerKey(ctx: Context, bot: TelegramBot): Promise<string | null> {
  const userId = ctx.from?.id;
  
  if (!userId) {
    await ctx.reply("Error: Could not identify your user account.");
    return null;
  }
  
  const sellerKey = await bot.database.get(`selectedapp.${userId}`);
  
  if (!sellerKey) {
    await ctx.reply("⚠️ No application is currently selected. Please run /setseller to select an application first.");
    return null;
  }
  
  return sellerKey;
}