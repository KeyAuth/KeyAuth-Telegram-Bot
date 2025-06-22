import { Context } from "grammy";
import { type Execute } from "../../interfaces/Button";
import { Request } from "../../utilities/session";

export const name: string = "setseller";
export const cooldown: number = 20;
export const execute: Execute = async (ctx: Context, bot, args) => {
  await ctx.answerCallbackQuery();

  if (!args || args.length === 0) {
    await ctx.reply("Error: No seller key provided.");
    return;
  }
  
  const sellerKey = args[0];
  const userId = ctx.from?.id;
  
  if (!sellerKey || !userId) {
    await ctx.reply("Error: Could not identify the application or user.");
    return;
  }
  
  const loadingMessage = await ctx.reply("⏳ Loading application details...");
  
  try {
    await ctx.api.editMessageText(
      loadingMessage.chat.id,
      loadingMessage.message_id,
      "⏳ Validating seller key..."
    );
    
    const response = await Request({ sellerkey: sellerKey, type: "appdetails" });
    
    if (!response.success) {
      await ctx.api.editMessageText(
        loadingMessage.chat.id,
        loadingMessage.message_id,
        `❌ Error: ${response.message}`
      );
      return;
    }
    
    await ctx.api.editMessageText(
      loadingMessage.chat.id,
      loadingMessage.message_id,
      "⏳ Setting as active application..."
    );
    
    await bot.database.set(`selectedapp.${userId}`, sellerKey);
    
    await ctx.api.editMessageText(
      loadingMessage.chat.id,
      loadingMessage.message_id,
      "⏳ Retrieving application information..."
    );
    
    const applications = await bot.database.get(`applications.${userId}`) || [];
    const selectedApp = applications.find((app: { sellerkey: string }) => app.sellerkey === sellerKey);
    const appName = selectedApp ? selectedApp.name : "Unknown";
    
    await ctx.api.editMessageText(
      loadingMessage.chat.id,
      loadingMessage.message_id,
      `✅ Successfully selected application: ${appName}\n\nYou can now use commands that require a seller key.`
    );
  } catch (error) {
    console.error("Error in setseller button:", error);
    
    await ctx.api.editMessageText(
      loadingMessage.chat.id,
      loadingMessage.message_id,
      "❌ An error occurred while selecting the application. Please try again."
    );
  }
};