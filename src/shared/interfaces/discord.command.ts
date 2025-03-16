import { DiscordService } from '@discord/discord.service';
import {
  ChatInputCommandInteraction,
  SlashCommandOptionsOnlyBuilder,
} from 'discord.js';

export interface Command {
  data: SlashCommandOptionsOnlyBuilder;
  execute(
    service: DiscordService,
    interaction: ChatInputCommandInteraction,
  ): Promise<void>;
}
