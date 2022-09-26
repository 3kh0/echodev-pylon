const revive = new pylon.KVNamespace('revive-chat');
discord.interactions.commands.register(
  {
    name: 'chat-revive',
    description: 'Revive the chat by pinging some people!',
  },
  async (interaction) => {
    if (!interaction.member.roles.includes('972251625668366376')) {
      return await interaction.respondEphemeral(
        '❌ You need to have the chat revive role in order to revive the chat! You can get it by doing </role:270148059269300224>.'
      );
    }
    if (interaction.channelId == '971769909136736268') {
      // do nothing
    } else {
      return await interaction.respondEphemeral(
        '❌ You can only revive the chat in <#971769909136736268>!'
      );
    }
    if (await revive.get<boolean>('revive')) {
      return await interaction.respondEphemeral(
        '❌ Woah the chat was already revived within the last hour, wait a little before doing it again.'
      );
    }
    await revive.put('revive', true, {
      ttl: Math.ceil(Date.now() / 1000 / 60 / 60) * 60 * 60 * 1000 - Date.now(),
    });
    await interaction.respondEphemeral('✅ Message sent!');
    let msg =
      'Arise all ye <@&972251625668366376>! You have been summoned by ' +
      interaction.member.toMention();
    +' to bring life to this conversation...';
    const s_channel = await discord.getGuildTextChannel('971769909136736268');
    await s_channel?.sendMessage(msg);
  }
);
