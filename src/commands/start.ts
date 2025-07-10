import { type Execute } from "../interfaces/Command";

export const name: string = "start";
export const description: string = "Start the bot and get help.";
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;
  const sellerKeys = await bot.database.get(`applications.${userId}`);

  if (!sellerKeys) {
    await ctx.reply(`Welcome to the KeyAuth Seller API bot!\n\nTo get started, please run the /setseller command to set up your first application!`)
  } else {
    await ctx.reply(`It appears you already have an application setup.\n\nTo select an application, use the /setseller command.`);
  }
}