import { Bot } from "grammy";
import { MakeRequest } from "../../utility";

export const DeleteExistingFile = (bot: Bot) => {
  bot.command("DeleteExistingFile", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    const args = input.split(" ").slice(1);
    const fileid = args[0];

    if (!fileid) {
      await ctx.reply("You must provide the fiel ID.");
      return;
    }

    MakeRequest(
      ctx,
      {
        type: "delfile",
        fileid: fileid,
      },
      "Error deleting the file:",
      "An error occurred while deleting the file."
    );
  });
};

export const DeleteAllFiles = (bot: Bot) => {
  bot.command("DeleteAllFiles", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    MakeRequest(
      ctx,
      {
        type: "delallfiles",
      },
      "Error deleting all files",
      "An error occurred while deleting all files."
    );
  });
};

export const RetrieveAllFiles = (bot: Bot) => {
  bot.command("RetrieveAllFiles", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    MakeRequest(
      ctx,
      {
        type: "fetchallfiles",
      },
      "Error fetching all files:",
      "An error occurred while fetching all files."
    );
  });
};

export const RetrieveExistingFile = (bot: Bot) => {
  bot.command("RetrieveExistingFile", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    const args = input.split(" ").slice(1);
    const id = args[0];

    if (!id) {
      await ctx.reply("You must provide the file ID.");
      return;
    }

    MakeRequest(
      ctx,
      {
        type: "fetchfile",
        id: id,
      },
      "Error fetching file:",
      "An error occurred while fetching file."
    );
  });
};

export const EditExistingFile = (bot: Bot) => {
  bot.command("EditExistingFile", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    const args = input.split(" ").slice(1);
    const id = args[0];
    const url = args[1];
    const authed = args[2];

    if (!id) {
      await ctx.reply("You must provide the file ID.");
      return;
    }

    if (!url) {
      await ctx.reply("You must provide the file URL.");
      return;
    }

    if (!authed) {
      await ctx.reply("You must provide the file authentication status.");
      return;
    }

    MakeRequest(
      ctx,
      {
        type: "editfile",
        id: id,
        url: url,
        authed: authed,
      },
      "Error editing the file:",
      "An error occurred while editing the file."
    );
  });
};

export const UploadNewFile = (bot: Bot) => {
  bot.command("UploadNewFile", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    const args = input.split(" ").slice(1);
    const url = args[0];

    if (!url) {
      await ctx.reply("You must provide the file URL.");
      return;
    }

    MakeRequest(
      ctx,
      {
        type: "upload",
        url: url,
      },
      "Error adding file:",
      "An error occurred while adding file."
    );
  });
};
