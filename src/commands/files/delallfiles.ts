import { InlineKeyboard } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey } from "../../utilities/session";

export const name: string = "delallfiles";
export const description: string = "Delete an existing file.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  const keyboard = new InlineKeyboard()
    .text("Confirm Deletion", `file:delall-confirm`)
    .text("Cancel", `file:delall-cancel`);

  await ctx.reply(`Are you sure you want to delete all files?`, {
    reply_markup: keyboard,
  });
};