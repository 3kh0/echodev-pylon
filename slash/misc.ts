discord.interactions.commands.register(
  {
    name: 'echo',
    description: 'ADMIN ONLY COMMAND',
    options: (opts) => ({
      text: opts.string({
        description: 'text',
        required: true
      })
    })
  },
  async (interaction, { text }) => {
    if (!interaction.member.roles.includes('971775516904423434')) {
      await interaction.respondEphemeral(
        '❌ You do not have permission to preform this action!'
      );
      return;
    }
    const chanId = interaction.channelId;
    const s_channel = await discord.getGuildTextChannel(chanId);
    await interaction.respondEphemeral('✅ Message sent!\n`' + text + '`');
    await s_channel?.sendMessage(text);
  }
);