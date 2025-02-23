import { Bot } from "grammy";
import { MakeRequest } from "../../utility";

export const CreateNewChatChannel = (bot: Bot) => {
  bot.command("CreateNewChatChannel", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    const args = input.split(" ").slice(1);
    const name = args[0];
    const delay = args[1];

    if (!name) {
      await ctx.reply("You must provide the chat name.");
      return;
    }

    if (!delay) {
      await ctx.reply("You must provide the delay between messages sent.");
      return;
    }

    MakeRequest(
      ctx,
      {
        type: "addchannel",
        name: name,
        delay: delay,
      },
      "Error adding chat channel:",
      "An error occurred while adding chat channel."
    );
  });
};

export const DeleteChannelMessages = (bot: Bot) => {
  bot.command("DeleteChannelMessages", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    const args = input.split(" ").slice(1);
    const name = args[0];

    if (!name) {
      await ctx.reply("You must provide the chat name.");
      return;
    }

    MakeRequest(
      ctx,
      {
        type: "clearchannel",
        name: name,
      },
      "Error deleting channel messages:",
      "An error occurred while deleting chat messages."
    );
  });
};

export const DeleteExistingChannel = (bot: Bot) => {
  bot.command("DeleteExistingChannel", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    const args = input.split(" ").slice(1);
    const name = args[0];

    if (!name) {
      await ctx.reply("You must provide the chat name.");
      return;
    }

    MakeRequest(
      ctx,
      {
        type: "delchannel",
        name: name,
      },
      "Error deleting chat channel:",
      "An error occurred while deleting chat channel."
    );
  });
};

export const EditExistingChannel = (bot: Bot) => {
  bot.command("EditExistingChannel", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    const args = input.split(" ").slice(1);
    const name = args[0];
    const delay = args[1];

    if (!name) {
      await ctx.reply("You must provide the chat name.");
      return;
    }

    if (!delay) {
      await ctx.reply("You must provide the delay between messages sent.");
      return;
    }

    MakeRequest(
      ctx,
      {
        type: "editchan",
        name: name,
        delay: delay,
      },
      "Error editing chat channel:",
      "An error occurred while editing chat channel."
    );
  });
};

export const RetrieveAllMutes = (bot: Bot) => {
  bot.command("RetrieveAllMutes", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    MakeRequest(
      ctx,
      {
        type: "fetchallmutes",
      },
      "Error fetching all mutes:",
      "An error occurred while fetching all mutes."
    );
  });
};

export const RetrieveAllChatChannels = (bot: Bot) => {
  bot.command("RetrieveAllChatChannels", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    MakeRequest(
      ctx,
      {
        type: "fetchallchats",
      },
      "Error fetching all chat channels:",
      "An error occurred while fetching all chat channels."
    );
  });
};

export const MuteAUser = (bot: Bot) => {
  bot.command("MuteAUser", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    const args = input.split(" ").slice(1);
    const user = args[0];
    const time = args[1];

    if (!user) {
      await ctx.reply("You must provide the username of the user.");
      return;
    }

    if (!time) {
      await ctx.reply("You must provide the time for the mute.");
      return;
    }

    MakeRequest(
      ctx,
      {
        type: "muteuser",
        user: user,
        time: time,
      },
      "Error muting user:",
      "An error occurred while muting the user."
    );
  });
};

export const UnmuteAUser = (bot: Bot) => {
  bot.command("UnmuteAUser", async (ctx) => {
    const input = ctx.message?.text;
    if (!input) {
      await ctx.reply("No command detected");
      return;
    }

    const args = input.split(" ").slice(1);
    const user = args[0];

    if (!user) {
      await ctx.reply("You must provide the username of the user.");
      return;
    }

    MakeRequest(
      ctx,
      {
        type: "unmuteuser",
        user: user,
      },
      "Error unmuting user:",
      "An error occurred while unmuting the user."
    );
  });
};
