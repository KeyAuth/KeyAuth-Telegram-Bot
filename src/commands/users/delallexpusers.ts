import { InlineKeyboard } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey } from "../../utilities/session";

export const name: string = "delallexpusers";
export const description: string = "Delete all users that are expired.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  const keyboard = new InlineKeyboard()
    .text("Confirm Deletion", `user:delallexp-confirm`)
    .text("Cancel", `user:delallexp-cancel`);

  await ctx.reply(`Are you sure you want to delete all EXPIRED users?`, {
    reply_markup: keyboard,
  });
};