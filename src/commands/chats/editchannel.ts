import { InlineKeyboard } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey, Request } from "../../utilities/session";

export const name: string = "editchannel";
export const description: string = "Delete an existing chat channel. This will also delete all messages in this channel.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  const message = await ctx.reply("⏳ Getting channels...");

  const channels = await Request({
    sellerkey: sellerKeyGet,
    type: "fetchallchats",
  });

  const keyboard = new InlineKeyboard();

  for (let i = 0; i < channels.chats.length; i += 3) {
    const channel1 = channels.chats[i];
    const channel2 = i + 1 < channels.chats.length ? channels.chats[i + 1] : null;
    const channel3 = i + 2 < channels.chats.length ? channels.chats[i + 2] : null;

    keyboard.text(
      `${channel1.name} (${channel1.delay} delay)`,
      `channel:edit:${channel1.name}`
    );
    
    if (channel2) {
      keyboard.text(
        `${channel2.name} (${channel2.delay} delay)`,
        `channel:edit:${channel2.name}`
      );
    }
    
    if (channel3) {
      keyboard.text(
        `${channel3.name} (${channel3.delay} delay)`,
        `channel:edit:${channel3.name}`
      );
    }

    if (i + 3 < channels.chats.length) {
      keyboard.row();
    }
  }

  if (channels.chats.length === 0) {
    await ctx.api.editMessageText(
      message.chat.id,
      message.message_id,
      "❌ No channels found.",
    )
    return;
  }

  await ctx.api.editMessageText(
    message.chat.id,
    message.message_id,
    "Which channel do you want to edit?",
    {
      reply_markup: keyboard,
    }
  )
};