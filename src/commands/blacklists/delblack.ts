import { InlineKeyboard } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey, Request } from "../../utilities/session";

export const name: string = "delblack";
export const description: string = "Delete a blacklist entry.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  const message = await ctx.reply("⏳ Getting blacklists...");

  const blacklists = await Request({
    sellerkey: sellerKeyGet,
    type: "fetchallblacks",
  });

  const keyboard = new InlineKeyboard();

  if (!blacklists.blacklists || blacklists.blacklists.length === 0) {
    await ctx.api.editMessageText(
      message.chat.id,
      message.message_id,
      "❌ No blacklists found.",
    );
    return;
  }

  for (let i = 0; i < blacklists.blacklists.length; i++) {
    const blacklist = blacklists.blacklists[i];
    
    keyboard.text(
      `${blacklist.type}: ${blacklist.data} | Reason: ${blacklist.reason.substring(0, 20)}${blacklist.reason.length > 20 ? '...' : ''}`,
      `blacklist:del:${blacklist.type}:${blacklist.data}`
    );
    
    if (i < blacklists.blacklists.length - 1) {
      keyboard.row();
    }
  }

  await ctx.api.editMessageText(
    message.chat.id,
    message.message_id,
    "Which blacklist entry do you want to delete?",
    {
      reply_markup: keyboard,
    }
  );
};
