import { InlineKeyboard } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey } from "../../utilities/session";

export const name: string = "delallused";
export const description: string = "Delete all used licenses.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  const keyboard = new InlineKeyboard()
    .text("Confirm Deletion", `license:delallused-confirm`)
    .text("Cancel", `license:delallused-cancel`);

  await ctx.reply(`Are you sure you want to delete all USED licenses?`, {
    reply_markup: keyboard,
  });
};