import logger from "./utilities/logger";
import TelegramBot from "./utilities/bot";
import { GrammyError, HttpError } from "grammy";

try {
  console.clear();

  new TelegramBot(process.env.TELEGRAM_API_KEY as string)
    .start()
    .catch((error) => {
      const ctx = error.ctx;

      logger.error(
        `[ERROR] An error occurred for update ${ctx.update.update_id}:`
      );

      if (error.error instanceof GrammyError) {
        logger.error(`GrammyError: ${error.error.description}`);
      } else if (error.error instanceof HttpError) {
        logger.error(`HttpError: ${error.error.message}`);
      } else {
        logger.error(`Unknown Error: ${error.error}`);
      }
    });
} catch (error: any) {
  logger.fatal(
    `An error occurred while starting the bot: ${error}\n${error.stack}`
  );
}
