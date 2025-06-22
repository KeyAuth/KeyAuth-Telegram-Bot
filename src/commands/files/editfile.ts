import { InlineKeyboard } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey, Request } from "../../utilities/session";

export const name: string = "editfile";
export const description: string = "Edit an existing file on an application.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  const message = await ctx.reply("⏳ Getting files...");

  const files = await Request({
    sellerkey: sellerKeyGet,
    type: "fetchallfiles",
  });

  const keyboard = new InlineKeyboard();

  for (let i = 0; i < files.files.length; i++) {
    const file = files.files[i];
    const truncatedUrl = file.url.length > 20 ? file.url.substring(0, 20) + '...' : file.url;
    
    keyboard.text(
      `ID: ${file.id} (${truncatedUrl})`,
      `file:edit:${file.id}`
    );
    
    if (i < files.files.length - 1) {
      keyboard.row();
    }
  }

  if (files.files.length === 0) {
    await ctx.api.editMessageText(
      message.chat.id,
      message.message_id,
      "❌ No files found.",
    )
    return;
  }

  await ctx.api.editMessageText(
    message.chat.id,
    message.message_id,
    "Which file do you want to edit?",
    {
      reply_markup: keyboard,
    }
  )
};