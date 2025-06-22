import { type Execute } from "../../interfaces/Command";
import { GetSellerKey, Request } from "../../utilities/session";

export const name: string = "getlogs";
export const description: string = "Retrieve all logs sent by using the .log function.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  const response = await Request({
    sellerkey: sellerKeyGet,
    type: "fetchalllogs"
  }) 

  console.log(response)

  if (!response.success || !response.logs) {
    await ctx.reply(`❌ Error: ${response.message}`)
    return;
  }

  const esc = (text: any) => {
    if (!text) return "";
    return text.toString().replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&");
  };

  let details = `*${esc("Logs")}*\n\n`;

  for (const file of response.logs) {
    details += `• ID: ${esc(file.id)} \\\n`;
    details += `  Message: ${esc(file.logdata)} \\\n`;
    details += `  Credentials: ${esc(file.credential || "Not logged in")} \\\n`;
    details += `  PC User: ${esc(file.pcuser || "No user logged")} \\\n`;
  }

  await ctx.reply(details, {
    parse_mode: "MarkdownV2",
  });
}