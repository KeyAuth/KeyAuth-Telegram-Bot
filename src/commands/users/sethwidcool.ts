import { Context } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey } from "../../utilities/session";
import { Request } from "../../utilities/session";
import { stateManager } from "../../utilities/state";

let sellerKey: string = "";
let user: string = "";

export const name: string = "sethwidcool";
export const description: string = "Set a cooldown for the amount of time between each HWID reset.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  sellerKey = sellerKeyGet;

  await ctx.reply(
    "What is the username of the user whose HWID cooldown you want to set? Please provide the username."
  );
  stateManager.setWaitingForResponse(userId, "sethwidcool_username", handleUsername);
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
    "What is the cooldown time you want to set for this user's HWID reset? Please provide the cooldown time in seconds."
  );
  stateManager.setWaitingForResponse(userId, "sethwidcool_cooldown", handleCooldown);
}

async function handleCooldown(ctx: Context): Promise<void> {
  const cooldown = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!cooldown || !userId) {
    await ctx.reply("Please provide a valid cooldown time in seconds.");
    return;
  }

  const response = await Request({
    sellerkey: sellerKey,
    type: "sethwidcool",
    user: user,
    cooldown: cooldown,
  });

  if (!response.success) {
    await ctx.reply(`❌ Error: ${response.message}`);
    return;
  }

  await ctx.reply(`✅ Successfully set HWID cooldown for user ${user} to ${cooldown} seconds.`);
}