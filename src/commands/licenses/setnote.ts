import { Context } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey, Request } from "../../utilities/session";
import { stateManager } from "../../utilities/state";

let sellerKey: string = "";
let licenseKey: string = "";

export const name: string = "setnote";
export const description: string = "Set a note on an existing license.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  sellerKey = sellerKeyGet;

  await ctx.reply(`What license would you like to set the note of?`);

  stateManager.setWaitingForResponse(userId, "setnote", handleLicense);
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
    "What note would you like to set for this license? Please provide the note."
  );

  stateManager.setWaitingForResponse(userId, "setnote_note", handleNote);
}

async function handleNote(ctx: Context): Promise<void> {
  const note = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!note || !userId) {
    await ctx.reply("Please provide a valid note.");
    return;
  }

  const response = await Request({
    sellerkey: sellerKey,
    type: "setnote",
    key: licenseKey,
    note: note,
  });

  if (!response.success) {
    await ctx.reply(`❌ Error: ${response.message}`);
    return;
  }

  await ctx.reply(`✅ Note set successfully for license: ${licenseKey}`);
}