import { Bot } from "grammy";
import axiosInstance from "../../utility";

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

    try {
      const response = await axiosInstance.get("", {
        params: {
          type: "addhash",
          hash: hash,
        },
      });
      const data = response.data;

      let message = "Response:\n";
      Object.entries(data).forEach(([key, value]) => {
        message += `${key}: ${value}\n`;
      });

      await ctx.reply(message);
    } catch (error) {
      console.error("Error adding hash:", error);
      await ctx.reply("An error occurred while adding the hash.");
    }
  });
};

export const EditApplicationSettings = (bot: Bot) => {
  bot.command("EditApplicationSettings", (ctx) => {
    ctx.reply("This function is not implemented yet.");
  });
};

export const RetrieveApplicationSettings = (bot: Bot) => {
  bot.command("RetrieveApplicationSettings", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    try {
      const response = await axiosInstance.get("", {
        params: {
          type: "getsettings",
        },
      });
      const data = response.data;

      let message = "Response:\n";
      Object.entries(data).forEach(([key, value]) => {
        message += `${key}: ${value}\n`;
      });

      await ctx.reply(message);
    } catch (error) {
      console.error("Error retrieving settings:", error);
      await ctx.reply("An error occurred while retrieving settings");
    }
  });
};

export const PauseApplication = (bot: Bot) => {
  bot.command("PauseApplication", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    try {
      const response = await axiosInstance.get("", {
        params: {
          type: "pauseapp",
        },
      });
      const data = response.data;

      let message = "Response:\n";
      Object.entries(data).forEach(([key, value]) => {
        message += `${key}: ${value}\n`;
      });

      await ctx.reply(message);
    } catch (error) {
      console.error("Error pausing application:", error);
      await ctx.reply("An error occurred while pausing the application.");
    }
  });
};

export const UnpauseApplication = (bot: Bot) => {
  bot.command("UnpauseApplication", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    try {
      const response = await axiosInstance.get("", {
        params: {
          type: "unpauseapp",
        },
      });
      const data = response.data;

      let message = "Response:\n";
      Object.entries(data).forEach(([key, value]) => {
        message += `${key}: ${value}\n`;
      });

      await ctx.reply(message);
    } catch (error) {
      console.error("Error unpausing application:", error);
      await ctx.reply("An error occurred while unpausing the application.");
    }
  });
};

export const ResetApplicationHash = (bot: Bot) => {
  bot.command("ResetApplicationHash", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    try {
      const response = await axiosInstance.get("", {
        params: {
          type: "resethash",
        },
      });
      const data = response.data;

      let message = "Response:\n";
      Object.entries(data).forEach(([key, value]) => {
        message += `${key}: ${value}\n`;
      });

      await ctx.reply(message);
    } catch (error) {
      console.error("Error resetting hash:", error);
      await ctx.reply("An error occurred while resetting the hash.");
    }
  });
};
