import { Bot } from "grammy";
import { MakeRequest } from "../../utility";

export const AddTimeToAllUnusedLicenses = (bot: Bot) => {
  bot.command("AddTimeToAllUnusedLicenses", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    MakeRequest(
      ctx,
      {
        type: "addtime",
      },
      "Error adding time to all unused licenses:",
      "An error occurred while adding time to all unused licenses."
    );
  });
};

export const DeleteAllLicenses = (bot: Bot) => {
  bot.command("DeleteAllLicenses", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    MakeRequest(
      ctx,
      {
        type: "delalllicenses",
      },
      "Error deleting all licenses:",
      "An error occurred while deleting all licenses."
    );
  });
};

export const DeleteAllUsedLicenses = (bot: Bot) => {
  bot.command("DeleteAllUsedLicenses", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    MakeRequest(
      ctx,
      {
        type: "delused",
      },
      "Error deleting all used licenses:",
      "An error occurred while deleting all used licenses."
    );
  });
};

export const DeleteAllUnusedLicenses = (bot: Bot) => {
  bot.command("DeleteAllUnusedLicenses", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    MakeRequest(
      ctx,
      {
        type: "delunused",
      },
      "Error deleting all unused licenses:",
      "An error occurred while deleting all unused licenses."
    );
  });
};

export const RetrieveAllLicenses = (bot: Bot) => {
  bot.command("RetrieveAllLicenses", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    const args = input.split(" ").slice(1);
    const format = args[0];

    if (!format) {
      await ctx.reply("You must provide the format.");
      return;
    }

    MakeRequest(
      ctx,
      {
        type: "fetchallkeys",
        format: format,
      },
      "Error fetching all licenses:",
      "An error occurred while fetching all licenses."
    );
  });
};
