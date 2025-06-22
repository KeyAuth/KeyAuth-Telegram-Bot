import { Context } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey } from "../../utilities/session";
import { Request } from "../../utilities/session";
import { stateManager } from "../../utilities/state";

let sellerKey: string = "";
let licenseKey: string = "";
let user: string = "";

export const name: string = "activate";  
export const description: string = "Create a new user using an existing license.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  sellerKey = sellerKeyGet;

  await ctx.reply(
    "What license key do you want to activate? Please provide the key."
  );
  stateManager.setWaitingForResponse(userId, "activate", handleLicense);
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
    "What is the username of the user you want to create? Please provide the username."
  );

  stateManager.setWaitingForResponse(userId, "activate_username", handleUsername);
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
    "What is the password for the user? Please provide a password."
  );
  stateManager.setWaitingForResponse(userId, "activate_password", handlePassword);
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
    type: "activate",
    key: licenseKey,
    user: user,
    pass: password,
  });

  if (!response.success) {
    await ctx.reply(`❌ Error: ${response.message}`);
    return;
  } else {
    await ctx.reply(`✅ User created successfully with license: ${licenseKey}`);
  }
}