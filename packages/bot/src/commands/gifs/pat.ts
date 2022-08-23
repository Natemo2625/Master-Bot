import { ApplyOptions } from '@sapphire/decorators';
import {
  ApplicationCommandRegistry,
  Command,
  CommandOptions
} from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import axios from 'axios';
import Logger from '../../lib/utils/logger';

@ApplyOptions<CommandOptions>({
  name: 'pat',
  description: 'Replies with a random pat gif!',
  preconditions: ['isCommandDisabled']
})
export class PatCommand extends Command {
  public override chatInputRun(interaction: CommandInteraction) {
    if (!process.env.TENOR_API) return;
    axios
      .get(
        `https://api.tenor.com/v1/random?key=${process.env.TENOR_API}&q=pat&limit=1`
      )
      .then(async response => {
        return await interaction.reply({
          content: response.data.results[0].url
        });
      })
      .catch(async error => {
        Logger.error(error);
        return await interaction.reply(
          'Something went wrong when trying to fetch a pat gif :('
        );
      });
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ): void {
    registry.registerChatInputCommand({
      name: this.name,
      description: this.description
    });
  }
}
