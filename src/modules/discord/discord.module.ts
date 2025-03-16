import { Module } from '@nestjs/common';
import { DiscordService } from '@discord/discord.service';
import { AiModule } from '@ai/ai.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WatchListEntity } from '@discord/watch-list.entity';
import { WatchAvatarCommand } from '@discord/commands/watch-avatar.command';

@Module({
  imports: [AiModule, TypeOrmModule.forFeature([WatchListEntity])],
  providers: [DiscordService, WatchAvatarCommand],
})
export class DiscordModule {}
