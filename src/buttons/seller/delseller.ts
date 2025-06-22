import { Context, InlineKeyboard } from "grammy";
import { type Execute } from "../../interfaces/Button";

export const name: string = "delseller";
export const cooldown: number = 0;
export const execute: Execute = async (ctx: Context, bot, args) => {
  if (!args || args.length === 0) {
    await ctx.reply("Error: No seller key provided.");
    return;
  }

  const sellerKey = args[0];
  const userId = ctx.from?.id;

  const decision = args[1] as string;

  switch (decision) {
    case "confirm":
      if (!sellerKey || !userId) {
        await ctx.reply("Error: Could not identify the application or user.");
        return;
      }

      if (!bot) {
        await ctx.reply("Error: Bot instance is not initialized");
        return;
      }
      
      const currentApp = await bot.database.get(`selectedapp.${userId}`);
      
      if (currentApp === sellerKey) {
        await bot.database.delete(`selectedapp.${userId}`);
      }
      
      const applications = await bot.database.get(`applications.${userId}`) || [];
      const updatedApps = applications.filter((app: {sellerkey: string}) => app.sellerkey !== sellerKey);
      
      await bot.database.set(`applications.${userId}`, updatedApps);
      
      await ctx.reply("Application deleted successfully." + 
        (currentApp === sellerKey ? " It was your selected application, so none is currently selected." : ""));
      break;

    case "cancel":
      await ctx.reply("Deletion cancelled.");
      break;

    default:
      const keyboard = new InlineKeyboard()
        .text("Confirm Deletion", `deleteseller:${sellerKey}:confirm`)
        .text("Cancel", `deleteseller:${sellerKey}:cancel`);

      await ctx.reply("Are you sure you want to delete this application? This action cannot be undone.", {
        reply_markup: keyboard,
      });
      return;
  }
}