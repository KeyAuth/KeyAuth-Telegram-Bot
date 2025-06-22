import { type Execute } from "../../interfaces/Command";
import { GetSellerKey } from "../../utilities/session";
import { Request } from "../../utilities/session";

export const name: string = "stats";
export const description: string = "Retrieve stats from an application.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  const response = await Request({
    sellerkey: sellerKeyGet,
    type: "stats",
  });

  if (!response.success) {
    await ctx.reply(`❌ Error: ${response.message}`);
    return;
  } else {
    const esc = (text: any) => {
      if (!text) return "";
      return text.toString().replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&");
    };

    let details = `*📊 Application Statistics:*\n\n`;
    
    // Key statistics
    details += `*🔑 License Keys:*\n`;
    details += `*Unused Keys:* ${esc(response.unused) || "0"}\n`;
    details += `*Used Keys:* ${esc(response.used) || "0"}\n`;
    details += `*Paused Keys:* ${esc(response.paused) || "0"}\n`;
    details += `*Banned Keys:* ${esc(response.banned) || "0"}\n`;
    details += `*Total Keys:* ${esc(response.totalkeys) || "0"}\n\n`;
    
    // Application assets
    details += `*🛠️ Application Assets:*\n`;
    details += `*Webhooks:* ${esc(response.webhooks) || "0"}\n`;
    details += `*Files:* ${esc(response.files) || "0"}\n`;
    details += `*Variables:* ${esc(response.vars) || "0"}\n\n`;
    
    // User management
    details += `*👥 User Management:*\n`;
    details += `*Resellers:* ${esc(response.resellers) || "0"}\n`;
    details += `*Managers:* ${esc(response.managers) || "0"}\n`;
    details += `*Total Accounts:* ${esc(response.totalaccs) || "0"}\n`;

    await ctx.reply(details, { parse_mode: "MarkdownV2" });
  }
};