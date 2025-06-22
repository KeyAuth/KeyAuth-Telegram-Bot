import { Context } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey } from "../../utilities/session";
import { Request } from "../../utilities/session";
import { stateManager } from "../../utilities/state";

let sellerKey: string = "";

export const name: string = "addhash";
export const description: string = "Add a hash to an application to prevent any users from running modified versions of an application.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  sellerKey = sellerKeyGet;

  await ctx.reply(
    "Please send the hash you want to add to your application."
  );
  stateManager.setWaitingForResponse(userId, "addhash", handleHash);
};

async function handleHash(ctx: Context): Promise<void> {
  const hash = ctx.message?.text;
  const userId = ctx.from?.id;

  if (hash && userId) {
    const response = await Request({
      sellerkey: sellerKey,
      type: "addhash",
      hash,
    });

    if (!response.success) {
      await ctx.reply(`❌ Error: ${response.message}`);
      return;
    } else {
      await ctx.reply(`✅ Hash added successfully: ${hash}`);
    }
  } else {
    await ctx.reply("Please provide a valid hash.");
  }
}
