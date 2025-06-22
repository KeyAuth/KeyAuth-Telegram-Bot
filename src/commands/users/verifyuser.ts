import { Context } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey, Request } from "../../utilities/session";
import { stateManager } from "../../utilities/state";

let sellerKey: string = "";

export const name: string = "verifyuser";
export const description: string = "Verify a user exists.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  sellerKey = sellerKeyGet;

  await ctx.reply(`What user would you like to see if it exists?`);

  stateManager.setWaitingForResponse(userId, "verifyuser", handleUser);
};

async function handleUser(ctx: Context): Promise<void> {
  const user = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!user || !userId) {
    await ctx.reply("Please provide a valid user key.");
    return;
  }

  const response = await Request({
    sellerkey: sellerKey,
    type: "verifyuser",
    user: user,
  });

  if (!response.success) {
    await ctx.reply(`❌ Error: ${response.message}`);
    return;
  }

  await ctx.reply(`✅ User exists: ${user}`);
}