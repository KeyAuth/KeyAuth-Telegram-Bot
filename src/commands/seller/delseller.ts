import { InlineKeyboard } from "grammy";
import { type Execute } from "../../interfaces/Command";

export const name: string = "delseller";
export const description: string = "Delete one of your applications";
export const cooldown: number = 10;
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;

  const applications = await bot.database.get(`applications.${userId}`) || [];
  const currentApp = await bot.database.get(`selectedapp.${userId}`);

  const keyboard = new InlineKeyboard();
  
  for (let i = 0; i < applications.length; i += 2) {
    const app1 = applications[i];
    const app2 = applications[i + 1];
    
    if (app2) {
      keyboard.text(app1.name, `delseller:${app1.sellerkey}`).text(app2.name, `delseller:${app2.sellerkey}`);
    } else {
      keyboard.text(app1.name, `delseller:${app1.sellerkey}`);
    }
    
    if (i < applications.length - 2) {
      keyboard.row();
    }
  }
  
  await ctx.reply("Please click on one of your applications to delete it.", { reply_markup: keyboard });
}