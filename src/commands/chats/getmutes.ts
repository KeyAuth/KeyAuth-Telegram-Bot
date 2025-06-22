import { type Execute } from "../../interfaces/Command";
import { GetSellerKey, Request } from "../../utilities/session";

export const name: string = "getmutes";
export const description: string = "Retrieve all users that are currently muted on the chat.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  const response = await Request({
    sellerkey: sellerKeyGet,
    type: "fetchallmutes"
  }) 

  if (!response.success || !response.mutes) {
    await ctx.reply(`❌ Error: ${response.message}`)
    return;
  }

  const esc = (text: any) => {
    if (!text) return "";
    return text.toString().replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&");
  };

  let details = `*${esc("Muted Users")}*\n\n`;

  for (const mute of response.mutes) {
    details += `• ${esc(mute.user)} ${esc(`(${mute.time})`)}\\\n`
  }

  await ctx.reply(details, {
    parse_mode: "MarkdownV2",
  });
}