import { Message } from 'discord.js';

export class MessageHandler {
  constructor() {}

  async handle(message: Message): Promise<void> {
    if (message.author.bot) return;
  }
}
