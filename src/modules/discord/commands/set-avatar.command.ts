import { DiscordService } from '@discord/discord.service';
import { EmbedBuilder, SlashCommandBuilder } from '@discordjs/builders';
import { Command } from '@shared/interfaces/discord.command';
import { ChatInputCommandInteraction } from 'discord.js';

export class SetBotAvatar implements Command {
  data = new SlashCommandBuilder()
    .setName('changeavatar')
    .setDescription('Update bot avatar')
    .addAttachmentOption((option) =>
      option
        .setName('avatar')
        .setName('image')
        .setDescription('Новая аватарка')
        .setRequired(true),
    );

  async execute(
    service: DiscordService,
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    if (interaction.user.id !== '434784069180588032') {
      const returnEmbed = new EmbedBuilder();
      returnEmbed
        .setTitle('No.')
        .setDescription(`Только Дима может обновлять аватарку бота!`)
        .setColor([255, 0, 0]);
      await interaction.reply({
        embeds: [returnEmbed],
      });
      return;
    }

    const newAvatar = await interaction.options.getAttachment('image');

    interaction.client.user.setAvatar(newAvatar.url);

    const returnEmbed = new EmbedBuilder();
    returnEmbed
      .setTitle('Done!')
      .setDescription(`Аватарка обновлена!`)
      .setColor([0, 194, 255]);
    await interaction.reply({
      embeds: [returnEmbed],
    });
  }
}
