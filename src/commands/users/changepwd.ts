import { Context } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey } from "../../utilities/session";
import { Request } from "../../utilities/session";
import { stateManager } from "../../utilities/state";

let sellerKey: string = "";
let user: string = "";

export const name: string = "changepwd";
export const description: string = "Change the password of a user.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  sellerKey = sellerKeyGet;

  await ctx.reply(
    "What is the username of the user whose password you want to change? Please provide the username."
  );
  stateManager.setWaitingForResponse(userId, "changepwd_username", handleUsername);
};

async function handleUsername(ctx: Context): Promise<void> {
  const username = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!username || !userId) {
    await ctx.reply("Please provide a valid username.");
    return;
  }

  user = username || "";

  await ctx.reply(
    "What is the new password you want to set for this user? Please provide the new password."
  );
  stateManager.setWaitingForResponse(userId, "changepwd_password", handlePassword);
}

async function handlePassword(ctx: Context): Promise<void> {
  const password = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!password || !userId) {
    await ctx.reply("Please provide a valid password.");
    return;
  }

  const response = await Request({
    sellerkey: sellerKey,
    type: "changepw",
    user: user,
    passwd: password,
  });

  if (!response.success) {
    await ctx.reply(`❌ Error: ${response.message}`);
    return;
  }

  await ctx.reply(`✅ Password for user ${user} has been changed successfully.`);
}