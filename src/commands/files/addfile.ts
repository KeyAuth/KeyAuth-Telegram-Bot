import { Context } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey, Request } from "../../utilities/session";
import { stateManager } from "../../utilities/state";

let sellerKey: string = "";
let fileUrl: string = "";

export const name: string = "addfile";
export const description: string = "Upload a new file. Files must end in an extension (.exe, .rar for example)";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;
  sellerKey = sellerKeyGet;

  await ctx.reply("What is the url of the file you want to upload?");

  stateManager.setWaitingForResponse(userId, "addfile", handleFileUrl);  
};

async function handleFileUrl(ctx: Context): Promise<void> {
  const fileUrlInput = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!fileUrlInput || !userId) {
    await ctx.reply("Please provide a valid file URL.");
    return;
  }

  fileUrl = fileUrlInput?.trim() || "";

  await ctx.reply("Should the user have to be authed? (yes/no)");

  stateManager.setWaitingForResponse(userId, "addfile_auth", handleAuthResponse);
}

async function handleAuthResponse(ctx: Context): Promise<void> {
  const authResponse = ctx.message?.text?.trim().toLowerCase();

  if (authResponse !== "yes" && authResponse !== "no") {
    await ctx.reply("Please respond with 'yes' or 'no'.");
    return;
  }

  const response = await Request({
    sellerkey: sellerKey,
    type: "upload",
    url: fileUrl,
    authed: authResponse === "yes" ? 1 : 0,
  });

  if (!response.success) {
    await ctx.reply(`❌ Error: ${response.message}`);
    return;
  }

  await ctx.reply(`✅ File added successfully: ${fileUrl}`);
}