import { InlineKeyboard } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey } from "../../utilities/session";

export const name: string = "delallvars";
export const description: string = "Delete all global variables.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  const keyboard = new InlineKeyboard()
    .text("Confirm Deletion", `var:delall-confirm`)
    .text("Cancel", `var:delall-cancel`);

  await ctx.reply(`Are you sure you want to delete all variables?`, {
    reply_markup: keyboard,
  });
};