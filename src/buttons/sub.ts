import { Context, InlineKeyboard } from "grammy";
import { type Execute } from "../interfaces/Button";
import { GetSellerKey, Request } from "../utilities/session";
import { stateManager } from "../utilities/state";

export const name: string = "sub";
export const cooldown: number = 0;
export const execute: Execute = async (ctx: Context, bot, args) => {
  await ctx.answerCallbackQuery();
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  if (!args || args.length === 0) {
    await ctx.reply("Error: No subscription action provided.");
    return;
  }

  const type = args[0] as string;
  const data = args[1] as string;

  switch (type) {
    // Delete subscription
    case "del":
      const keyboard = new InlineKeyboard()
        .text("Confirm Deletion", `sub:del-confirm:${data}`)
        .text("Cancel", `sub:del-cancel:${data}`);

      await ctx.editMessageText(
        `Are you sure you want to delete the subscription: ${data}?`,
        { reply_markup: keyboard }
      );
      break;

    case "del-confirm":
      await ctx.editMessageText("⏳ Deleting subscription...");
      const delResponse = await Request({
        sellerkey: sellerKeyGet,
        type: "delappsub",
        name: data,
      });

      if (!delResponse.success) {
        await ctx.editMessageText(`❌ Error: ${delResponse.message}`);
        return;
      } else {
        await ctx.editMessageText(`✅ Subscription deleted successfully.`);
      }
      break;

    case "del-cancel":
      await ctx.editMessageText(`❌ Deletion of subscription has been cancelled.`);
      break;

    // Edit
    case "edit":
      await ctx.reply(`What would you like to set the level to for subscription: ${data}?`);
      
      if (ctx.from && ctx.from.id) {
        stateManager.setWaitingForResponse(
          ctx.from.id,
          "sub_edit",
          async (responseCtx: Context) => {
            const level = responseCtx.message?.text;
            const userId = responseCtx.from?.id;
            if (!level || isNaN(Number(level)) || !userId) {
              await responseCtx.editMessageText("Please provide a valid level in a number.");
              return;     
            }
            const levelResponse = await Request({
              sellerkey: sellerKeyGet,
              type: "editsub",
              name: data,
              level: Number(level),
            });

            if (!levelResponse.success) {
              await responseCtx.reply(`❌ Error: ${levelResponse.message}`);
              return;
            } else {
              await responseCtx.reply(
                `✅ Subscription level set successfully to: ${level}.`
              );
              stateManager.clearState(userId);
            }
          }
        );
      } else {
        await ctx.reply("Sorry, I couldn't identify you. Please try again later.");
      }
      break;

    // Pause / Unpause
    case "pause":
      const pauseKeyboard = new InlineKeyboard()
        .text("Pause", `sub:pause-pause:${data}`)
        .text("Unpause", `sub:pause-unpause:${data}`);

      await ctx.editMessageText(
        `Would you like to pause or unpause the subscription: ${data}?`,
        { reply_markup: pauseKeyboard }
      );
      break;
    
    case "pause-pause":
      await ctx.editMessageText("⏳ Pausing subscription...");
      const pauseResponse = await Request({
        sellerkey: sellerKeyGet,
        type: "pausesub",
        subscription: data,
      });
      if (!pauseResponse.success) {
        await ctx.editMessageText(`❌ Error: ${pauseResponse.message}`);
        return;
      } else {
        await ctx.editMessageText(`✅ Subscription paused successfully.`);
      }
      break;

    case "pause-unpause":
      await ctx.editMessageText("⏳ Unpausing subscription...");
      const unpauseResponse = await Request({
        sellerkey: sellerKeyGet,
        type: "unpausesub",
        subscription: data,
      });
      if (!unpauseResponse.success) {
        await ctx.editMessageText(`❌ Error: ${unpauseResponse.message}`);
        return;
      } else {
        await ctx.editMessageText(`✅ Subscription unpaused successfully.`);
      }
      break;

    // Count users
    case "count":
      const countResponse = await Request({
        sellerkey: sellerKeyGet,
        type: "countsubs",
        name: data,
      });

      if (!countResponse.success) {
        await ctx.editMessageText(`❌ Error: ${countResponse.message}`);
        return;
      } else {
        await ctx.editMessageText(
          `✅ There are ${countResponse.count} users with subscription: ${data}.`
        );
      }
      break;

    default:
      await ctx.editMessageText("❌ Invalid subscription action specified.");
      break;
  }
}