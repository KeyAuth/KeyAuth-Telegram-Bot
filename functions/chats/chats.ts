import { Bot } from "grammy";
import { env } from "../../utility";
import axiosInstance from "../../utility";

export const CreateNewChatChannel = (bot: Bot) => {
  bot.command("CreateNewChatChannel", (ctx) => {
    ctx.reply("This function is not implemented yet.");
  });
};

export const DeleteChannelMessages = (bot: Bot) => {
  bot.command("DeleteChannelMessages", (ctx) => {
    ctx.reply("This function is not implemented yet.");
  });
};

export const DeleteExistingChannel = (bot: Bot) => {
  bot.command("DeleteExistingChannel", (ctx) => {
    ctx.reply("This function is not implemented yet.");
  });
};

export const EditExistingChannel = (bot: Bot) => {
  bot.command("EditExistingChannel", (ctx) => {
    ctx.reply("This function is not implemented yet.");
  });
};

export const RetrieveAllMutes = (bot: Bot) => {
  bot.command("RetrieveAllMutes", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    try {
      const response = await axiosInstance.get("", {
        params: {
          type: "fetchallmutes",
        },
      });
      const data = response.data;

      let message = "Response:\n";
      Object.entries(data).forEach(([key, value]) => {
        message += `${key}: ${value}\n`;
      });

      await ctx.reply(message);
    } catch (error) {
      console.error("Error fetching all mutes:", error);
      await ctx.reply("An error occurred while fetching all mutes.");
    }
  });
};

export const RetrieveAllChatChannels = (bot: Bot) => {
  bot.command("RetrieveAllChatChannels", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    try {
      const response = await axiosInstance.get("", {
        params: {
          type: "fetchallchats",
        },
      });
      const data = response.data;

      let message = "Response:\n";
      Object.entries(data).forEach(([key, value]) => {
        message += `${key}: ${value}\n`;
      });

      await ctx.reply(message);
    } catch (error) {
      console.error("Error fetching all chats:", error);
      await ctx.reply("An error occurred while fetching all chats.");
    }
  });
};

export const MuteAUser = (bot: Bot) => {
  bot.command("MuteAUser", (ctx) => {
    ctx.reply("This function is not implemented yet.");
  });
};

export const UnmuteAUser = (bot: Bot) => {
  bot.command("UnmuteAUser", (ctx) => {
    ctx.reply("This function is not implemented yet.");
  });
};
