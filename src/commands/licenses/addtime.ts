import { Context } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey } from "../../utilities/session";
import { Request } from "../../utilities/session";
import { stateManager } from "../../utilities/state";

let sellerKey: string = "";

export const name: string = "addtime";
export const description: string = "Add time to all licenses that are not being used. This will add the time given to whatever the existing time is on the license.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  sellerKey = sellerKeyGet;

  await ctx.reply(
    "How long in seconds do you want to add to all licenses that are not being used? Please provide a number."
  );
  stateManager.setWaitingForResponse(userId, "addtime", handleTime);
};

async function handleTime(ctx: Context): Promise<void> {
  const time = ctx.message?.text;
  const userId = ctx.from?.id;

  if (time && userId) {
    const response = await Request({
      sellerkey: sellerKey,
      type: "addtime",
      time: Number(time),
    });

    if (!response.success) {
      await ctx.reply(`❌ Error: ${response.message}`);
      return;
    } else {
      await ctx.reply(`✅ Time added successfully: ${time} seconds`);
    }
  } else {
    await ctx.reply("Please provide a valid number of seconds.");
  }
}