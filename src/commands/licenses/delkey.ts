import { Context } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey, Request } from "../../utilities/session";
import { stateManager } from "../../utilities/state";

let sellerKey: string = "";
let licenseKey: string = "";

export const name: string = "delkey";
export const description: string = "Delete an existing license.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  sellerKey = sellerKeyGet;

  await ctx.reply(`What license would you like to delete?`);

  stateManager.setWaitingForResponse(userId, "delkey", handleLicense);
};

async function handleLicense(ctx: any): Promise<void> {
  const license = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!license || !userId) {
    await ctx.reply("Please provide a valid license key.");
    return;
  }

  licenseKey = license || "";

  await ctx.reply(
    "Should the user also be banned? (yes/no)"
  )

  stateManager.setWaitingForResponse(userId, "delkey_user", handleConfirm);
}

async function handleConfirm(ctx: Context): Promise<void> {
  const confirm = ctx.message?.text?.trim().toLowerCase();

  if (confirm !== "yes" && confirm !== "no") {
    await ctx.reply("Please respond with 'yes' or 'no'.");
    return;
  }

  const response = await Request({
    sellerkey: sellerKey,
    type: "del",
    key: licenseKey,
    userToo: confirm === "yes" ? true : false,
  });

  if (!response.success) {
    await ctx.reply(`❌ Error: ${response.message}`);
    return;
  } else {
    await ctx.reply(`✅ License deleted successfully: ${licenseKey}`);
  }
}