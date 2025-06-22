import { type Execute } from "../../interfaces/Command";
import { GetSellerKey } from "../../utilities/session";
import { Request } from "../../utilities/session";

export const name: string = "appsettings";
export const description: string = "Retrieve the current application settings.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  const response = await Request({
    sellerkey: sellerKeyGet,
    type: "getsettings",
  });

  if (!response.success) {
    await ctx.reply(`❌ Error: ${response.message}`);
    return;
  } else {
    const esc = (text: any) => {
      if (!text) return "";
      return text.toString().replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&");
    };

    let details = `*📱 Application Settings*\n\n`;
    
    // Function settings section
    details += `*📊 Functions:*\n`;
    details += `*Status:* ${response.functions.enabled ? "✅ Enabled" : "❌ Disabled"}\n`;
    details += `*Paused:* ${response.functions.paused ? "✅ Yes" : "❌ No"}\n`;
    details += `*HWID Lock:* ${response.functions["hwid-lock"] ? "✅ Enabled" : "❌ Disabled"}\n`;
    details += `*VPN Block:* ${response.functions.vpnblock ? "✅ Enabled" : "❌ Disabled"}\n`;
    details += `*IP Logging:* ${response.functions.ipLogging ? "✅ Enabled" : "❌ Disabled"}\n`;
    details += `*Version:* ${esc(response.functions.version) || "Not set"}\n`;
    details += `*Download URL:* ${esc(response.functions.download) || "Not set"}\n`;
    details += `*Web Download URL:* ${esc(response.functions.webdownload) || "Not set"}\n`;
    details += `*Webhook URL:* ${esc(response.functions.webhook) || "Not set"}\n`;
    details += `*Reseller Store URL:* ${esc(response.functions.resellerstore) || "Not set"}\n`;
    details += `*Sellix Secret:* ${response.functions.sellixsecret ? "Set" : "Not set"}\n`;
    details += `*Cooldown:* ${response.functions.cooldown ? `${parseInt(response.functions.cooldown) / 86400} days` : "Not set"}\n`;
    details += `*Hash:* ${esc(response.functions.hash) || "Not set"}\n\n`;
    
    // Custom messages section
    details += `*📝 Custom Messages:*\n`;
    details += `• *Disabled:* ${esc(response.messages.disabledmsg) || "Default"}\n`;
    details += `• *Username Taken:* ${esc(response.messages.usernametakenmsg) || "Default"}\n`;
    details += `• *License Invalid:* ${esc(response.messages.licenseinvalidmsg) || "Default"}\n`;
    details += `• *Key Taken:* ${esc(response.messages.keytakenmsg) || "Default"}\n`;
    details += `• *No Subscription:* ${esc(response.messages.nosubmsg) || "Default"}\n`;
    details += `• *User Invalid:* ${esc(response.messages.userinvalidmsg) || "Default"}\n`;
    details += `• *Password Invalid:* ${esc(response.messages.passinvalidmsg) || "Default"}\n`;
    details += `• *HWID Mismatch:* ${esc(response.messages.hwidmismatchmsg) || "Default"}\n`;
    details += `• *No Active Subscription:* ${esc(response.messages.noactivesubmsg) || "Default"}\n`;
    details += `• *Blacklisted:* ${esc(response.messages.blackedmsg) || "Default"}\n`;
    details += `• *Key Banned:* ${esc(response.messages.keybanned) || "Default"}\n`;
    details += `• *User Banned:* ${esc(response.messages.userbanned) || "Default"}\n`;
    details += `• *Session Unauthorized:* ${esc(response.messages.sessionunauthed) || "Default"}\n`;
    details += `• *Hash Check Fail:* ${esc(response.messages.hashcheckfail) || "Default"}\n`;
    details += `• *Logged In:* ${esc(response.messages.loggedInMsg) || "Default"}\n`;
    details += `• *Paused App:* ${esc(response.messages.pausedApp) || "Default"}\n`;
    details += `• *Username Too Short:* ${esc(response.messages.unTooShort) || "Default"}\n`;
    details += `• *Password Leaked:* ${esc(response.messages.pwLeaked) || "Default"}\n`;
    details += `• *Paused Subscription:* ${esc(response.messages.pausedsub) || "Default"}\n`;
    details += `• *Chat Hit Delay:* ${esc(response.messages.chatHitDelay) || "Default"}\n`;

    await ctx.reply(details, { parse_mode: "MarkdownV2" });
  }
};