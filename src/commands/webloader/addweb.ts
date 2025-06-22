import { Context } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey, Request } from "../../utilities/session";
import { stateManager } from "../../utilities/state";

let sellerKey: string = "";
let buttonText: string = "";
let buttonValue: string = "";

export const name: string = "addweb";
export const description: string = "Create a new web loader button.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;
  sellerKey = sellerKeyGet;

  await ctx.reply("What is the text for the new web loader button?");

  stateManager.setWaitingForResponse(userId, "addweb", handleButtonText);  
};

async function handleButtonText(ctx: Context): Promise<void> {
  const buttonTextInput = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!buttonTextInput || !userId) {
    await ctx.reply("Please provide a valid button text.");
    return;
  }

  buttonText = buttonTextInput.trim() || "";

  await ctx.reply("What is the value for the web loader button?");

  stateManager.setWaitingForResponse(userId, "addweb_value", handleButtonValue);
}

async function handleButtonValue(ctx: Context): Promise<void> {
  const buttonValueInput = ctx.message?.text?.trim();
  const userId = ctx.from?.id;

  if (!buttonValueInput || !userId) {
    await ctx.reply("Please provide a valid button value.");
    return;
  }

  buttonValue = buttonValueInput || "";

  const requestParams: any = {
    sellerkey: sellerKey,
    type: "addbutton",
    text: buttonText,
    value: buttonValue
  };

  const response = await Request(requestParams);

  if (!response.success) {
    await ctx.reply(`❌ Error: ${response.message}`);
    return;
  }

  await ctx.reply(`✅ Web loader button added successfully: "${buttonText}" with value: "${buttonValue}"`);
}