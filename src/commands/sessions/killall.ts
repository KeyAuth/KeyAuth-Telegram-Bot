import { InlineKeyboard } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey } from "../../utilities/session";

export const name: string = "killall";
export const description: string = "End all sessions. This will log everyone out of the application and require them to login again to access the application.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  const keyboard = new InlineKeyboard()
    .text("Confirm", `session:delall-confirm`)
    .text("Cancel", `session:delall-cancel`);

  await ctx.reply(`Are you sure you want to kill all sessions?`, {
    reply_markup: keyboard,
  });
};