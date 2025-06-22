import { InlineKeyboard } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey, Request } from "../../utilities/session";

export const name: string = "delweb";
export const description: string = "Delete a webloader button.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  const message = await ctx.reply("⏳ Getting buttons...");

  const buttons = await Request({
    sellerkey: sellerKeyGet,
    type: "fetchallbuttons",
  });

  const keyboard = new InlineKeyboard();

  for (let i = 0; i < buttons.buttons.length; i++) {
    const button = buttons.buttons[i];
    
    keyboard.text(
      `${button.text} (${button.value})`,
      `webloader:del:${button.value}`
    );
    
    if (i < buttons.buttons.length - 1) {
      keyboard.row();
    }
  }

  if (buttons.buttons.length === 0) {
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
    "Which web loader button do you want to delete?",
    {
      reply_markup: keyboard,
    }
  )
};