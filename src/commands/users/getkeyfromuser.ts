import { Context } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey } from "../../utilities/session";
import { Request } from "../../utilities/session";
import { stateManager } from "../../utilities/state";

let sellerKey: string = "";
let user: string = "";

export const name: string = "getkeyfromuser";
export const description: string = "Retrieve the license that is currently assigned to a user.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  sellerKey = sellerKeyGet;

  await ctx.reply(
    "What is the username of the user whose license you want to retrieve? Please provide the username."
  );
  stateManager.setWaitingForResponse(userId, "getkeyfromuser_username", handleUsername);
}

async function handleUsername(ctx: Context): Promise<void> {
  const username = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!username || !userId) {
    await ctx.reply("Please provide a valid username.");
    return;
  }

  user = username || "";

  const response = await Request({
    sellerkey: sellerKey,
    type: "getkeyfromuser",
    user: user,
  });

  if (!response.success) {
    await ctx.reply(`❌ Error: ${response.message}`);
    return;
  }

  await ctx.reply(`✅ License for user ${user}: ${response.key}`);
}