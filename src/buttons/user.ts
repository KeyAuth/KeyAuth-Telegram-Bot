import { Context, InlineKeyboard } from "grammy";
import { type Execute } from "../interfaces/Button";
import { GetSellerKey, Request } from "../utilities/session";

export const name: string = "user";
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
  const data = args[1] as string;

  switch (type) {
    case "delall-confirm":
      await ctx.editMessageText(`⏳ Deleting all users...`);

      const response = await Request({
        sellerkey: sellerKeyGet,
        type: "delallusers",
      });

      if (!response.success) {
        await ctx.editMessageText(`❌ Error: ${response.message}`);
        return;
      } else {
        await ctx.editMessageText(`✅ All users deleted successfully.`);
      }
      break;

    case "delall-cancel":
      await ctx.editMessageText(`❌ Deletion of all users has been cancelled.`);
      break;

    case "delallexp-confirm":
      await ctx.editMessageText(`⏳ Deleting all users...`);

      const expRes = await Request({
        sellerkey: sellerKeyGet,
        type: "delallusers",
      });

      if (!expRes.success) {
        await ctx.editMessageText(`❌ Error: ${expRes.message}`);
        return;
      } else {
        await ctx.editMessageText(`✅ All expired users deleted successfully.`);
      }
      break;

    case "delallexp-cancel":
      await ctx.editMessageText(`❌ Deletion of all expired users has been cancelled.`);
      break;

    // RESET HWID
    case "resetallhwid-confirm":
      await ctx.editMessageText(`⏳ Deleting all users...`);

      const resetRes = await Request({
        sellerkey: sellerKeyGet,
        type: "resetalluser",
      });

      if (!resetRes.success) {
        await ctx.editMessageText(`❌ Error: ${resetRes.message}`);
        return;
      } else {
        await ctx.editMessageText(`✅ All users hwid reset successfully.`);
      }
      break;

    case "resetallhwid-cancel":
      await ctx.editMessageText(`❌ HWID reset of all users has been cancelled.`);
      break;

    default:
      await ctx.editMessageText("❌ Invalid users action specified.");
      break;
  }
}