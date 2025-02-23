import { Bot } from "grammy";
import { MakeRequest } from "../../utility";

export const DeleteAllWebhooks = (bot: Bot) => {
  bot.command("DeleteAllWebhooks", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    MakeRequest(
      ctx,
      {
        type: "delallwebhooks",
      },
      "Error deleting all webhooks:",
      "An error occurred while deleting all webhooks."
    );
  });
};

export const RetrieveAllWebhooks = (bot: Bot) => {
  bot.command("RetrieveAllWebhooks", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    MakeRequest(
      ctx,
      {
        type: "fetchallwebhooks",
      },
      "Error fetching all webhooks:",
      "An error occurred while fetching all webhooks."
    );
  });
};
