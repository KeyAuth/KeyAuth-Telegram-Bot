import { Context } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey } from "../../utilities/session";
import { Request } from "../../utilities/session";
import { stateManager } from "../../utilities/state";

let sellerKey: string = "";
let user: string = "";
let varr: string = "";

export const name: string = "setuservar";
export const description: string = "Set a user variable.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  sellerKey = sellerKeyGet;

  await ctx.reply(
    "What is the username of the user whose variable you want to set? Please provide the username."
  );
  stateManager.setWaitingForResponse(userId, "setuservar_username", handleUsername);
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
    "What is the variable you want to set? Please provide the variable name."
  );
  stateManager.setWaitingForResponse(userId, "setuservar_variable", handleVariable);
}

async function handleVariable(ctx: Context): Promise<void> {
  const variable = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!variable || !userId) {
    await ctx.reply("Please provide a valid variable name.");
    return;
  }

  varr = variable || "";

  await ctx.reply(
    "What is the value you want to set for this variable? Please provide the value."
  );
  stateManager.setWaitingForResponse(userId, "setuservar_value", handleValue);
}

async function handleValue(ctx: Context): Promise<void> {
  const value = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!value || !userId) {
    await ctx.reply("Please provide a valid value.");
    return;
  }

  const response = await Request({
    sellerkey: sellerKey,
    type: "setvar",
    user: user,
    var: varr,
    data: value,
  });

  if (!response.success) {
    await ctx.reply(`❌ Error: ${response.message}`);
    return;
  }

  await ctx.reply(`✅ Variable '${varr}' set to '${value}' for user '${user}'.`);
}