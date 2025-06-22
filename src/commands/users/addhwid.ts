import { Context } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey } from "../../utilities/session";
import { Request } from "../../utilities/session";
import { stateManager } from "../../utilities/state";

let sellerKey: string = "";
let user: string = "";

export const name: string = "addhwid";
export const description: string = "Add a new HWID to an existing user.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  sellerKey = sellerKeyGet;

  await ctx.reply(
    "What is the username of the user you want to add a HWID to? Please provide the username."
  );
  stateManager.setWaitingForResponse(userId, "addhwid_username", handleUsername);
};

async function handleUsername(ctx: Context): Promise<void> {
  const username = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!username || !userId) {
    await ctx.reply("Please provide a valid username.");
    return;
  }

  user = username || "";

  await ctx.reply(
    "What is the HWID you want to add? Please provide the HWID."
  );
  stateManager.setWaitingForResponse(userId, "addhwid_hwid", handleHwid);
}

async function handleHwid(ctx: Context): Promise<void> {
  const hwid = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!hwid || !userId) {
    await ctx.reply("Please provide a valid HWID.");
    return;
  }

  const response = await Request({
    sellerkey: sellerKey,
    type: "addhwiduser",
    user: user,
    hwid: hwid,
  });

  if (!response.success) {
    await ctx.reply(`❌ Error: ${response.message}`);
    return;
  } else {
    await ctx.reply(`✅ Successfully added HWID to user ${user}.`);
  }
}