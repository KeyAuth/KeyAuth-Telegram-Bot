import { Bot } from "grammy";
import { MakeRequest } from "../../utility";

export const RetrieveAllWebLoaderButtons = (bot: Bot) => {
    bot.command("RetrieveAllWebLoaderButtons", async (ctx) => {
      const input = ctx.message?.text;
      if (!input) {
        await ctx.reply("No command detected");
        return;
      }
  
      MakeRequest(
        ctx,
        {
          type: "fetchallbuttons",
        },
        "Error fetching all web loader buttons:",
        "An error occurred while fetching all webhooks."
      );
    });
  };
  