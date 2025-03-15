import OpenAI from 'openai';
import { ChatCompletionUserMessageParam } from 'openai/resources';

export class DeepSeekModel {
  apiKey: string;
  character: string;
  openai: OpenAI;
  constructor(apiKey: string, character: string) {
    this.character = character;
    this.openai = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: apiKey,
    });
  }

  async getChatCompletion(message: string[]): Promise<string> {
    const formatedMessage: ChatCompletionUserMessageParam[] = message.map(
      (message) => {
        return {
          role: 'user',
          content: message,
        };
      },
    );
    const completion = await this.openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: this.character,
        },
        ...formatedMessage,
      ],
      model: 'deepseek-chat',
    });

    return completion.choices[0].message.content;
  }
}
