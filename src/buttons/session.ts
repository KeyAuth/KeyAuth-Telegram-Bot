import { Context, InlineKeyboard } from "grammy";
import { type Execute } from "../interfaces/Button";
import { GetSellerKey, Request } from "../utilities/session";

export const name: string = "session";
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
      await ctx.editMessageText(`⏳ Killing all sessions...`);

      const response = await Request({
        sellerkey: sellerKeyGet,
        type: "killall",
      });

      if (!response.success) {
        await ctx.editMessageText(`❌ Error: ${response.message}`);
        return;
      } else {
        await ctx.editMessageText(`✅ All sessions killed successfully.`);
      }
      break;

    case "delall-cancel":
      await ctx.editMessageText(`❌ Killing of all sessions has been cancelled.`);
      break;

    // Delete variable
    case "del":
      const keyboard = new InlineKeyboard()
        .text("Confirm Deletion", `session:del-confirm:${data}`)
        .text("Cancel", `session:del-cancel:${data}`);

      await ctx.editMessageText(
        `Are you sure you want to kill the session: ${data}?`,
        { reply_markup: keyboard }
      );
      break;

    case "del-confirm":
      await ctx.editMessageText("⏳ Killing session...");
      const delResponse = await Request({
        sellerkey: sellerKeyGet,
        type: "kill",
        sessid: data,
      });

      if (!delResponse.success) {
        await ctx.editMessageText(`❌ Error: ${delResponse.message}`);
        return;
      } else {
        await ctx.editMessageText(`✅ Session killed successfully.`);
      }
      break;

    case "del-cancel":
      await ctx.editMessageText(`❌ Killing of session has been cancelled.`);
      break;

    default:
      await ctx.editMessageText("❌ Invalid session action specified.");
      return;
  }
}