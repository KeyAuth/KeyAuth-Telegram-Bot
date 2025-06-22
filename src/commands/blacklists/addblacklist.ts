import { InlineKeyboard } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey } from "../../utilities/session";

export const name: string = "addblacklist";
export const description: string = "Add a IP or a HWID to the blacklist.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  const keyboard = new InlineKeyboard()
    .text("Add IP", "blacklist:ip")
    .text("Add HWID", "blacklist:hwid")
    .row()
    .text("Add Region", "blacklist:region")
    .text("Add Country", "blacklist:country")
    .row()
    .text("Add ASN", "blacklist:asn")

  await ctx.reply("Please select the type of blacklist you want to add:", {
    reply_markup: keyboard,
  });
}