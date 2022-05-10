discord.interactions.commands.register(
  {
    name: 'nickname',
    description: 'Changes the nickname of a member.',
    ackBehavior: discord.interactions.commands.AckBehavior.AUTO_EPHEMERAL,
    options: (opts) => ({
      member: opts.guildMember({
        description: 'The member to change the nickname of.',
        required: true
      }),
      nickname: opts.string({
        description: 'The new nickname for the member. Leave out to remove.',
        required: false
      })
    })
  },
  async (interaction, { member, nickname }) => {
    const guild = await discord.getGuild(interaction.guildId);
    if (!guild)
      return interaction.respondEphemeral(
        ':x: `Internal Error` Server not found.'
      );
    if (!interaction.member.can(discord.Permissions.MANAGE_NICKNAMES))
      return await interaction.respondEphemeral(
        ':x: `Permission Error` You need the permission **Manage Nicknames** to use this command.'
      );
    const newNick = nickname || '';
    if (newNick.length > 32)
      return interaction.respondEphemeral(
        ':x: `Argument Error` The argument **nickname** cannot be longer than 32 characters.'
      );
    await member.edit({ nick: newNick });
    if (newNick != '')
      interaction.respondEphemeral(
        ':white_check_mark: The nickname of ' +
          member.toMention() +
          ' has been changed to `' +
          newNick +
          '`.'
      );
    else
      interaction.respondEphemeral(
        ':white_check_mark: The nickname of ' +
          member.toMention() +
          ' has been removed.'
      );
  }
);
