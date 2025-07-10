import { Context, InlineKeyboard } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey } from "../../utilities/session";
import { Request } from "../../utilities/session";
import { stateManager } from "../../utilities/state";

let sellerKey: string = "";
let username: string = "";
let password: string = "";

export const name: string = "createuser";
export const description: string = "Create a new user.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  await ctx.reply(`Please provide the username for the new user.`);

  stateManager.setWaitingForResponse(userId, "createuser_username", handleUsername);
};

async function handleUsername(ctx: Context): Promise<void> {
  const usernameRaw = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!usernameRaw || !userId) {
    await ctx.reply("Please provide a valid username.");
    return;
  }

  username = usernameRaw;

  await ctx.reply(`Please provide the password for the new user.`);

  stateManager.setWaitingForResponse(userId, "createuser_password", handlePassword);
}

async function handlePassword(ctx: Context): Promise<void> {
  const passwordRaw = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!passwordRaw || !userId) {
    await ctx.reply("Please provide a valid password.");
    return;
  }

  password = passwordRaw;

  await ctx.reply(`Please provide an expiration (in days).`)

  stateManager.setWaitingForResponse(userId, "createuser_expiration", handleExpiration);
}

async function handleExpiration(ctx: Context): Promise<void> {
  const expirationRaw = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!expirationRaw || !userId) {
    await ctx.reply("Please provide a valid expiration in days.");
    return;
  }

  const expiration = parseInt(expirationRaw, 10);
  if (isNaN(expiration) || expiration <= 0) {
    await ctx.reply("Please provide a valid number of days for expiration.");
    return;
  }

  const response = await Request({
    sellerkey: sellerKey,
    type: "adduser",
    user: username,
    pass: password,
    expiration: expiration,
  });

  if (!response.success) {
    await ctx.reply(`❌ Error: ${response.message}`);
    return;
  }

  await ctx.reply(`✅ User created successfully! Username: ${username}`);
}