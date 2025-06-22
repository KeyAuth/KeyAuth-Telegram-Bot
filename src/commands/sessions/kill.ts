import { InlineKeyboard } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey, Request } from "../../utilities/session";

export const name: string = "kill";
export const description: string = "End an active session. This will log the user out and require them to login again to access the application.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  const message = await ctx.reply("⏳ Getting sessions...");

  const sessions = await Request({
    sellerkey: sellerKeyGet,
    type: "fetchallsessions",
  });

  const keyboard = new InlineKeyboard();

  for (let i = 0; i < sessions.sessions.length; i++) {
    const session = sessions.sessions[i];

    keyboard.text(`ID: ${session.id} (${session.credential || "Not logged in"})`, `session:del:${session.id}`);
    
    if (i % 2 === 1 || i === sessions.sessions.length - 1) {
      keyboard.row();
    }
  }

  if (sessions.sessions.length === 0) {
    await ctx.api.editMessageText(
      message.chat.id,
      message.message_id,
      "❌ No sessions found.",
    )
    return;
  }

  await ctx.api.editMessageText(
    message.chat.id,
    message.message_id,
    "Which session do you want to kill?",
    {
      reply_markup: keyboard,
    }
  )
};