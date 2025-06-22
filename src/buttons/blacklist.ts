import { Context, InlineKeyboard } from "grammy";
import { type Execute } from "../interfaces/Button";
import { GetSellerKey, Request } from "../utilities/session";
import { stateManager } from "../utilities/state";

export const name: string = "blacklist";
export const cooldown: number = 0;
export const execute: Execute = async (ctx: Context, bot, args) => {
  await ctx.answerCallbackQuery();
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  if (!args || args.length === 0) {
    await ctx.reply("Error: No blacklist action provided.");
    return;
  }

  const action = args[0] as string;
  const type = args[1] as string;
  const data = args[2] as string;

  switch (action) {
    // Add blacklist (redirect to existing addblacklist functionality)
    case "ip":
    case "hwid":
    case "region":
    case "country":
    case "asn":
      await ctx.reply(`What ${action} would you like to blacklist?`);
      
      if (ctx.from && ctx.from.id) {
        stateManager.setWaitingForResponse(
          ctx.from.id,
          "add_blacklist_data",
          async (responseCtx: Context) => {
            const data = responseCtx.message?.text;
            const userId = responseCtx.from?.id;
            
            if (!data || !userId) {
              await responseCtx.reply("Please provide valid data to blacklist.");
              return;
            }
            
            await responseCtx.reply("What is the reason for blacklisting this data?");
            
            stateManager.setWaitingForResponse(
              userId,
              "add_blacklist_reason",
              async (reasonCtx: Context) => {
                const reason = reasonCtx.message?.text;
                const userId = reasonCtx.from?.id;
                
                if (!reason || !userId) {
                  await reasonCtx.reply("Please provide a valid reason for blacklisting.");
                  return;
                }
                
                const response = await Request({
                  sellerkey: sellerKeyGet,
                  type: "black",
                  type: action,
                  data: data,
                  reason: reason,
                });

                if (!response.success) {
                  await reasonCtx.reply(`❌ Error: ${response.message}`);
                  return;
                } else {
                  await reasonCtx.reply(`✅ Successfully added ${data} to the ${action} blacklist with reason: ${reason}`);
                  stateManager.clearState(userId);
                }
              }
            );
          }
        );
      } else {
        await ctx.reply("Sorry, I couldn't identify you. Please try again later.");
      }
      break;

    // Delete blacklist
    case "del":
      const keyboard = new InlineKeyboard()
        .text("Confirm Deletion", `blacklist:del-confirm:${type}:${data}`)
        .text("Cancel", `blacklist:del-cancel:${type}:${data}`);

      await ctx.editMessageText(
        `Are you sure you want to delete the ${type} blacklist entry: ${data}?`,
        { reply_markup: keyboard }
      );
      break;

    case "del-confirm":
      await ctx.editMessageText("⏳ Deleting blacklist entry...");

      const deleteResponse = await Request({
        sellerkey: sellerKeyGet,
        type: "delblack",
        blacktype: type,
        data: data,
      });

      if (!deleteResponse.success) {
        await ctx.editMessageText(
          `❌ Error: ${deleteResponse.message}`
        );
        return;
      } else {
        await ctx.editMessageText(
          `✅ ${type} blacklist entry ${data} deleted successfully.`
        );
      }
      break;

    case "del-cancel":
      await ctx.editMessageText("❌ Deletion of blacklist entry cancelled.");
      break;

    // Delete all blacklists
    case "delall-confirm":
      await ctx.editMessageText("⏳ Deleting all blacklists...");

      const deleteAllResponse = await Request({
        sellerkey: sellerKeyGet,
        type: "delblacks",
      });

      if (!deleteAllResponse.success) {
        await ctx.editMessageText(
          `❌ Error: ${deleteAllResponse.message}`
        );
        return;
      } else {
        await ctx.editMessageText(
          `✅ All blacklists deleted successfully.`
        );
      }
      break;

    case "delall-cancel":
      await ctx.editMessageText("❌ Deletion of all blacklists cancelled.");
      break;

    default:
      await ctx.reply("Error: Invalid blacklist action specified.");
      break;
  }
};
