import { Context } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey, Request } from "../../utilities/session";
import { stateManager } from "../../utilities/state";

let sellerKey: string = "";
let varName: string = "";
let varValue: string = "";

export const name: string = "addvar";
export const description: string = "Create a new global variable. This can be retrieved by any user!";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;
  sellerKey = sellerKeyGet;

  await ctx.reply("What is the name of the new global variable?");

  stateManager.setWaitingForResponse(userId, "addvar", handleFileUrl);  
};

async function handleFileUrl(ctx: Context): Promise<void> {
  const varNameInput = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!varNameInput || !userId) {
    await ctx.reply("Please provide a valid variable name.");
    return;
  }

  varName = varNameInput.trim() || "";

  await ctx.reply("What is the value of the new global variable?");

  stateManager.setWaitingForResponse(userId, "addvar_value", handleVarValue);
}

async function handleVarValue(ctx: Context): Promise<void> {
  const varValueInput = ctx.message?.text?.trim();
  const userId = ctx.from?.id;

  if (!varValueInput || !userId) {
    await ctx.reply("Please provide a valid variable value.");
    return;
  }

  varValue = varValueInput || "";

  await ctx.reply("Should the user have to be authed? (yes/no)");

  stateManager.setWaitingForResponse(userId, "addvar_auth", handleVarAuth);
}

async function handleVarAuth(ctx: Context): Promise<void> {
  const authResponse = ctx.message?.text?.trim().toLowerCase();

  if (authResponse !== "yes" && authResponse !== "no") {
    await ctx.reply("Please respond with 'yes' or 'no'.");
    return;
  }

  const response = await Request({
    sellerkey: sellerKey,
    type: "addvar",
    name: varName,
    data: varValue,
    authed: authResponse === "yes" ? 1 : 0,
  });

  if (!response.success) {
    await ctx.reply(`❌ Error: ${response.message}`);
    return;
  }

  await ctx.reply(`✅ Var added successfully: ${varName} = ${varValue}`);
}