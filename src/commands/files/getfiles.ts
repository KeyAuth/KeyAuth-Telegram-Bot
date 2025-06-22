import { type Execute } from "../../interfaces/Command";
import { GetSellerKey, Request } from "../../utilities/session";

export const name: string = "getfiles";
export const description: string = "Retrieve all existing files on an application.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  const response = await Request({
    sellerkey: sellerKeyGet,
    type: "fetchallfiles"
  }) 

  if (!response.success || !response.files) {
    await ctx.reply(`❌ Error: ${response.message}`)
    return;
  }

  const esc = (text: any) => {
    if (!text) return "";
    return text.toString().replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&");
  };

  let details = `*${esc("Files")}*\n\n`;

  for (const file of response.files) {
    details += `• ID: ${esc(file.id)} \\\nURL: ${esc(`${file.url}`)}\\\n\n`
  }

  await ctx.reply(details, {
    parse_mode: "MarkdownV2",
  });
}