import { Context, InlineKeyboard } from "grammy";
import { type Execute } from "../interfaces/Button";
import { GetSellerKey, Request } from "../utilities/session";

export const name: string = "logs";
export const cooldown: number = 0;
export const execute: Execute = async (ctx: Context, bot, args) => {
  await ctx.answerCallbackQuery();
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  if (!args || args.length === 0) {
    await ctx.reply("Error: No variable action provided.");
    return;
  }

  const type = args[0] as string;

  switch (type) {
    case "delall-confirm":
      await ctx.editMessageText(`⏳ Deleting all logs...`);

      const response = await Request({
        sellerkey: sellerKeyGet,
        type: "dellogs",
      });

      if (!response.success) {
        await ctx.editMessageText(`❌ Error: ${response.message}`);
        return;
      } else {
        await ctx.editMessageText(`✅ All logs deleted successfully.`);
      }
      break;

    case "delall-cancel":
      await ctx.editMessageText(`❌ Killing of all sessions has been cancelled.`);
      break;

    default:
      await ctx.editMessageText("❌ Invalid log action specified.");
      return;
  }
}