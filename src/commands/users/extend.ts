import { Context } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey } from "../../utilities/session";
import { Request } from "../../utilities/session";
import { stateManager } from "../../utilities/state";

let sellerKey: string = "";
let user: string = "";
let sub: string = "";
let expiry: string = "";

export const name: string = "extend";
export const description: string = "Extend the expiration time of users.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  sellerKey = sellerKeyGet;

  await ctx.reply(
    "What is the username of the user whose subscription you want to extend? Please provide the username. (send all for all users)"
  );
  stateManager.setWaitingForResponse(userId, "extend_username", handleUsername);
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
    "What is the subscription you want to extend? Please provide the subscription name."
  );
  stateManager.setWaitingForResponse(userId, "extend_subscription", handleSubscription);
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
    "What is the new expiration time you want to set for this subscription? Please provide the new expiration time in seconds."
  );
  stateManager.setWaitingForResponse(userId, "extend_expiry", handleExpiry);
}

async function handleExpiry(ctx: Context): Promise<void> {
  const expiryTime = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!expiryTime || !userId) {
    await ctx.reply("Please provide a valid expiration time in seconds.");
    return;
  }

  expiry = expiryTime || "";

  await ctx.reply("Should this only affect active users? (yes/no)");
  stateManager.setWaitingForResponse(userId, "extend_active", handleActiveOnly);
}

async function handleActiveOnly(ctx: Context): Promise<void> {
  const activeResponse = ctx.message?.text?.trim().toLowerCase();

  if (activeResponse !== "yes" && activeResponse !== "no") {
    await ctx.reply("Please respond with 'yes' or 'no'.");
    return;
  }

  const response = await Request({
    sellerkey: sellerKey,
    type: "extend",
    user: user,
    sub: sub,
    expiry: expiry,
    activeOnly: activeResponse === "yes" ? true : false,
  });

  if (!response.success) {
    await ctx.reply(`❌ Error: ${response.message}`);
    return;
  }

  await ctx.reply(`✅ Successfully extended the subscription for ${user} to ${expiry} seconds.`);
}