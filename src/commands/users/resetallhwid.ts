import { InlineKeyboard } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey } from "../../utilities/session";

export const name: string = "resetallhwid";
export const description: string = "Reset all users hwid.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  const keyboard = new InlineKeyboard()
    .text("Confirm", `user:resetallhwid-confirm`)
    .text("Cancel", `user:resetallhwid-cancel`);

  await ctx.reply(`Are you sure you want to reset ALL users hwid?`, {
    reply_markup: keyboard,
  });
};