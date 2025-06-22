import { InlineKeyboard } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey } from "../../utilities/session";

export const name: string = "delalllogs";
export const description: string = "Delete all logs sent by using the .log function.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  const keyboard = new InlineKeyboard()
    .text("Confirm Deletion", `logs:delall-confirm`)
    .text("Cancel", `logs:delall-cancel`);

  await ctx.reply(`Are you sure you want to delete all logs?`, {
    reply_markup: keyboard,
  });
};