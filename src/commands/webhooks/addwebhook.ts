import { Context } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey, Request } from "../../utilities/session";
import { stateManager } from "../../utilities/state";

let sellerKey: string = "";
let webhookUrl: string = "";
let webhookUserAgent: string = "";

export const name: string = "addwebhook";
export const description: string = "Create a new webhook.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;
  sellerKey = sellerKeyGet;

  await ctx.reply("What is the URL of the new webhook?");

  stateManager.setWaitingForResponse(userId, "addwebhook", handleWebhookUrl);  
};

async function handleWebhookUrl(ctx: Context): Promise<void> {
  const webhookUrlInput = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!webhookUrlInput || !userId) {
    await ctx.reply("Please provide a valid webhook URL.");
    return;
  }

  webhookUrl = webhookUrlInput.trim() || "";

  await ctx.reply("What is the User-Agent for the webhook? (Type 'skip' to use default 'KeyAuth')");

  stateManager.setWaitingForResponse(userId, "addwebhook_useragent", handleUserAgent);
}

async function handleUserAgent(ctx: Context): Promise<void> {
  const userAgentInput = ctx.message?.text?.trim();
  const userId = ctx.from?.id;

  if (!userId) {
    await ctx.reply("An error occurred. Please try again.");
    return;
  }

  webhookUserAgent = userAgentInput === "skip" ? "" : (userAgentInput || "");

  await ctx.reply("Should the user have to be authed? (yes/no)");

  stateManager.setWaitingForResponse(userId, "addwebhook_auth", handleWebhookAuth);
}

async function handleWebhookAuth(ctx: Context): Promise<void> {
  const authResponse = ctx.message?.text?.trim().toLowerCase();

  if (authResponse !== "yes" && authResponse !== "no") {
    await ctx.reply("Please respond with 'yes' or 'no'.");
    return;
  }

  const requestParams: any = {
    sellerkey: sellerKey,
    type: "addwebhook",
    baseurl: webhookUrl,
    authed: authResponse === "yes" ? 1 : 0
  };

  if (webhookUserAgent) {
    requestParams.ua = webhookUserAgent;
  }

  const response = await Request(requestParams);

  if (!response.success) {
    await ctx.reply(`❌ Error: ${response.message}`);
    return;
  }

  await ctx.reply(`✅ Webhook added successfully: ${webhookUrl}${webhookUserAgent ? ` with User-Agent: ${webhookUserAgent}` : ""}`);
}