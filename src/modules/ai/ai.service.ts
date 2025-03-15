import { Injectable } from '@nestjs/common';
import { DeepSeekModel } from './models/deepSeek.model';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
  private aiModel: DeepSeekModel;
  constructor(private readonly configService: ConfigService) {
    this.aiModel = new DeepSeekModel(
      configService.get('AI_API_KEY'),
      configService.get('AI_CHARACTER'),
    );
  }

  async getAnswer(messages: string[]): Promise<string> {
    return this.aiModel.getChatCompletion(messages);
  }
}
