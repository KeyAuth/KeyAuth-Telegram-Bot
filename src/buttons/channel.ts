import { Context, InlineKeyboard } from "grammy";
import { type Execute } from "../interfaces/Button";
import { GetSellerKey, Request } from "../utilities/session";
import { stateManager } from "../utilities/state";

export const name: string = "channel";
export const cooldown: number = 0;
export const execute: Execute = async (ctx: Context, bot, args) => {
  await ctx.answerCallbackQuery();
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  if (!args || args.length === 0) {
    await ctx.reply("Error: No blacklist type provided.");
    return;
  }

  const type = args[0] as string;
  const data = args[1] as string;

  switch (type) {
    // Delete channel
    case "del":
      const keyboard = new InlineKeyboard()
        .text("Confirm Deletion", `channel:del-confirm:${data}`)
        .text("Cancel", `channel:del-cancel:${data}`);

      await ctx.editMessageText(
        `Are you sure you want to delete the channel: ${data}?`,
        { reply_markup: keyboard }
      );
      break;
    case "del-confirm":
      await ctx.editMessageText("⏳ Deleting channel...");

      const response = await Request({
        sellerkey: sellerKeyGet,
        type: "delchannel",
        name: data,
      });

      if (!response.success) {
        await ctx.editMessageText(
          `❌ Error: ${response.message}`
        );
        return;
      } else {
        await ctx.editMessageText(
          `✅ Channel ${data} deleted successfully.`
        );
      }

      break;

    case "del-cancel":
      await ctx.editMessageText("❌ Deletion of channel cancelled.");
      break;

    // Purge Channel
    case "purge":
      const purgeKeyboard = new InlineKeyboard()
        .text("Confirm Purge", `channel:purge-confirm:${data}`)
        .text("Cancel", `channel:purge-cancel:${data}`);

      await ctx.editMessageText(
        `Are you sure you want to purge the channel: ${data}?`,
        { reply_markup: purgeKeyboard }
      );
      break;

    case "purge-confirm":
      await ctx.editMessageText("⏳ Purging channel...");
      const purgeResponse = await Request({
        sellerkey: sellerKeyGet,
        type: "clearchannel",
        name: data,
      });

      if (!purgeResponse.success) {       
        await ctx.editMessageText(
          `❌ Error: ${purgeResponse.message}`
        );
        return;
      }
      await ctx.editMessageText(
        `✅ Channel ${data} purged successfully.`
      );
      break;

    case "purge-cancel":
      await ctx.editMessageText("❌ Purge of channel cancelled.");
      break;

    // Edit channel
    case "edit":
      await ctx.reply(`What would you like to set the delay to for channel: ${data}? (In seconds)`);
      
      if (ctx.from && ctx.from.id) {
        stateManager.setWaitingForResponse(
          ctx.from.id,
          "edit_channel_delay",
          async (responseCtx: Context) => {
            const delay = responseCtx.message?.text;
            const userId = responseCtx.from?.id;
            if (!delay || isNaN(Number(delay)) || !userId) {
              await responseCtx.reply("Please provide a valid delay in seconds.");
              return;     
            }
            const delayResponse = await Request({
              sellerkey: sellerKeyGet,
              type: "editchan",
              name: data,
              delay: Number(delay),
            });
            if (!delayResponse.success) {
              await responseCtx.reply(`❌ Error: ${delayResponse.message}`);
              return;
            } else {
              await responseCtx.reply(
                `✅ Channel delay set successfully to: ${delay} seconds.`
              );
              stateManager.clearState(userId);
            }
          }
        );
      } else {
        await ctx.reply("Sorry, I couldn't identify you. Please try again later.");
      }
      break;

    default:
      await ctx.reply("Error: Invalid channel action specified.");
      break;
  }
};