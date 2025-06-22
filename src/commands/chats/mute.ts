import { Context } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey, Request } from "../../utilities/session";
import { stateManager } from "../../utilities/state";

let sellerKey: string = "";
let muteUser: string = "";

export const name: string = "mute";
export const description: string = "Mute a user from chatting for a specific duration.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  sellerKey = sellerKeyGet;

  await ctx.reply("Who would you like to mute?")

  stateManager.setWaitingForResponse(userId, "mute", handleMuteUser);
}

async function handleMuteUser(ctx: Context): Promise<void> {
  const inputUser = ctx.message?.text;
  const userId = ctx.from?.id;

  if (inputUser && userId) {
    await ctx.reply(`How long would you like to mute ${inputUser} for? (in seconds)`);

    muteUser = inputUser;

    stateManager.setWaitingForResponse(userId, "mute", handleMuteDuration);
  } else {
    await ctx.reply("Please provide a valid user to mute.");
  }
}

async function handleMuteDuration(ctx: Context): Promise<void> {
  const duration = ctx.message?.text;
  const userId = ctx.from?.id;

  if (duration && !isNaN(Number(duration)) && userId) {
    const response = await Request({
      sellerkey: sellerKey,
      type: "muteuser",
      user: muteUser,
      time: Number(duration)
    });

    if (!response.success) {
      await ctx.reply(`❌ Error: ${response.message}`);
      return;
    } else {
      await ctx.reply(`✅ User ${muteUser} has been muted for ${duration} seconds.`);
    }
  } else {
    await ctx.reply("Please provide a valid duration in seconds.");
  }
}