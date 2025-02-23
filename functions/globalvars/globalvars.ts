import { Bot } from "grammy";
import { MakeRequest } from "../../utility";

export const CreateNewGlobalVar = (bot: Bot) => {
  bot.command("CreateNewGlobalVar", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    const args = input.split(" ").slice(1);
    const name = args[0];
    const data = args[1];
    const authed = args[2];

    if (!name) {
      await ctx.reply("You must provide the name of the global variable.");
      return;
    }

    if (!data) {
      await ctx.reply("You must provide the data of the global variable.");
      return;
    }

    if (!authed) {
      await ctx.reply(
        "You must provide the authentication status of the global variable."
      );
      return;
    }

    MakeRequest(
      ctx,
      {
        type: "addvar",
        name: name,
        data: data,
        authed: authed,
      },
      "Error adding new global variable:",
      "An error occurred while adding new global variable."
    );
  });
};

export const DeleteGlobalVar = (bot: Bot) => {
  bot.command("DeleteGlobalVar", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    const args = input.split(" ").slice(1);
    const name = args[0];

    if (!name) {
      await ctx.reply("You must provide the name of the global variable.");
      return;
    }

    MakeRequest(
      ctx,
      {
        type: "delvar",
        name: name,
      },
      "Error deleting the global variable:",
      "An error occurred while deleting the global variable."
    );
  });
};

export const DeleteAllGlobalVars = (bot: Bot) => {
  bot.command("DeleteAllGlobalVars", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    MakeRequest(
      ctx,
      {
        type: "delallvars",
      },
      "Error deleting all global variables:",
      "An error occurred while deleting all global variables."
    );
  });
};

export const EditExistingGlobalVar = (bot: Bot) => {
  bot.command("EditExistingGlobalVar", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    const args = input.split(" ").slice(1);
    const varid = args[0];
    const data = args[1];

    if (!varid) {
      await ctx.reply("You must provide the ID of the global variable.");
      return;
    }

    if (!data) {
      await ctx.reply("You must provide the data of the global variable.");
      return;
    }

    MakeRequest(
      ctx,
      {
        type: "editvar",
        varid: varid,
        data: data,
      },
      "Error editing global variable:",
      "An error occurred while editing global variable."
    );
  });
};

export const RetrieveAllGlobalVars = (bot: Bot) => {
  bot.command("RetrieveAllGlobalVars", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    MakeRequest(
      ctx,
      {
        type: "fetchallvars",
      },
      "Error fetching all global variables:",
      "An error occurred while fetching all global variables."
    );
  });
};

export const RetrieveGlobalVar = (bot: Bot) => {
  bot.command("RetrieveGlobalVar", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    const args = input.split(" ").slice(1);
    const name = args[0];

    if (!name) {
      await ctx.reply("You must provide the name of the global variable.");
      return;
    }

    MakeRequest(
      ctx,
      {
        type: "retrvvar",
        name: name,
      },
      "Error fetching global variable:",
      "An error occurred while fetching global variable."
    );
  });
};
