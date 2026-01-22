/*
  If you are not using Bun (https://bun.sh) as your runtime, you will need to replace
  the BunDB import with quick.db
*/

import fs from "fs";
import path from "path";
import logger from "./logger";
import config from "../config";
import { Bot } from "grammy";
import { BunDB } from "./database";
import { stateManager } from "./state";
import type { Button } from "../interfaces/Button";
import type { Command } from "../interfaces/Command";

export default class TelegramBot extends Bot {
  public buttons: Map<string, Button> = new Map();
  public commands: Map<string, Command> = new Map();
  public cooldowns = new Map<string, Map<number, number>>();
  public database: BunDB;

  /**
   * Create a new bot instance
   * @param token The bot token
   */
  constructor(token: string) {
    super(token);

    const databasePath = process.env.DATABASE_PATH || process.env.database_path || "keyauth.sqlite";
    
    // Log the database path being used
    logger.info(`Initializing database at path: ${databasePath}`);
    if (databasePath === "keyauth.sqlite") {
      logger.warn("Using default database path. If you intended to use a persistent volume, check your DATABASE_PATH environment variable.");
    }

    this.database = new BunDB(databasePath);

    Promise.all([
      config.loading.buttons &&
        this.loadButtons(path.join(__dirname, "../buttons")).catch(
          console.error
        ),
      config.loading.commands &&
        this.loadCommands(path.join(__dirname, "../commands")).catch(
          console.error
        ),
    ]).then(async () => {
      config.loading.setCommands &&
        this.api.setMyCommands(
          Array.from(this.commands.values())
            .filter((cmd) => cmd.description)
            .map((cmd) => ({
              command: cmd.name,
              description: cmd.description || cmd.name,
            }))
        );

      // Since you can run a .then() when starting the bot to log a message when the bot starts, this is an alternative.
      try {
        const info = await this.api.getMe();
        logger.success(`Bot started successfully! @${info.username} (${info.first_name})`);
        logger.info(`Loaded ${this.commands.size} commands and ${this.buttons.size} buttons`);
      } catch (error: any) {
        logger.fatal(`An error occurred while starting the bot: ${error}\n${error.stack}`);
      }
    });

    this.on("message", async (ctx) => {
      const userId = ctx.from?.id;
      const text = ctx.message?.text;

      if (text && text.startsWith("/")) {
        // @ts-ignore
        const commandName = text.split(" ")[0].substring(1).toLowerCase();
        const args = text.split(" ").slice(1);
        const command = this.commands.get(commandName);

        if (command && userId) {
          // Log command usage if enabled
          if (config.logging.commandUse) {
            logger.info(`User ${userId} is using command /${command.name}`);
          }

          if (stateManager.isWaitingForResponse(userId)) {
            stateManager.clearState(userId);
            if (config.logging.commandUse) {
              logger.info(`Cleared waiting state for user ${userId} due to command usage`);
            }
          }

          try {
            const now = Date.now();
            const cooldownKey = `COMMAND_${command.name}`;
            if (!this.cooldowns.has(cooldownKey)) {
              this.cooldowns.set(cooldownKey, new Map<number, number>());
            }

            const timestamps = this.cooldowns.get(cooldownKey)!;
            const cooldownAmount = (command.cooldown || 0) * 1000;

            if (timestamps.has(userId)) {
              const expirationTime = timestamps.get(userId)! + cooldownAmount;

              if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;

                if (config.logging.commandUse) {
                  logger.info(`Command /${command.name} on cooldown for user ${userId} (${timeLeft.toFixed(1)}s remaining)`);
                }

                await ctx.reply(
                  `Please wait ${timeLeft.toFixed(
                    1
                  )} more seconds before using the /${command.name} command.`
                );
                return;
              }
            }

            timestamps.set(userId, now);
            setTimeout(() => timestamps.delete(userId), cooldownAmount);

            await command.execute(ctx, this, args);
          } catch (error) {
            logger.error(`Error executing command ${commandName}: ${error}`);
            await ctx.reply("An error occurred while processing your request.");
          }
          return;
        }
      }

      if (userId && stateManager.isWaitingForResponse(userId)) {
        const handler = stateManager.getHandler(userId);
        
        if (config.logging.commandUse) {
          logger.info(`Processing response from user ${userId} for waiting state`);
        }

        if (handler) {
          await handler(ctx);
          
          if (stateManager.isWaitingForResponse(userId) && 
              stateManager.getHandler(userId) === handler) {
            stateManager.clearState(userId);
          }
          return;
        } else {
          stateManager.clearState(userId);
          return;
        }
      }
    });

    this.on("callback_query:data", async (ctx) => {
      const callbackData = ctx.callbackQuery.data;
      const [buttonId, ...args] = callbackData.split(":");
      // @ts-ignore
      const button = this.buttons.get(buttonId);

      if (button && ctx.from) {
        // Log button usage if enabled
        if (config.logging.buttonUse) {
          logger.info(`User ${ctx.from.id} clicked button ${button.name}`);
        }

        try {
          const now = Date.now();
          const cooldownKey = `BUTTON_${button.name}`;
          if (!this.cooldowns.has(cooldownKey)) {
            this.cooldowns.set(cooldownKey, new Map<number, number>());
          }

          const timestamps = this.cooldowns.get(cooldownKey)!;
          const cooldownAmount = (button.cooldown || 0) * 1000;

          if (timestamps.has(ctx.from.id)) {
            const expirationTime =
              timestamps.get(ctx.from.id)! + cooldownAmount;

            if (now < expirationTime) {
              const timeLeft = (expirationTime - now) / 1000;

              if (config.logging.buttonUse) {
                logger.info(`Button ${button.name} on cooldown for user ${ctx.from.id} (${timeLeft.toFixed(1)}s remaining)`);
              }

              await ctx.answerCallbackQuery({
                text: `Please wait ${timeLeft.toFixed(
                  1
                )} more seconds before clicking this button again.`,
                show_alert: true,
              });
              return;
            }
          }

          timestamps.set(ctx.from.id, now);
          setTimeout(() => timestamps.delete(ctx.from.id), cooldownAmount);

          await button.execute(ctx, this, args.length > 0 ? args : undefined);
        } catch (error) {
          logger.error(`Error executing button ${callbackData}: ${error}`);
          await ctx.answerCallbackQuery();
          await ctx.reply("An error occurred while processing your request.");
        }
      } else {
        if (config.logging.buttonUse && ctx.from) {
          logger.warn(`User ${ctx.from.id} clicked unavailable button: ${buttonId}`);
        }
        
        await ctx.answerCallbackQuery({
          text: "This button is no longer available.",
          show_alert: true,
        });
      }
    });
  }

  /**
   * Load the bot buttons
   * This method recursively loads all button files from the specified directory.
   * @param directory The directory to load the buttons from
   */
  private async loadButtons(directory: string): Promise<void> {
    const items = fs.readdirSync(directory);

    for (const item of items) {
      const itemPath = path.join(directory, item);

      if (fs.lstatSync(itemPath).isDirectory()) {
        await this.loadButtons(itemPath);
      } else if (item.endsWith(".ts") || item.endsWith(".js")) {
        try {
          const button: Button = require(itemPath);
          this.buttons.set(button.name, button);
          
          if (config.logging.buttonLoad) {
            logger.success(`Button "${button.name}" has been loaded.`);
          }
        } catch (error) {
          console.error(
            `An error occurred while loading ${itemPath}: ${error}`
          );
        }
      }
    }
  }

  /**
   * Load the bot commands
   * This method recursively loads all command files from the specified directory.
   * @param directory The directory to load the commands from
   */
  private async loadCommands(directory: string): Promise<void> {
    const items = fs.readdirSync(directory);

    for (const item of items) {
      const itemPath = path.join(directory, item);

      if (fs.lstatSync(itemPath).isDirectory()) {
        await this.loadCommands(itemPath);
      } else if (item.endsWith(".ts") || item.endsWith(".js")) {
        try {
          const command: Command = require(itemPath);
          this.commands.set(command.name, command);
          
          if (config.logging.commandLoad) {
            logger.success(`Command "${command.name}" has been loaded.`);
          }
        } catch (error) {
          console.error(
            `An error occurred while loading ${itemPath}: ${error}`
          );
        }
      }
    }
  }
}