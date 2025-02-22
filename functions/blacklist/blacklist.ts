import { Bot } from "grammy";
import { env } from "../../utility";
import axiosInstance from "../../utility";

export const CreateNewBlacklist = (bot: Bot) => {
  bot.command("CreateNewBlacklist", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    const args = input.split(" ").slice(1);
    const ip = args[0];
    const hwid = args[1];
    const region = args[2];
    const country = args[3];
    const asn = args[4];
    const reason = args[5];

    if (!ip && !hwid && !region && !country && !asn) {
      await ctx.reply(
        "You must provide at least one: IP, hwid, region, country, or ASN"
      );
      return;
    }

    if (!reason) {
      await ctx.reply("You must provide a reason");
      return;
    }

    try {
      const response = await axiosInstance.get("", {
        params: {
          type: "black",
          ip: ip,
          hwid: hwid,
          region: region,
          country: country,
          asn: asn,
          reason: reason,
        },
      });
      const data = response.data;

      let message = "Response:\n";
      Object.entries(data).forEach(([key, value]) => {
        message += `${key}: ${value}\n`;
      });

      await ctx.reply(message);
    } catch (error) {
      console.error("Error adding new blacklist:", error);
      await ctx.reply("An error occurred while adding new blacklist.");
    }
  });
};

export const DeleteExistingBlacklist = (bot: Bot) => {
  bot.command("DeleteExistingBlacklist", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    const args = input.split(" ").slice(1);
    const dataType = args[0];
    const blacktype = args[1];

    if (!dataType) {
      await ctx.reply(
        "You must provide the data that is being deleted. Ex: 1.1.1.1 for an IP"
      );
      return;
    }

    if (!blacktype) {
      await ctx.reply(
        "You must provide either 'ip', 'hwid', 'region', 'country', or 'asn' as the value."
      );
      return;
    }

    try {
      const response = await axiosInstance.get("", {
        params: {
          type: "delblack",
          data: dataType,
          blacktype: blacktype,
        },
      });
      const data = response.data;

      let message = "Response:\n";
      Object.entries(data).forEach(([key, value]) => {
        message += `${key}: ${value}\n`;
      });

      await ctx.reply(message);
    } catch (error) {
      console.error("Error adding deleting blacklist:", error);
      await ctx.reply("An error occurred while deleting blacklist.");
    }
  });
};

export const DeleteAllBlacklists = (bot: Bot) => {
  bot.command("DeleteAllBlacklists", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    try {
      const response = await axiosInstance.get("", {
        params: {
          type: "delblacks",
        },
      });
      const data = response.data;

      let message = "Response:\n";
      Object.entries(data).forEach(([key, value]) => {
        message += `${key}: ${value}\n`;
      });

      await ctx.reply(message);
    } catch (error) {
      console.error("Error deleting all blacklists:", error);
      await ctx.reply("An error occurred while deleting all blacklists.");
    }
  });
};

export const RetrieveAllBlacklists = (bot: Bot) => {
  bot.command("RetrieveAllBlacklists", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    try {
      const response = await axiosInstance.get("", {
        params: {
          type: "fetchallblacks",
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
