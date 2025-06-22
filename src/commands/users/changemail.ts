import { Context } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey } from "../../utilities/session";
import { Request } from "../../utilities/session";
import { stateManager } from "../../utilities/state";

let sellerKey: string = "";
let user: string = "";

export const name: string = "changemail";
export const description: string = "Change the email address of a user";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  sellerKey = sellerKeyGet;

  await ctx.reply(
    "What is the username of the user whose email you want to change? Please provide the username."
  );
  stateManager.setWaitingForResponse(userId, "changemail_username", handleUsername);
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
    "What is the new email address you want to set for this user? Please provide the new email."
  );
  stateManager.setWaitingForResponse(userId, "changemail_email", handleEmail);
}

async function handleEmail(ctx: Context): Promise<void> {
  const email = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!email || !userId) {
    await ctx.reply("Please provide a valid email address.");
    return;
  }

  const response = await Request({
    sellerkey: sellerKey,
    type: "editemail",
    user: user,
    email: email,
  });

  if (!response.success) {
    await ctx.reply(`❌ Error: ${response.message}`);
    return;
  }

  await ctx.reply(`✅ Email address for user ${user} has been changed to ${email}.`);
}