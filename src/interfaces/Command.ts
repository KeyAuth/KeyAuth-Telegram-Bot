import { Context } from "grammy";
import TelegramBot from "../utilities/bot";

export interface Execute {
  (ctx: Context, bot: TelegramBot, args?: string[]): Promise<void>;
}

export interface Command {
  name: string;
  description?: string;
  cooldown?: number;
  execute: Execute;
}