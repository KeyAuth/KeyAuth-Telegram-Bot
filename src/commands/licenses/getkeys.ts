import { InputFile } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey, Request } from "../../utilities/session";

export const name: string = "getkeys";
export const description: string = "Get all of your license keys.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  const message = await ctx.reply("⏳ Getting license keys...");

  const response = await Request({
    sellerkey: sellerKeyGet,
    type: "fetchallkeys",
  });

  if (!response.success) {
    await ctx.api.editMessageText(
      message.chat.id,
      message.message_id,
      `❌ Error: ${response.message}`
    );
    return;
  }

  if (!response.keys || response.keys.length === 0) {
    await ctx.api.editMessageText(
      message.chat.id,
      message.message_id,
      "❌ No license keys found."
    );
    return;
  }

  const jsonData = JSON.stringify(response.keys, null, 2);
  const fileName = `license_keys_${Date.now()}.json`;

  try {
    await ctx.api.editMessageText(
      message.chat.id,
      message.message_id,
      `✅ Found ${response.keys.length} license keys. Sending as JSON file...`
    );

    await ctx.replyWithDocument(
      new InputFile(Buffer.from(jsonData, 'utf-8'), fileName),
      {
        caption: `📄 License Keys JSON - ${response.keys.length} keys total`
      }
    );

  } catch (error) {
    console.error(error);
    await ctx.api.editMessageText(
      message.chat.id,
      message.message_id,
      "❌ Failed to send JSON file. Please try again."
    );
  }
};