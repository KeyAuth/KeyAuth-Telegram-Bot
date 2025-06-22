import { Context } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey } from "../../utilities/session";
import { Request } from "../../utilities/session";
import { stateManager } from "../../utilities/state";

let sellerKey: string = "";

export const name: string = "deluser";
export const description: string = "Delete an existing user.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  sellerKey = sellerKeyGet;

  await ctx.reply(
    "What is the username of the user you want to delete? Please provide the username."
  );
  stateManager.setWaitingForResponse(userId, "deluser_username", handleUsername);
};

async function handleUsername(ctx: Context): Promise<void> {
  const username = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!username || !userId) {
    await ctx.reply("Please provide a valid username.");
    return;
  }

  const response = await Request({
    sellerkey: sellerKey,
    type: "deluser",
    user: username,
  });

  if (!response.success) {
    await ctx.reply(`❌ Error: ${response.message}`);
    return;
  }

  await ctx.reply(`✅ User ${username} has been successfully deleted.`);
}