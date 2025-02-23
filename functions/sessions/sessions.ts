import { Bot } from "grammy";
import { MakeRequest } from "../../utility";

export const EndAllSessions = (bot: Bot) => {
  bot.command("EndAllSessions", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    MakeRequest(
      ctx,
      {
        type: "killall",
      },
      "Error killing all sessions:",
      "An error occurred while killing all sessions."
    );
  });
};

export const RetrieveAllSessions = (bot: Bot) => {
  bot.command("RetrieveAllSessions", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    MakeRequest(
      ctx,
      {
        type: "fetchallsessions",
      },
      "Error fetching all sessions:",
      "An error occurred while fetching all sessions."
    );
  });
};
