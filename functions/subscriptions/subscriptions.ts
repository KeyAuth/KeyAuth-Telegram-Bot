import { Bot } from "grammy";
import { MakeRequest } from "../../utility";

export const RetrieveAllSubscriptions = (bot: Bot) => {
  bot.command("RetrieveAllSubscriptions", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    MakeRequest(
      ctx,
      {
        type: "fetchallsubs",
      },
      "Error fetching all subscriptions:",
      "An error occurred while fetching all subscriptions."
    );
  });
};
