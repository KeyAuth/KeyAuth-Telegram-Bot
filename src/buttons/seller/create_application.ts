/**
  * Every file in this directory should be one file just like every other button
  * But I'm too lazy to do that now
*/

import { Context } from "grammy";
import { stateManager } from "../../utilities/state";
import { type Execute } from "../../interfaces/Button";
import { Request } from "../../utilities/session";
import TelegramBot from "../../utilities/bot";

let botInstance: TelegramBot | null = null;
let responses: Record<number, { sellerKey: string; appName: string }> = {};

export const name: string = "create_application";
export const cooldown: number = 30;
export const execute: Execute = async (ctx: Context, bot) => {
  await ctx.answerCallbackQuery();
  
  botInstance = bot;
  
  await ctx.reply("What is the seller key for your application?");

  if (ctx.from && ctx.from.id) {
    responses[ctx.from.id] = {
      sellerKey: "",
      appName: ""
    };
    
    stateManager.setWaitingForResponse(
      ctx.from.id,
      "create_application",
      handleSellerKeyResponse
    );
  } else {
    await ctx.reply("Sorry, I couldn't identify you. Please try again later.");
  }
};

async function handleSellerKeyResponse(ctx: Context): Promise<void> {
  const sellerKey = ctx.message?.text;
  const userId = ctx.from?.id;

  if (sellerKey && userId && responses[userId] && botInstance) {
    responses[userId].sellerKey = sellerKey;
    
    const applications = await botInstance.database.get(`applications.${userId}`) || [];
    const existingApp = applications.find((app: { sellerkey: string }) => app.sellerkey === sellerKey);
    
    if (existingApp) {
      await ctx.reply(
        `⚠️ You already have an application with this seller key named "${existingApp.name}". Please use a different seller key or select the existing application with /setseller.`
      );
      
      delete responses[userId];
      stateManager.clearState(userId);
      return;
    }

    const response = await Request({ sellerkey: sellerKey, type: "appdetails" });

    if (!response.success) {
      await ctx.reply(`❌ Error: ${response.message}`);
      return;
    } else {
      await ctx.reply(
        `Thank you! The seller key you input is valid. Now, please tell me what you would like to name your application:`
      );

      stateManager.setWaitingForResponse(
        userId,
        "create_application",
        handleAppNameResponse
      );
    }
  }
}

async function handleAppNameResponse(ctx: Context): Promise<void> {
  const appName = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!appName || !userId || !responses[userId]) {
    await ctx.reply("I was expecting a text message. Let's try again later.");
    return;
  }

  responses[userId].appName = appName;
  
  if (botInstance) {
    try {
      const loadingMessage = await ctx.reply("⏳ Saving application...");
      
      const applications = await botInstance.database.get(`applications.${userId}`) || [];
      
      // @ts-ignore
      const existingApp = applications.find((app: { sellerkey: string }) => app.sellerkey === responses[userId].sellerKey);
      if (existingApp) {
        await ctx.api.editMessageText(
          loadingMessage.chat.id,
          loadingMessage.message_id,
          `⚠️ You already have an application with this seller key named "${existingApp.name}".`
        );
        delete responses[userId];
        return;
      }
      
      applications.push({
        name: responses[userId].appName,
        sellerkey: responses[userId].sellerKey
      });
      
      await ctx.api.editMessageText(
        loadingMessage.chat.id,
        loadingMessage.message_id,
        "⏳ Saving application to database..."
      );
      
      await botInstance.database.set(`applications.${userId}`, applications);
      
      await ctx.api.editMessageText(
        loadingMessage.chat.id,
        loadingMessage.message_id,
        "⏳ Setting as active application..."
      );
      
      await botInstance.database.set(`selectedapp.${userId}`, responses[userId].sellerKey);
      
      await ctx.api.editMessageText(
        loadingMessage.chat.id,
        loadingMessage.message_id,
        `✅ Application "${responses[userId].appName}" saved successfully and set as your active application!`
      );
      
      delete responses[userId];
    } catch (error) {
      await ctx.reply("There was an error saving your application. Please try again.");
      console.error("Database error:", error);
    }
  } else {
    await ctx.reply("There was an internal error. Please try again later.");
    console.error("Bot instance not available");
  }
}