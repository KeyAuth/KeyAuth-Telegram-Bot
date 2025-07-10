import { Context, InlineKeyboard } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey } from "../../utilities/session";
import { Request } from "../../utilities/session";
import { stateManager } from "../../utilities/state";
import TelegramBot from "../../utilities/bot";

let sellerKey: string = "";
let expiry: number = 0;
let mask: string = "";

let botInstance: TelegramBot | null = null;

export const name: string = "create";
export const description: string = "Create a new license.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;
  botInstance = bot;

  sellerKey = sellerKeyGet;

  const storedMask = await bot.database.get(`masks.${userId}.${sellerKey}`);
  
  if (storedMask) {
    await ctx.reply(`You have a saved mask: \`${storedMask}\`\n\nWould you like to use this mask or create a new one?\n\nReply with "default" to use the saved mask, or provide a new mask pattern. "*" (STAR - SHIFT + 8) will generate a random character.`);
  } else {
    await ctx.reply(`What is the mask (layout) of the key? "*" (STAR - SHIFT + 8) will generate a random character.`);
  }

  stateManager.setWaitingForResponse(userId, "create_license_mask", handleMask);
};

async function handleMask(ctx: Context): Promise<void> {
  const maskRaw = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!maskRaw || !userId) {
    await ctx.reply("Please provide a valid mask.");
    return;
  }

  if (!botInstance) {
    await ctx.reply("Bot instance is not available. Please try again later.");
    return;
  }

  if (maskRaw.toLowerCase() === "default" || maskRaw.toLowerCase() === "use default" || maskRaw.toLowerCase() === "saved") {
    const storedMask = await botInstance.database.get(`masks.${userId}.${sellerKey}`);
    if (storedMask) {
      mask = storedMask;
    } else {
      await ctx.reply("No default mask found. Please provide a mask pattern.");
      return;
    }
  } else {
    mask = maskRaw;
    await botInstance.database.set(`masks.${userId}.${sellerKey}`, mask);
  }

  await ctx.reply(`Please provide the expiration (in days).`);

  stateManager.setWaitingForResponse(userId, "create_license_expiry", handleExpiry);
}

async function handleExpiry(ctx: Context): Promise<void> {
  const expiryRaw = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!expiryRaw || !userId) {
    await ctx.reply("Please provide a valid expiration in days.");
    return;
  }

  const expiryParsed = parseInt(expiryRaw, 10);
  if (isNaN(expiryParsed) || expiryParsed <= 0) {
    await ctx.reply("Please provide a valid number of days for expiration.");
    return;
  }

  expiry = expiryParsed;

  await ctx.reply(`What should the character for the mask be? (1 = upper/lowercase, 2 = uppercase, 3 = lowercase).`)

  stateManager.setWaitingForResponse(userId, "create_license_mask_char", handleMaskChar);
}

async function handleMaskChar(ctx: Context): Promise<void> {
  const maskCharRaw = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!maskCharRaw || !userId) {
    await ctx.reply("Please provide a valid character type.");
    return;
  }

  const maskChar = parseInt(maskCharRaw, 10);
  if (isNaN(maskChar) || maskChar < 1 || maskChar > 3) {
    await ctx.reply("Please provide a valid character type (1, 2, or 3).");
    return;
  }

  const response = await Request({
    sellerkey: sellerKey,
    type: "add",
    expiry: expiry,
    mask: mask,
    character: maskCharRaw,
    format: "JSON"
  })

  if (!response.success) {
    await ctx.reply(`❌ Error: ${response.message}`);
    return;
  }

  const esc = (text: any) => {
    if (!text) return "";
    return text.toString().replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&");
  };

  await ctx.reply(`✅ License created successfully${esc("!")}\n\n\`${esc(response.key)}\``, { parse_mode: "MarkdownV2" });
}