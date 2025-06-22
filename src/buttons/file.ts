import { Context, InlineKeyboard } from "grammy";
import { type Execute } from "../interfaces/Button";
import { GetSellerKey, Request } from "../utilities/session";
import { stateManager } from "../utilities/state";

export const name: string = "file";
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
    // Delete all files
    case "delall-confirm":
      await ctx.editMessageText(`⏳ Deleting all files...`);

      const response = await Request({
        sellerkey: sellerKeyGet,
        type: "delallfiles",
      });

      if (!response.success) {
        await ctx.editMessageText(`❌ Error: ${response.message}`);
        return;
      } else {
        await ctx.editMessageText(`✅ All files deleted successfully.`);
      }
      break;

    case "delall-cancel":
      await ctx.editMessageText(`❌ Deletion of all files has been cancelled.`);
      break;

    // Delete file
    case "del":
      const keyboard = new InlineKeyboard()
        .text("Confirm Deletion", `file:del-confirm:${data}`)
        .text("Cancel", `file:del-cancel:${data}`);

      await ctx.editMessageText(
        `Are you sure you want to delete the file: ${data}?`,
        { reply_markup: keyboard }
      );
      break;

    case "del-confirm":
      await ctx.editMessageText("⏳ Deleting file...");

      const delResponse = await Request({
        sellerkey: sellerKeyGet,
        type: "delfile",
        fileid: Number(data),
      });

      if (!delResponse.success) {
        await ctx.editMessageText(`❌ Error: ${delResponse.message}`);
        return;
      } else {
        await ctx.editMessageText(`✅ File ${data} deleted successfully.`);
      }
      break;
    case "del-cancel":
      await ctx.editMessageText("❌ Deletion of file cancelled.");
      break;

    // Edit file
    case "edit":
      const editKeyboard = new InlineKeyboard()
        .text("URL", `file:edit-url:${data}`)
        .text("Authed", `file:edit-authed:${data}`);
      await ctx.editMessageText(
        `What would you like to edit on file ${data}?`,
        { reply_markup: editKeyboard }
      );
      break;

    case "edit-url":
      await ctx.editMessageText(
        `Please send the new URL for the file: ${data}`
      );
      stateManager.setWaitingForResponse(
        userId,
        "edit-url",
        async (responseCtx: Context) => {
          const newUrl = responseCtx.message?.text;
          if (!newUrl) {
            await responseCtx.reply("❌ Invalid URL provided.");
            return;
          }

          const editResponse = await Request({
            sellerkey: sellerKeyGet,
            type: "editfile",
            id: Number(data),
            url: newUrl,
          });

          if (!editResponse.success) {
            await ctx.reply(
              `❌ Error: ${editResponse.message}`
            );
            return;
          } else {
            await ctx.reply(
              `✅ File URL updated successfully to: ${newUrl}`
            );          
          }
        }
      );
      break;
      
    case "edit-authed":
      await ctx.editMessageText(
        `Should users be required to be authenticated to download file ${data}? (yes/no)`
      );
      
      stateManager.setWaitingForResponse(
        userId,
        "edit-authed",
        async (responseCtx: Context) => {
          const authResponse = responseCtx.message?.text?.trim().toLowerCase();
          
          if (!authResponse || (authResponse !== "yes" && authResponse !== "no")) {
            await responseCtx.reply("Please respond with 'yes' or 'no'.");
            return;
          }
          
          const authedResponse = await Request({
            sellerkey: sellerKeyGet,
            type: "editfile",
            id: Number(data),
            authed: authResponse === "yes" ? 1 : 0,
          });
          
          if (!authedResponse.success) {
            await ctx.reply(
              `❌ Error: ${authedResponse.message}`
            );
            return;
          } else {
            await ctx.reply(
              `✅ File authentication requirement set to: ${authResponse === "yes" ? "Required" : "Not Required"}`
            );
          }
        }
      );
      break;
      
    default:
      await ctx.editMessageText("❌ Invalid file action specified.");
      return;
  }
};
