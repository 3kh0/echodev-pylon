discord.interactions.commands.register(
  {
    name: 'membercount',
    description: 'How many people are in the discord',
  },
  async (interaction) => {
    var guild = await interaction.getGuild();
    var count = guild.memberCount;
    interaction.respond(
      'There are currently ' + count + ' people in the discord!'
    );
  }
);
