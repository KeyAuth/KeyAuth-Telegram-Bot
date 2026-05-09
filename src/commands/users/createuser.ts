import { Context, InlineKeyboard } from "grammy";
import { type Execute } from "../../interfaces/Command";
import { GetSellerKey } from "../../utilities/session";
import { Request } from "../../utilities/session";
import { stateManager } from "../../utilities/state";
import { setUserCreationData } from "../../buttons/createuser_hwid";

// Store user creation data per userId
const userCreationData = new Map<
  number,
  { sellerKey: string; username: string; password: string; expiration: number }
>();

export const name: string = "createuser";
export const description: string = "Create a new user.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  // Initialize user data
  userCreationData.set(userId, {
    sellerKey: sellerKeyGet,
    username: "",
    password: "",
    expiration: 0,
  });

  await ctx.reply(`Please provide the username for the new user.`);

  stateManager.setWaitingForResponse(
    userId,
    "createuser_username",
    handleUsername,
  );
};

async function handleUsername(ctx: Context): Promise<void> {
  const usernameRaw = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!usernameRaw || !userId) {
    await ctx.reply("Please provide a valid username.");
    return;
  }

  const userData = userCreationData.get(userId);
  if (userData) {
    userData.username = usernameRaw;
  }

  await ctx.reply(`Please provide the password for the new user.`);

  stateManager.setWaitingForResponse(
    userId,
    "createuser_password",
    handlePassword,
  );
}

async function handlePassword(ctx: Context): Promise<void> {
  const passwordRaw = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!passwordRaw || !userId) {
    await ctx.reply("Please provide a valid password.");
    return;
  }

  const userData = userCreationData.get(userId);
  if (userData) {
    userData.password = passwordRaw;
  }

  await ctx.reply(`Please provide an expiration (in days).`);

  stateManager.setWaitingForResponse(
    userId,
    "createuser_expiration",
    handleExpiration,
  );
}

async function handleExpiration(ctx: Context): Promise<void> {
  const expirationRaw = ctx.message?.text;
  const userId = ctx.from?.id;

  if (!expirationRaw || !userId) {
    await ctx.reply("Please provide a valid expiration in days.");
    return;
  }

  const expirationParsed = parseInt(expirationRaw, 10);
  if (isNaN(expirationParsed) || expirationParsed <= 0) {
    await ctx.reply("Please provide a valid number of days for expiration.");
    return;
  }

  const userData = userCreationData.get(userId);
  if (userData) {
    userData.expiration = expirationParsed;
    // Store in the button module for callback handling
    setUserCreationData(userId, userData);
  }

  await ctx.reply(`Can the user use their credentials on multiple devices?`, {
    reply_markup: new InlineKeyboard()
      .text("Yes", "createuser_hwid:1")
      .text("No", "createuser_hwid:0"),
  });

  stateManager.setWaitingForResponse(userId, "createuser_hwid", handleHwid);
}

async function handleHwid(ctx: Context): Promise<void> {
  const hwidRaw = ctx.message?.text?.toLowerCase();
  const userId = ctx.from?.id;

  if (!userId) return;

  // Default to "1" (Yes) unless explicitly "no" or "0"
  let hwidAffected = "1";
  if (hwidRaw === "no" || hwidRaw === "0") {
    hwidAffected = "0";
  }

  await createUser(ctx, userId, hwidAffected);
}

async function createUser(
  ctx: Context,
  userId: number,
  hwidAffected: string,
): Promise<void> {
  const userData = userCreationData.get(userId);
  if (!userData) {
    await ctx.reply(
      "Error: User creation session expired. Please start again with /createuser",
    );
    return;
  }

  const response = await Request({
    sellerkey: userData.sellerKey,
    type: "adduser",
    user: userData.username,
    pass: userData.password,
    expiry: userData.expiration.toString(),
    hwidAffected: hwidAffected,
  });

  // Clean up stored data
  userCreationData.delete(userId);

  if (!response.success) {
    await ctx.reply(`❌ Error: ${response.message}`);
    return;
  }

  await ctx.reply(
    `✅ User created successfully! Username: ${userData.username}`,
  );
}
