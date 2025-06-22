import { Context } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey, Request } from "../../utilities/session";
import { stateManager } from "../../utilities/state";

let sellerKey: string = "";
let whitelistIp: string = "";
let whitelistReason: string = "";

export const name: string = "addwhite";
export const description: string = "Add an IP to the whitelist.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;
  sellerKey = sellerKeyGet;

  await ctx.reply("What is the IP address to add to the whitelist?");

  stateManager.setWaitingForResponse(userId, "addwhite", handleWhitelistIp);  
};

async function handleWhitelistIp(ctx: Context): Promise<void> {
  const ipInput = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!ipInput || !userId) {
    await ctx.reply("Please provide a valid IP address.");
    return;
  }

  whitelistIp = ipInput.trim() || "";

  await ctx.reply("What is the reason for whitelisting this IP? (Type 'skip' if no reason needed)");

  stateManager.setWaitingForResponse(userId, "addwhite_reason", handleWhitelistReason);
}

async function handleWhitelistReason(ctx: Context): Promise<void> {
  const reasonInput = ctx.message?.text?.trim();
  const userId = ctx.from?.id;

  if (!userId) {
    await ctx.reply("An error occurred. Please try again.");
    return;
  }

  whitelistReason = reasonInput === "skip" ? "" : (reasonInput || "");

  const requestParams: any = {
    sellerkey: sellerKey,
    type: "addWhite",
    ip: whitelistIp
  };

  // Only add reason parameter if one was provided (not skipped)
  if (whitelistReason) {
    requestParams.reason = whitelistReason;
  }

  const response = await Request(requestParams);

  if (!response.success) {
    await ctx.reply(`❌ Error: ${response.message}`);
    return;
  }

  await ctx.reply(`✅ IP added to whitelist successfully: ${whitelistIp}${whitelistReason ? ` with reason: "${whitelistReason}"` : ""}`);
}