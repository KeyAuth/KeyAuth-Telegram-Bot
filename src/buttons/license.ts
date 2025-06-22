import { Context, InlineKeyboard } from "grammy";
import { type Execute } from "../interfaces/Button";
import { GetSellerKey, Request } from "../utilities/session";
import { stateManager } from "../utilities/state";

export const name: string = "license";
export const cooldown: number = 0;
export const execute: Execute = async (ctx: Context, bot, args) => {
  await ctx.answerCallbackQuery();
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  if (!args || args.length === 0) {
    await ctx.reply("Error: No blacklist type provided.");
    return;
  }

  const type = args[0] as string;
  const data = args[1] as string;

  switch (type) {
    // Delete all licenses
    case "delall-confirm":
      await ctx.editMessageText(`⏳ Deleting all licenses...`);

      const response = await Request({
        sellerkey: sellerKeyGet,
        type: "delalllicenses",
      });

      if (!response.success) {
        await ctx.editMessageText(`❌ Error: ${response.message}`);
        return;
      } else {
        await ctx.editMessageText(`✅ All licenses deleted successfully.`);
      }
      break;

    case "delall-cancel":
      await ctx.editMessageText(
        `❌ Deletion of all licenses has been cancelled.`
      );
      break;

    case "delallunused-confirm":
      await ctx.editMessageText(`⏳ Deleting all UNUSED licenses...`);

      const unusedRes = await Request({
        sellerkey: sellerKeyGet,
        type: "delalllicenses",
      });

      if (!unusedRes.success) {
        await ctx.editMessageText(`❌ Error: ${unusedRes.message}`);
        return;
      } else {
        await ctx.editMessageText(
          `✅ All UNUSED licenses deleted successfully.`
        );
      }
      break;

    case "delallunused-cancel":
      await ctx.editMessageText(
        `❌ Deletion of all UNUSED licenses has been cancelled.`
      );
      break;

    case "delallused-confirm":
      await ctx.editMessageText(`⏳ Deleting all USED licenses...`);

      const usedRes = await Request({
        sellerkey: sellerKeyGet,
        type: "delalllicenses",
      });

      if (!usedRes.success) {
        await ctx.editMessageText(`❌ Error: ${usedRes.message}`);
        return;
      } else {
        await ctx.editMessageText(`✅ All USED licenses deleted successfully.`);
      }
      break;

    case "delallused-cancel":
      await ctx.editMessageText(
        `❌ Deletion of all USED licenses has been cancelled.`
      );
      break;

    default:
      await ctx.editMessageText("❌ Invalid license action specified.");
      break;
  }
};
