discord.interactions.commands.register(
  {
    name: 'buni',
    description: 'aww lookat the buni wabbit',
  },
  async (interaction) => {
    interaction.respond(
      'https://media.discordapp.net/attachments/414152339293995010/1022874342738108426/pancake-buni.gif'
    );
  }
);
