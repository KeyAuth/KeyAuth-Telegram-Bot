import { InlineKeyboard } from "grammy";
import { type Execute } from "../../interfaces/Command";

export const name: string = "setseller";
export const description: string = "View all of your applications or create a new one";
export const cooldown: number = 10;
export const execute: Execute = async (ctx, bot) => {
  const userId = ctx.from?.id;

  const applications = await bot.database.get(`applications.${userId}`) || [];
  const currentApp = await bot.database.get(`selectedapp.${userId}`);

  const keyboard = new InlineKeyboard();
  
  for (let i = 0; i < applications.length; i += 2) {
    const app1 = applications[i];
    const app2 = applications[i + 1];
    
    const app1Text = app1.sellerkey === currentApp ? `${app1.name} (Selected)` : app1.name;
    
    if (app2) {
      const app2Text = app2.sellerkey === currentApp ? `${app2.name} (Selected)` : app2.name;
      
      keyboard.text(app1Text, `setseller:${app1.sellerkey}`).text(app2Text, `setseller:${app2.sellerkey}`);
    } else {
      keyboard.text(app1Text, `setseller:${app1.sellerkey}`);
    }
    
    if (i < applications.length - 2) {
      keyboard.row();
    }
  }
  
  keyboard.row().text("Create new application", "create_application");
  await ctx.reply("Please click on one of your applications to select it.", { reply_markup: keyboard });
}