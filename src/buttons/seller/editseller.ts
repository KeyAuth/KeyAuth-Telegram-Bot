import { Context } from "grammy";
import { type Execute } from "../../interfaces/Button";
import { Request } from "../../utilities/session";
import { stateManager } from "../../utilities/state";
import TelegramBot from "../../utilities/bot";

let data = {
  sellerkey: ""
}

let botInstance: TelegramBot | null = null;

export const name: string = "editseller";
export const cooldown: number = 20;
export const execute: Execute = async (ctx: Context, bot, args) => {
  await ctx.answerCallbackQuery();

  if (!args || args.length === 0) {
    await ctx.reply("Error: No seller key provided.");
    return;
  }
  
  const sellerKey = args[0];
  const userId = ctx.from?.id;
  data.sellerkey = sellerKey as string;
  botInstance = bot;

  if (!sellerKey || !userId) {
    await ctx.reply("Error: Could not identify the application or user.");
    return;
  }

  await ctx.reply("What would you like to rename your application to?")

  if (ctx.from && ctx.from.id) {
    stateManager.setWaitingForResponse(
      ctx.from.id,
      "edit_seller",
      handleNewAppName
    );
  } else {
    await ctx.reply("Sorry, I couldn't identify you. Please try again later.");
  }
}

async function handleNewAppName(ctx: Context): Promise<void> {
  const newName = ctx.message?.text;
  const userId = ctx.from?.id;

  if (newName && userId) {
    const response = await Request({ sellerkey: data.sellerkey, type: "appdetails" });

    if (!response.success) {
      await ctx.reply(`❌ Error: ${response.message}`);
      return;
    } else {
      if (!botInstance) {
        await ctx.reply("Error: Bot instance is not initialized");
        return;
      }
      
      await botInstance.database.set(`applications.${userId}.${data.sellerkey}.name`, newName);

      await ctx.reply(`Your application has been renamed to: ${newName}`);
    }
  } else {
    await ctx.reply("Error: Could not process your request. Please try again.");
  }
}