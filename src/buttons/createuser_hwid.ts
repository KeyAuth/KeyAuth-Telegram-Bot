import { Context } from "grammy";
import { type Execute } from "../interfaces/Button";
import { Request } from "../utilities/session";
import { stateManager } from "../utilities/state";

// Store user creation data per userId
const userCreationData = new Map<
  number,
  { sellerKey: string; username: string; password: string; expiration: number }
>();

export function setUserCreationData(
  userId: number,
  data: {
    sellerKey: string;
    username: string;
    password: string;
    expiration: number;
  },
) {
  userCreationData.set(userId, data);
}

export const name: string = "createuser_hwid";
export const cooldown: number = 0;
export const execute: Execute = async (ctx: Context, bot, args) => {
  await ctx.answerCallbackQuery();
  const userId = ctx.from?.id;
  if (!userId) return;

  // Clear the waiting state since we got a button response
  stateManager.clearState(userId);

  if (!args || args.length === 0) {
    await ctx.reply("Error: No HWID option provided.");
    return;
  }

  const hwidAffected = args[0] as string;
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
    sub: "default",
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
};
