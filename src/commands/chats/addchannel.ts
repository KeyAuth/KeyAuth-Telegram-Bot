import { Context } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey, Request } from "../../utilities/session";
import { stateManager } from "../../utilities/state";

// Global variables used across functions
let channelName: string = "";
let sellerKey: string = "";

export const name: string = "addchannel";
export const description: string = "Create a new chatroom channel to allow messages to be sent too.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;
  sellerKey = sellerKeyGet;

  await ctx.reply("What should the name of the channel be?");

  stateManager.setWaitingForResponse(
    userId,
    "addchannel",
    handleChannelName
  );
}

async function handleChannelName(ctx: Context): Promise<void> {
  const inputName = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!inputName || !userId) {
    await ctx.reply("Please provide a valid channel name.");
    return;
  }

  channelName = inputName;

  await ctx.reply("What should the delay be? (In seconds)");
  
  stateManager.setWaitingForResponse(
    userId,
    "addchannel",
    handleChannelDelay
  );
}

async function handleChannelDelay(ctx: Context): Promise<void> {
  const delay = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!delay || isNaN(Number(delay)) || !userId) {
    await ctx.reply("Please provide a valid delay in seconds.");
    return;
  }

  if (channelName && delay && sellerKey) {
    const response = await Request({
      sellerkey: sellerKey,
      type: "addchannel",
      name: channelName,
      delay: Number(delay),
    });

    if (!response.success) {
      await ctx.reply(`❌ Error: ${response.message}`);
      return;
    } else {
      await ctx.reply(`✅ Channel created successfully: ${channelName} with a delay of ${delay} seconds.`);
      
      stateManager.clearState(userId);
    }
  } else {
    await ctx.reply("Error: Missing required information. Please try again.");
  }
}