import { Context } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey } from "../../utilities/session";
import { Request } from "../../utilities/session";
import { stateManager } from "../../utilities/state";

let sellerKey: string = "";
let user: string = "";
let sub: string = "";

export const name: string = "subtract";
export const description: string = "Subtract time from a users expiration.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  sellerKey = sellerKeyGet;

  await ctx.reply(
    "What is the username of the user whose subscription you want to subtract time from? Please provide the username."
  );
  stateManager.setWaitingForResponse(userId, "subtract_username", handleUsername);
}

async function handleUsername(ctx: Context): Promise<void> {
  const username = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!username || !userId) {
    await ctx.reply("Please provide a valid username.");
    return;
  }

  user = username || "";

  await ctx.reply(
    "What is the subscription you want to subtract time from? Please provide the subscription name."
  );
  stateManager.setWaitingForResponse(userId, "subtract_subscription", handleSubscription);
}

async function handleSubscription(ctx: Context): Promise<void> {
  const subscription = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!subscription || !userId) {
    await ctx.reply("Please provide a valid subscription name.");
    return;
  }

  sub = subscription || "";

  await ctx.reply(
    "How many seconds do you want to subtract from this subscription? Please provide the number of seconds."
  );
  stateManager.setWaitingForResponse(userId, "subtract_seconds", handleSeconds);
}

async function handleSeconds(ctx: Context): Promise<void> {
  const seconds = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!seconds || !userId) {
    await ctx.reply("Please provide a valid number of seconds.");
    return;
  }

  const response = await Request({
    sellerkey: sellerKey,
    type: "subtract",
    user: user,
    sub: sub,
    seconds: parseInt(seconds, 10),
  });

  if (!response.success) {
    await ctx.reply(`❌ Error: ${response.message}`);
    return;
  }

  await ctx.reply(`✅ Successfully subtracted ${seconds} seconds from ${user}'s subscription ${sub}.`);
}