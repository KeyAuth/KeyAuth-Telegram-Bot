import { InlineKeyboard } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey } from "../../utilities/session";

export const name: string = "delallusers";
export const description: string = "Delete all users.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  const keyboard = new InlineKeyboard()
    .text("Confirm Deletion", `user:delall-confirm`)
    .text("Cancel", `user:delall-cancel`);

  await ctx.reply(`Are you sure you want to delete ALL users?`, {
    reply_markup: keyboard,
  });
};