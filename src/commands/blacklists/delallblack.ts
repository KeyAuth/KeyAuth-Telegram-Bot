import { InlineKeyboard } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey } from "../../utilities/session";

export const name: string = "delallblack";
export const description: string = "Delete all blacklists.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  const keyboard = new InlineKeyboard()
    .text("Confirm Deletion", `blacklist:delall-confirm`)
    .text("Cancel", `blacklist:delall-cancel`);

  await ctx.reply(`Are you sure you want to delete all blacklists?`, {
    reply_markup: keyboard,
  });
};
