import { Context } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey } from "../../utilities/session";
import { Request } from "../../utilities/session";
import { stateManager } from "../../utilities/state";

let sellerKey: string = "";
let licenseKey: string = "";

export const name: string = "keytouser";
export const description: string = "Assign a license to a user.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  sellerKey = sellerKeyGet;

  await ctx.reply(
    "What license key do you want to assign to a user? Please provide the key."
  );
  stateManager.setWaitingForResponse(userId, "keytouser", handleLicense);
};

async function handleLicense(ctx: Context): Promise<void> {
  const license = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!license || !userId) {
    await ctx.reply("Please provide a valid license key.");
    return;
  }

  licenseKey = license || "";

  await ctx.reply(
    "What is the username of the user you want to assign this license to? Please provide the username."
  )

  stateManager.setWaitingForResponse(userId, "keytouser_username", handleUsername);
}

async function handleUsername(ctx: Context): Promise<void> {
  const username = ctx.message?.text;
  const userId = ctx.from?.id;

  if (username && userId) {
    const response = await Request({
      sellerkey: sellerKey,
      type: "assignkey",
      key: licenseKey,
      user: username,
    });

    if (!response.success) {
      await ctx.reply(`❌ Error: ${response.message}`);
      return;
    } else {
      await ctx.reply(`✅ License assigned successfully to user: ${username}`);
    }
  } else {
    await ctx.reply("Please provide a valid username.");
  }
}