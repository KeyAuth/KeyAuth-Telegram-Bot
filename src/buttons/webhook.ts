import { Context, InlineKeyboard } from "grammy";
import { type Execute } from "../interfaces/Button";
import { GetSellerKey, Request } from "../utilities/session";

export const name: string = "webhook";
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
      await ctx.editMessageText(`⏳ Deleting all webhooks...`);

      const response = await Request({
        sellerkey: sellerKeyGet,
        type: "delallwebhooks",
      });

      if (!response.success) {
        await ctx.editMessageText(`❌ Error: ${response.message}`);
        return;
      } else {
        await ctx.editMessageText(`✅ All webhooks deleted successfully.`);
      }
      break;

    case "delall-cancel":
      await ctx.editMessageText(`❌ Deletion of all webhooks has been cancelled.`);
      break;

    // Delete webhook
    case "del":
      const keyboard = new InlineKeyboard()
        .text("Confirm Deletion", `webhook:del-confirm:${data}`)
        .text("Cancel", `webhook:del-cancel:${data}`);

      await ctx.editMessageText(
        `Are you sure you want to delete the webhook: ${data}?`,
        { reply_markup: keyboard }
      );
      break;

    case "del-confirm":
      await ctx.editMessageText("⏳ Deleting webhook...");
      const delResponse = await Request({
        sellerkey: sellerKeyGet,
        type: "delwebhook",
        webid: data,
      });

      if (!delResponse.success) {
        await ctx.editMessageText(`❌ Error: ${delResponse.message}`);
        return;
      } else {
        await ctx.editMessageText(`✅ Webhook deleted successfully.`);
      }
      break;

    case "del-cancel":
      await ctx.editMessageText(`❌ Deletion of Webhook has been cancelled.`);
      break;
    default:
      await ctx.editMessageText("❌ Invalid Webhook action specified.");
      break;
  }
};