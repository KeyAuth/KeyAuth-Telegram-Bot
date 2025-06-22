import { Context } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey } from "../../utilities/session";
import { Request } from "../../utilities/session";
import { stateManager } from "../../utilities/state";

let sellerKey: string = "";
let user: string = "";

export const name: string = "ban";
export const description: string = "Ban a user and prevent them from logging into an application.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  sellerKey = sellerKeyGet;

  await ctx.reply(
    "What is the username of the user you want to ban? Please provide the username."
  );
  stateManager.setWaitingForResponse(userId, "ban_username", handleUsername);
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
    "Why do you want to ban this user? Please provide a reason."
  );
  stateManager.setWaitingForResponse(userId, "ban_reason", handleReason);
}

async function handleReason(ctx: Context): Promise<void> {
  const reason = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!reason || !userId) {
    await ctx.reply("Please provide a valid reason for banning the user.");
    return;
  }

  const response = await Request({
    sellerkey: sellerKey,
    type: "banuser",
    user: user,
    reason: reason,
  });

  if (!response.success) {
    await ctx.reply(`❌ Error: ${response.message}`);
    return;
  }

  await ctx.reply(`✅ User ${user} has been banned successfully.`);
}