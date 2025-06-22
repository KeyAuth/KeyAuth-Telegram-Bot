import { Context } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey, Request } from "../../utilities/session";
import { stateManager } from "../../utilities/state";

let sellerKey: string = "";
let subName: string = "";

export const name: string = "addsub";
export const description: string = "Add a new subscription level";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;
  sellerKey = sellerKeyGet;

  await ctx.reply("What is the name of the subscription you want to add?");

  stateManager.setWaitingForResponse(userId, "addsub", handleSubName);  
};

async function handleSubName(ctx: Context): Promise<void> {
  const subNameInput = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!subNameInput || !userId) {
    await ctx.reply("Please provide a valid subscription name.");
    return;
  }

  subName = subNameInput?.trim() || "";

  await ctx.reply("What level should this subscription be? (Enter a number)");

  stateManager.setWaitingForResponse(userId, "addsub_level", handleLevelResponse);
}

async function handleLevelResponse(ctx: Context): Promise<void> {
  const levelInput = ctx.message?.text;
  const userId = ctx.from?.id;
  
  if (!levelInput || !userId) {
    await ctx.reply("Please provide a valid level number.");
    return;
  }
  
  const level = parseInt(levelInput.trim());
  
  if (isNaN(level)) {
    await ctx.reply("Please enter a valid number for the subscription level.");
    return;
  }

  const response = await Request({
    sellerkey: sellerKey,
    type: "addsub",
    name: subName,
    level: level
  });

  if (!response.success) {
    await ctx.reply(`❌ Error: ${response.message}`);
    return;
  }

  await ctx.reply(`✅ Subscription added successfully!\n\nName: ${subName}\nLevel: ${level}`);
}