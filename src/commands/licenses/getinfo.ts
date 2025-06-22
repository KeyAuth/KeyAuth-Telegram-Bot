import { Context } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey, Request } from "../../utilities/session";
import { stateManager } from "../../utilities/state";

let sellerKey: string = "";

export const name: string = "getinfo";
export const description: string = "Get information about a license.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  sellerKey = sellerKeyGet;

  await ctx.reply(`What license would you like to get the info of?`);

  stateManager.setWaitingForResponse(userId, "getinfo", handleLicense);
};

async function handleLicense(ctx: Context): Promise<void> {
  const license = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!license || !userId) {
    await ctx.reply("Please provide a valid license key.");
    return;
  }

  const response = await Request({
    sellerkey: sellerKey,
    type: "info",
    key: license,
  });

  if (!response.success) {
    await ctx.reply(`❌ Error: ${response.message}`);
    return;
  }

  const durationSeconds = Math.floor(parseInt(response.duration) / 1000000000);
  const durationDays = Math.floor(durationSeconds / 86400);
  const durationFormatted = `${durationDays} days`;

  await ctx.reply(
    `✅ License Info:\n` +
    `Key: ${license}\n` +
    `Status: ${response.status}\n` +
    `Level: ${response.level}\n` +
    `Duration: ${durationFormatted}\n` +
    `Created By: ${response.createdby}\n` +
    `Created Date: ${response.creationdate}\n` +
    `Used By: ${response.usedby || "None"}\n` +
    `Used On: ${response.usedon || "Never"}\n` +
    `Note: ${response.note || "None"}`
  );
}