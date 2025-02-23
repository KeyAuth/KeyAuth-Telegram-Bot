import { Bot } from "grammy";
import { MakeRequest } from "../../utility";

export const AddApplicationHash = (bot: Bot): void => {
  bot.command("AddApplicationHash", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    const args = input.split(" ").slice(1);
    const hash = args[0];
    if (!hash) {
      await ctx.reply("Missing MD5 hash");
      return;
    }

    await MakeRequest(
      ctx,
      { type: "addhash", hash: hash },
      "Error adding hash:",
      "An error occurred while adding the hash."
    );
  });
};

export const EditApplicationSettings = (bot: Bot) => {
  bot.command("EditApplicationSettings", (ctx) => {
    ctx.reply("This function is not implemented yet.");
  });
};

export const RetrieveApplicationDetails = (bot: Bot): void => {
  bot.command("RetrieveApplicationDetails", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    await MakeRequest(
      ctx,
      { 
        type: "appdetails", 
      },
      "Error adding hash:",
      "An error occurred while adding the hash."
    );
  });
};

export const RetrieveApplicationSettings = (bot: Bot) => {
  bot.command("RetrieveApplicationSettings", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    await MakeRequest(
      ctx,
      { type: "getsettings" },
      "Error retrieving application settings:",
      "An error occurred while retrieving application settings."
    );
  });
};

export const PauseApplication = (bot: Bot) => {
  bot.command("PauseApplication", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    MakeRequest(
      ctx,
      { type: "pauseapp" },
      "Error pausing application:",
      "An error occurred while pausing the application."
    );
  });
};

export const UnpauseApplication = (bot: Bot) => {
  bot.command("UnpauseApplication", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    MakeRequest(
      ctx,
      { type: "unpauseapp" },
      "Error unpausing application:",
      "An error occurred while unpausing the application."
    );
  });
};

export const ResetApplicationHash = (bot: Bot) => {
  bot.command("ResetApplicationHash", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    MakeRequest(
      ctx,
      { type: "resethash" },
      "Error resetting application hash:",
      "An error occurred while resetting the application hash."
    );
  });
};
