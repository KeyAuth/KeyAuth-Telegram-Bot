import { type Execute } from "../../interfaces/Command";
import { GetSellerKey } from "../../utilities/session";
import { Request } from "../../utilities/session";

export const name: string = "appdetails";
export const description: string = "Retrieve the information from an application";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  const response = await Request({
    sellerkey: sellerKeyGet,
    type: "appdetails",
  });

  if (!response.success) {
    await ctx.reply(`❌ Error: ${response.message}`);
    return;
  } else {
    const esc = (text: any) => {
      if (!text) return "";
      return text.toString().replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&");
    };

    let details = `*📱 Application Details:*\n\n`;
    details += `*Name:* ${esc(response.appdetails.name)}\n`;
    details += `*OwnerID:* ${esc(response.appdetails.ownerid)}\n`;
    details += `*Secret:* ${esc(response.appdetails.secret)}\n`;
    details += `*Version:* ${esc(response.appdetails.version)}\n`;

    await ctx.reply(details, { parse_mode: "MarkdownV2" });
  }
};