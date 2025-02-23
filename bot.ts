import { Bot, GrammyError, HttpError } from "grammy";
import { env } from "./utility";
import * as fs from "fs";
import * as path from "path";

// Initialize the bot
const bot = new Bot(env.TELEGRAM_BOT_TOKEN);

// Import all functions from the functions folder
const functionsPath = path.join(__dirname, "functions");

function loadFunctions(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      loadFunctions(fullPath);
    } else if (
      entry.isFile() &&
      (entry.name.endsWith(".js") || entry.name.endsWith(".ts"))
    ) {
      import(fullPath)
        .then((module) => {
          Object.values(module).forEach((exported) => {
            if (typeof exported === "function") {
              exported(bot);
            }
          });
        })
        .catch((err) => {
          console.error(`Error loading file ${fullPath}:`, err);
        });
    }
  }
}

loadFunctions(functionsPath);

// Error listener for grammY-specific errors
bot.catch((err) => {
  const ctx = err.ctx;
  console.error(
    `[ERROR] An error occurred for update ${ctx.update.update_id}:`
  );
  if (err.error instanceof GrammyError) {
    console.error(`GrammyError: ${err.error.description}`);
  } else if (err.error instanceof HttpError) {
    console.error(`HttpError: ${err.error.message}`);
  } else {
    console.error(`Unknown Error: ${err.error}`);
  }
});

// Start the bot
(async () => {
  try {
    console.log("Starting the bot...");
    console.log("Bot started successfully!");
    await bot.start();
  } catch (err) {
    console.error("[FATAL] Bot failed to start:");
    console.error(err);
    process.exit(1);
  }
})();
