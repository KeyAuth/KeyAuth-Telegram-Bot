import { Bot } from "grammy";
import { MakeRequest } from "../../utility";

export const DeleteAllExpiredUsers = (bot: Bot) => {
  bot.command("DeleteAllExpiredUsers", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    MakeRequest(
      ctx,
      {
        type: "delexpusers",
      },
      "Error deleting all expired users:",
      "An error occurred while deleting all expired users."
    );
  });
};

export const DeleteAllUsers = (bot: Bot) => {
  bot.command("DeleteAllUsers", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    MakeRequest(
      ctx,
      {
        type: "delallusers",
      },
      "Error deleting all users:",
      "An error occurred while deleting all users."
    );
  });
};

export const RetrieveAllUsers = (bot: Bot) => {
  bot.command("RetrieveAllUsers", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    MakeRequest(
      ctx,
      {
        type: "fetchallusers",
      },
      "Error retrieving all users:",
      "An error occurred while retrieving all users."
    );
  });
};

export const RetrieveAllUserVariables = (bot: Bot) => {
  bot.command("RetrieveAllUserVariables", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    MakeRequest(
      ctx,
      {
        type: "fetchalluservars",
      },
      "Error retrieving all users variables:",
      "An error occurred while retrieving all users variables."
    );
  });
};

export const RetrieveAllUsernames = (bot: Bot) => {
  bot.command("RetrieveAllUsernames", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    MakeRequest(
      ctx,
      {
        type: "fetchallusernames",
      },
      "Error retrieving all usernames:",
      "An error occurred while retrieving all usernames."
    );
  });
};

export const RetrieveAllUserSubscriptions = (bot: Bot) => {
  bot.command("RetrieveAllUserSubscriptions", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    MakeRequest(
      ctx,
      {
        type: "countsubs",
      },
      "Error retrieving all user subscriptions:",
      "An error occurred while retrieving all user subscriptions."
    );
  });
};

export const ResetAllUsersHWID = (bot: Bot) => {
  bot.command("ResetAllUsersHWID", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    MakeRequest(
      ctx,
      {
        type: "resetalluser",
      },
      "Error resetting all users HWID:",
      "An error occurred while resetting all users HWID."
    );
  });
};
