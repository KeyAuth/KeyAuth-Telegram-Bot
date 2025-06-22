import { Context, InlineKeyboard } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey } from "../../utilities/session";
import { Request } from "../../utilities/session";
import { stateManager } from "../../utilities/state";

let sellerKey: string = "";
let licenseKey: string = "";
let banReason: string = "";

export const name: string = "bankey";
export const description: string = "Ban a license and preventing them from logging into an application.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  sellerKey = sellerKeyGet;

  await ctx.reply(
    "What license key do you want to ban? Please provide the key."
  );
  stateManager.setWaitingForResponse(userId, "ban", handleLicense);
}

async function handleLicense(ctx: Context): Promise<void> {
  const license = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!license || !userId) {
    await ctx.reply("Please provide a valid license key.");
    return;
  }

  licenseKey = license || "";

  await ctx.reply(
    "Why do you want to ban this license? Please provide a reason."
  )

  stateManager.setWaitingForResponse(userId, "ban_reason", handleReason);
}

async function handleReason(ctx: Context): Promise<void> {
  const reason = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!reason || !userId) {
    await ctx.reply("Please provide a valid reason for banning the license.");
    return;
  }

  banReason = reason || "";

  await ctx.reply(
    "Should the user also be banned? (yes/no)"
  )

  stateManager.setWaitingForResponse(userId, "ban_confirm", handleConfirm);
}

async function handleConfirm(ctx: Context): Promise<void> {
  const confirm = ctx.message?.text?.trim().toLowerCase();

  if (confirm !== "yes" && confirm !== "no") {
    await ctx.reply("Please respond with 'yes' or 'no'.");
    return;
  }

  const response = await Request({
    sellerkey: sellerKey,
    type: "ban",
    key: licenseKey,
    reason: banReason,
    userToo: confirm === "yes",
  });

  if (!response.success) {
    await ctx.reply(`❌ Error: ${response.message}`);
    return;
  } else {
    await ctx.reply(`✅ License banned successfully: ${licenseKey}`);
  }
}