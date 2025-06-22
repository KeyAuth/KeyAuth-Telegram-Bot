import { Context, InlineKeyboard } from "grammy";
import { type Execute } from "../interfaces/Button";
import { GetSellerKey, Request } from "../utilities/session";
import { stateManager } from "../utilities/state";

export const name: string = "var";
export const cooldown: number = 0;
export const execute: Execute = async (ctx: Context, bot, args) => {
  await ctx.answerCallbackQuery();
  const userId = ctx.from?.id;
  const sellerKeyGet = await GetSellerKey(ctx, bot);
  if (!sellerKeyGet || !userId) return;

  if (!args || args.length === 0) {
    await ctx.reply("Error: No variable action provided.");
    return;
  }

  const type = args[0] as string;
  const data = args[1] as string;

  switch (type) {
    case "delall-confirm":
      await ctx.editMessageText(`⏳ Deleting all variables...`);

      const response = await Request({
        sellerkey: sellerKeyGet,
        type: "delallvars",
      });

      if (!response.success) {
        await ctx.editMessageText(`❌ Error: ${response.message}`);
        return;
      } else {
        await ctx.editMessageText(`✅ All variables deleted successfully.`);
      }
      break;

    case "delall-cancel":
      await ctx.editMessageText(`❌ Deletion of all variables has been cancelled.`);
      break;

    // Delete variable
    case "del":
      const keyboard = new InlineKeyboard()
        .text("Confirm Deletion", `var:del-confirm:${data}`)
        .text("Cancel", `var:del-cancel:${data}`);

      await ctx.editMessageText(
        `Are you sure you want to delete the variable: ${data}?`,
        { reply_markup: keyboard }
      );
      break;

    case "del-confirm":
      await ctx.editMessageText("⏳ Deleting variable...");
      const delResponse = await Request({
        sellerkey: sellerKeyGet,
        type: "delvar",
        name: data,
      });

      if (!delResponse.success) {
        await ctx.editMessageText(`❌ Error: ${delResponse.message}`);
        return;
      } else {
        await ctx.editMessageText(`✅ Variable deleted successfully.`);
      }
      break;

    case "del-cancel":
      await ctx.editMessageText(`❌ Deletion of variable has been cancelled.`);
      break;

    // Edit variable
    case "edit":
      await ctx.editMessageText(`Please enter the new data for the variable: ${data}`)

      stateManager.setWaitingForResponse(
        userId,
        "editvar",
        async (responseCtx: Context) => {
          const newData = responseCtx.message?.text?.trim();
          if (!newData) {
            await responseCtx.reply("Please provide valid data for the variable.");
            return;
          }

          const editResponse = await Request({
            sellerkey: sellerKeyGet,
            type: "editvar",
            varid: data,
            data: newData,
          });

          if (!editResponse.success) {
            await responseCtx.reply(`❌ Error: ${editResponse.message}`);
            return;
          } else {
            await responseCtx.reply(`✅ Variable updated successfully.`);
          }
        }
      )
      break;
    default:
      await ctx.editMessageText("❌ Invalid variable action specified.");
      break;
  }
};