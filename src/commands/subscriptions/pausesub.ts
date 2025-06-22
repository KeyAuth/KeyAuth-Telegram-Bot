import { InlineKeyboard } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey, Request } from "../../utilities/session";

export const name: string = "pausesub";
export const description: string = "Pause a subscription, preventing users with this subscription to access the application.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  const message = await ctx.reply("⏳ Getting subscriptions...");

  const subs = await Request({
    sellerkey: sellerKeyGet,
    type: "fetchallsubs",
  });

  const keyboard = new InlineKeyboard();

  for (let i = 0; i < subs.subs.length; i++) {
    const sub = subs.subs[i];

    keyboard.text(`${sub.name} (${sub.level})`, `sub:pause:${sub.name}`);
    
    if (i % 2 === 1 || i === subs.subs.length - 1) {
      keyboard.row();
    }
  }

  if (subs.subs.length === 0) {
    await ctx.api.editMessageText(
      message.chat.id,
      message.message_id,
      "❌ No subscriptions found.",
    )
    return;
  }

  await ctx.api.editMessageText(
    message.chat.id,
    message.message_id,
    "Which subscription do you want to pause or unpause?",
    {
      reply_markup: keyboard,
    }
  )
};