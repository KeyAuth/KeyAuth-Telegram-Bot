import { InlineKeyboard } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey, Request } from "../../utilities/session";

export const name: string = "delwebhook";
export const description: string = "Delete a webhook.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  const message = await ctx.reply("⏳ Getting webhooks...");

  const webhooks = await Request({
    sellerkey: sellerKeyGet,
    type: "fetchallwebhooks",
  });

  const keyboard = new InlineKeyboard();

  for (let i = 0; i < webhooks.webhooks.length; i++) {
    const webhook = webhooks.webhooks[i];
    
    keyboard.text(
      `ID: ${webhook.webid} | URL: ${webhook.short_baselink.substring(0, 20)} |  Authed: ${webhook.authed === 1 ? "Yes" : "No"}`,
      `webhook:del:${webhook.webid}`
    );
    
    if (i < webhooks.webhooks.length - 1) {
      keyboard.row();
    }
  }

  if (webhooks.webhooks.length === 0) {
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
    "Which webhook do you want to delete?",
    {
      reply_markup: keyboard,
    }
  )
};