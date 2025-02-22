import { Bot } from "grammy";
import { env } from "../../utility";
import axiosInstance from "../../utility";

export const DeleteExistingFile = (bot: Bot) => {
  bot.command("DeleteExistingFile", (ctx) => {
    ctx.reply("App function is working!");
  });
};

export const DeleteAllFiles = (bot: Bot) => {
  bot.command("DeleteAllFiles", async (ctx) => {
    const type = `delallfiles`;

    try {
      const response = await axiosInstance.get(type);
      const data = response.data;

      let message = "Application Settings: \n";

      Object.entries(data).forEach(([key, value]) => {
        message += `${key}: ${value}\n`;
      });

      ctx.reply(message);
    } catch (error) {
      ctx.reply(`An unknown error occurred. Please try again later.`);
    }
  });
};

export const RetrieveAllFiles = (bot: Bot) => {
  bot.command("RetrieveAllFiles", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    try {
      const response = await axiosInstance.get("", {
        params: {
          type: "fetchallfiles",
        },
      });
      const data = response.data;

      let message = "Response:\n";
      Object.entries(data).forEach(([key, value]) => {
        message += `${key}: ${value}\n`;
      });

      await ctx.reply(message);
    } catch (error) {
      console.error("Error fetching all files:", error);
      await ctx.reply("An error occurred while fetching all files.");
    }
  });
};

export const RetrieveExistingFile = (bot: Bot) => {
  bot.command("RetrieveExistingFile", (ctx) => {
    ctx.reply("This function is not implemented yet.");
  });
};

export const EditExistingFile = (bot: Bot) => {
  bot.command("EditExistingFile", (ctx) => {
    ctx.reply("This function is not implemented yet.");
  });
};

export const UploadNewFile = (bot: Bot) => {
  bot.command("UploadNewFile", (ctx) => {
    ctx.reply("This function is not implemented yet.");
  });
};
