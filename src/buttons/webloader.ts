import { Context, InlineKeyboard } from "grammy";
import { type Execute } from "../interfaces/Button";
import { GetSellerKey, Request } from "../utilities/session";

export const name: string = "webloader";
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
      await ctx.editMessageText(`⏳ Deleting all web loader buttons...`);

      const response = await Request({
        sellerkey: sellerKeyGet,
        type: "delAllButtons",
      });

      if (!response.success) {
        await ctx.editMessageText(`❌ Error: ${response.message}`);
        return;
      } else {
        await ctx.editMessageText(`✅ All webloader buttons deleted successfully.`);
      }
      break;

    case "delall-cancel":
      await ctx.editMessageText(`❌ Deletion of all webloader buttons has been cancelled.`);
      break;

    // Delete webloader button
    case "del":
      const keyboard = new InlineKeyboard()
        .text("Confirm Deletion", `webloader:del-confirm:${data}`)
        .text("Cancel", `webloader:del-cancel:${data}`);

      await ctx.editMessageText(
        `Are you sure you want to delete the webloader button: ${data}?`,
        { reply_markup: keyboard }
      );
      break;

    case "del-confirm":
      await ctx.editMessageText("⏳ Deleting webloader button...");
      const delResponse = await Request({
        sellerkey: sellerKeyGet,
        type: "delbutton",
        value: data,
      });

      if (!delResponse.success) {
        await ctx.editMessageText(`❌ Error: ${delResponse.message}`);
        return;
      } else {
        await ctx.editMessageText(`✅ Webloader button deleted successfully.`);
      }
      break;

    case "del-cancel":
      await ctx.editMessageText(`❌ Deletion of webloader button has been cancelled.`);
      break;
    default:
      await ctx.editMessageText("❌ Invalid webloader button action specified.");
      break;
  }
};