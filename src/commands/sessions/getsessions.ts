import { type Execute } from "../../interfaces/Command";
import { GetSellerKey, Request } from "../../utilities/session";

export const name: string = "getsessions";
export const description: string = "Retrieve all active sessions.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  const response = await Request({
    sellerkey: sellerKeyGet,
    type: "fetchallsessions"
  }) 

  if (!response.success || !response.sessions) {
    await ctx.reply(`❌ Error: ${response.message}`)
    return;
  }

  const esc = (text: any) => {
    if (!text) return "";
    return text.toString().replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&");
  };

  let details = `*${esc("Active Sessions")}*\n\n`;

  for (const file of response.sessions) {
    details += `• ID: ${esc(file.id)} \\\n`;
    details += `  Credentials: ${esc(file.credential || "Not logged in")} \\\n`;
    details += `  IP: ${esc(file.ip)} \\\n`;
    
    let expiryFormatted = "Unknown";
    if (file.expiry) {
      try {
        const expiryDate = new Date(parseInt(file.expiry) * 1000);
        expiryFormatted = expiryDate.toLocaleString();
      } catch (e) {
        expiryFormatted = file.expiry;
      }
    }
    
    details += `  Expiry: ${esc(expiryFormatted)} \\\n\n`;
  }

  await ctx.reply(details, {
    parse_mode: "MarkdownV2",
  });
}