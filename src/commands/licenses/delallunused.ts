import { InlineKeyboard } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey } from "../../utilities/session";

export const name: string = "delallunused";
export const description: string = "Delete all unused licenses.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  const keyboard = new InlineKeyboard()
    .text("Confirm Deletion", `license:delallunused-confirm`)
    .text("Cancel", `license:delallunused-cancel`);

  await ctx.reply(`Are you sure you want to delete all UN-USED licenses?`, {
    reply_markup: keyboard,
  });
};