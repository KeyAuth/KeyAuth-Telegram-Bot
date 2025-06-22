import { Context } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey } from "../../utilities/session";
import { Request } from "../../utilities/session";
import { stateManager } from "../../utilities/state";

let sellerKey: string = "";
let user: string = "";

export const name: string = "getuservardata";
export const description: string = "Retrieve the data of a user variable.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  sellerKey = sellerKeyGet;

  await ctx.reply(
    "What is the username of the user whose variable data you want to retrieve? Please provide the username."
  );
  stateManager.setWaitingForResponse(userId, "getuservardata_username", handleUsername);
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
    "What is the variable name you want to retrieve data for? Please provide the variable name."
  );
  stateManager.setWaitingForResponse(userId, "getuservardata_variable", handleVariable);
}

async function handleVariable(ctx: Context): Promise<void> {
  const variable = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!variable || !userId) {
    await ctx.reply("Please provide a valid variable name.");
    return;
  }

  const response = await Request({
    sellerkey: sellerKey,
    type: "getuservardata",
    user: user,
    var: variable,
  });

  if (!response.success) {
    await ctx.reply(`❌ Error: ${response.message}`);
    return;
  }

  await ctx.reply(`✅ Data for user ${user}, variable ${variable}: ${response.data}`);
}