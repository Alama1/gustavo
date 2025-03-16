import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  Logger,
} from '@nestjs/common';
import {
  Client,
  EmbedBuilder,
  GatewayIntentBits,
  Message,
  REST,
  Routes,
  SlashCommandBuilder,
  TextChannel,
} from 'discord.js';
import { ConfigService } from '@nestjs/config';
import { AiService } from '@ai/ai.service';
import * as path from 'path';
import * as fs from 'fs/promises';
import { Command } from '@shared/interfaces/discord.command';
import { MessageHandler } from '@discord/handlers/message.handler';
import { WatchListEntity } from '@discord/watch-list.entity';
import { Repository } from 'typeorm';
import * as getColors from 'get-image-colors';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DiscordService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly logger = new Logger(DiscordService.name);
  client: Client;
  private discordToken: string;
  private clientId: string;
  private guildId: string;
  private channelId: string;
  public commands: Map<string, Command> = new Map();
  private rest: REST;

  private messageHandler: MessageHandler;

  constructor(
    private readonly configService: ConfigService,
    private readonly aiService: AiService,
    @InjectRepository(WatchListEntity)
    readonly watchListRepository: Repository<WatchListEntity>,
  ) {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
      ],
    });
    this.discordToken = this.configService.get<string>('DISCORD_TOKEN');
    this.guildId = this.configService.get<string>('GUILD_ID');
    this.channelId = this.configService.get<string>('CHANNEL_ID');
    this.rest = new REST({ version: '10' }).setToken(this.discordToken);
  }

  async onApplicationBootstrap() {
    if (!this.discordToken) {
      this.logger.warn(
        'DISCORD_TOKEN is not defined in environment variables. Discord bot will not start.',
      );
      return;
    }

    await this.login();
    this.clientId = this.client.user.id;
    await this.loadSlashCommands();
    await this.registerSlashCommands();
    this.messageHandler = new MessageHandler();
    this.setupEventListeners();
    this.logger.log('Discord bot service started and logged in.');
  }

  async onApplicationShutdown() {
    if (this.client.isReady()) {
      await this.logout();
      this.logger.log('Discord bot service logged out.');
    } else {
      this.logger.log(
        'Discord bot service was not logged in, no logout needed.',
      );
    }
  }

  async login(): Promise<string> {
    return this.client.login(this.discordToken);
  }

  async logout(): Promise<void> {
    return this.client.destroy();
  }

  private setupEventListeners() {
    this.client.on('ready', () => {
      this.logger.log(`Discord bot logged in as ${this.client.user.tag}!`);
    });

    this.client.on('messageCreate', (message: Message) => {
      if (message.author.bot) return;

      this.messageHandler.handle(message);
    });

    this.client.on('interactionCreate', (interaction) => {
      if (!interaction.isChatInputCommand()) return;
      const command = this.commands.get(interaction.commandName);
      command.execute(this, interaction);
    });

    this.client.on('error', (error) => {
      this.logger.error('Discord client error:', error);
    });
  }

  private async loadSlashCommands() {
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = await fs.readdir(commandsPath);

    for (const file of commandFiles) {
      if (file.endsWith('.command.js') || file.endsWith('.command.ts')) {
        const filePath = path.join(commandsPath, file);
        const commandModule = await import(filePath);

        const commandClass = Object.values(commandModule).find(
          (exportValue) => {
            return typeof exportValue === 'function';
          },
        ) as new (...args: any[]) => Command;

        if (commandClass) {
          const commandInstance = new commandClass();
          if (
            !commandInstance.data ||
            !(commandInstance.data instanceof SlashCommandBuilder)
          ) {
            this.logger.warn(
              `Command file ${file} does not export a valid 'data' property of type SlashCommandBuilder.`,
            );
            continue;
          }
          this.commands.set(commandInstance.data.name, commandInstance);
          this.logger.log(`Loaded slash command: ${commandInstance.data.name}`);
        } else {
          this.logger.warn(
            `Command file ${file} does not export a valid Slash Command class.`,
          );
        }
      }
    }
  }

  private async registerSlashCommands() {
    const commandData = Array.from(this.commands.values()).map(
      (command) => command.data,
    );

    this.logger.log(
      `Started refreshing application (/) commands for the guild ${this.guildId}, clientId: ${this.clientId}`,
    );
    await this.rest.put(
      Routes.applicationGuildCommands(this.clientId, this.guildId),
      {
        body: commandData,
      },
    );
    this.logger.log(`Successfully reloaded application (/) commands.`);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async checkAvatars() {
    const usersToCheck = await this.watchListRepository.find();
    const userIDs = usersToCheck.map((user) => user.user_id);

    for (const userID of userIDs) {
      const currentUser = await this.client.users.fetch(userID);
      const oldAV = usersToCheck.find((user) => user.user_id === userID).avatar;

      if (currentUser.avatar === oldAV) continue;

      this.watchListRepository.update(
        { user_id: userID },
        { avatar: currentUser.avatar },
      );

      const newAVURL = `https://cdn.discordapp.com/avatars/${userID}/${currentUser.avatar}?size=4096`;
      const channel = (await this.client.channels.fetch(
        this.channelId,
      )) as TextChannel;

      const avatarEmbed = new EmbedBuilder()
        .setTitle(currentUser.username)
        .setDescription(`<@${userID}> изменил аватарку!`)
        .setImage(newAVURL)
        .setColor(this.getAvatarColors(newAVURL));

      if (channel.isTextBased()) {
        channel.send({ embeds: [avatarEmbed] });
      }
    }
  }

  private getAvatarColors(url) {
    let colors;
    try {
      colors = getColors(url);
    } catch (e) {
      console.error(e);
      return ['255', '0', '0'];
    }
    if (colors.length === 0 || !colors[0].hasOwnProperty('_rgb'))
      return ['255', '0', '0'];
    return colors[0];
  }
}
