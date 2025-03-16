import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import { Command } from '@shared/interfaces/discord.command';
import { Repository } from 'typeorm';
import { WatchListEntity } from '@discord/watch-list.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { DiscordService } from '@discord/discord.service';

@Injectable()
export class WatchAvatarCommand implements Command {
  channelId: string;
  constructor(
    @InjectRepository(WatchListEntity)
    private readonly watchListRepository: Repository<WatchListEntity>,
  ) {}

  data = new SlashCommandBuilder()
    .setName('watch-avatar')
    .setDescription('Add avatar to watch list and show whenever it changed')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('User that you want to add to watch list')
        .setRequired(true),
    );
  async execute(
    service: DiscordService,
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    const userID = this.getDataFromInteraction(interaction);
    const guild = await interaction.client.guilds.fetch(interaction.guild.id);
    const user = await guild.members.fetch(userID);
    const userAV = user.user.avatar;

    const isWatchedAlready = await service.watchListRepository.findOne({
      where: { user_id: userID },
    });

    if (isWatchedAlready) {
      const returnEmbed = new EmbedBuilder();
      returnEmbed
        .setTitle('No.')
        .setDescription(`Аватар пользователя уже отслеживается.`)
        .setColor([255, 0, 0]);
      await interaction.reply({
        embeds: [returnEmbed],
      });
      return;
    }

    await service.watchListRepository.save({
      user_id: userID,
      avatar: userAV,
    });

    const returnEmbed = new EmbedBuilder();
    returnEmbed
      .setTitle('Done!')
      .setDescription(`Аватар пользователя добавлен к отслеживаемым.`)
      .setColor('#00c2ff');
    interaction.reply({
      embeds: [returnEmbed],
    });
  }

  getDataFromInteraction(interaction) {
    const interactionData = interaction.options._hoistedOptions;
    const userID = interactionData[0].value;

    return userID;
  }
}
