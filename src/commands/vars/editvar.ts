import { InlineKeyboard } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey, Request } from "../../utilities/session";

export const name: string = "editvar";
export const description: string = "Edit an existing global variable.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  const message = await ctx.reply("⏳ Getting variables...");

  const vars = await Request({
    sellerkey: sellerKeyGet,
    type: "fetchallvars",
  });

  const keyboard = new InlineKeyboard();

  for (let i = 0; i < vars.vars.length; i++) {
    const file = vars.vars[i];
    
    keyboard.text(
      `Name: ${file.varid} | Authed: ${file.authed === 1 ? "Yes" : "No"} | Data: ${file.msg}`,
      `var:edit:${file.varid}`
    );
    
    if (i < vars.vars.length - 1) {
      keyboard.row();
    }
  }

  if (vars.vars.length === 0) {
    await ctx.api.editMessageText(
      message.chat.id,
      message.message_id,
      "❌ No variables found.",
    )
    return;
  }

  await ctx.api.editMessageText(
    message.chat.id,
    message.message_id,
    "Which variable do you want to edit?",
    {
      reply_markup: keyboard,
    }
  )
};