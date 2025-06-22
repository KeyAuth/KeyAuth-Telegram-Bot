import { Context } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey } from "../../utilities/session";
import { Request } from "../../utilities/session";
import { stateManager } from "../../utilities/state";

let sellerKey: string = "";
let user: string = "";

export const name: string = "getuserdata";
export const description: string = "Get the data of a user";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  sellerKey = sellerKeyGet;

  await ctx.reply(
    "What is the username of the user whose data you want to retrieve? Please provide the username."
  );
  stateManager.setWaitingForResponse(userId, "getuserdata_username", handleUsername);
}

async function handleUsername(ctx: Context): Promise<void> {
  const username = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!username || !userId) {
    await ctx.reply("Please provide a valid username.");
    return;
  }

  user = username || "";

  const response = await Request({
    sellerkey: sellerKey,
    type: "getuserdata",
    user: user,
  });

  if (!response.success) {
    await ctx.reply(`❌ Error: ${response.message}`);
    return;
  }

  // Format subscriptions
  const subscriptions = response.subscriptions && response.subscriptions.length > 0 
    ? response.subscriptions.map((sub: any) => `${sub.name || 'Unknown'}`).join(', ')
    : "None";

  // Format user variables
  const userVars = response.uservars && response.uservars.length > 0
    ? response.uservars.map((uvar: any) => `${uvar.name}: ${uvar.data}`).join('\n')
    : "None";

  await ctx.reply(
    `✅ User Data for ${user}:\n` +
    `Username: ${response.username}\n` +
    `IP: ${response.ip || "None"}\n` +
    `HWID: ${response.hwid || "None"}\n` +
    `Create Date: ${response.createdate || "None"}\n` +
    `Last Login: ${response.lastlogin || "None"}\n` +
    `Token: ${response.token || "None"}\n` +
    `Banned: ${response.banned || "No"}\n` +
    `Cooldown: ${response.cooldown || "None"}\n` +
    `Subscriptions: ${subscriptions}\n` +
    `User Variables:\n${userVars}`
  );
}