import { Context } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey } from "../../utilities/session";
import { Request } from "../../utilities/session";
import { stateManager } from "../../utilities/state";

let sellerKey: string = "";

export const name: string = "countsubs";
export const description: string = "Retrieve the number of users with a specific subscription.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  sellerKey = sellerKeyGet;

  await ctx.reply(
    "What is the subscription you want to count users for? Please provide the subscription name."
  );
  stateManager.setWaitingForResponse(userId, "countsubs_subscription", handleSubscription);
};

async function handleSubscription(ctx: Context): Promise<void> {
  const subscription = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!subscription || !userId) {
    await ctx.reply("Please provide a valid subscription name.");
    return;
  }

  const response = await Request({
    sellerkey: sellerKey,
    type: "countsubs",
    name: subscription,
  });

  if (!response.success) {
    await ctx.reply(`❌ Error: ${response.message}`);
    return;
  }

  await ctx.reply(`✅ There are ${response.count} users with subscription: ${subscription}.`);
}
