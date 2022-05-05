// fuck it lets put all of the commands here

const commands = new discord.command.CommandGroup({
  defaultPrefix: '!'
});

commands.on(
  { name: 'help', description: 'help' },
  () => ({}),
  async (message) => {
    await message.reply(
      new discord.Embed({
        title: 'Help menu',
        description: [
          'Example command:',
          '`!example <required> [optional]`',
          '**Commands**:',
          '- `!roll <sides>` - roll a dice with <sides>',
          '- `!poll <question>` - make a nice poll',
          '',
          '- `!slowmode <time> [optional]` - set the slowmode for a channel'
        ].join('\n')
      })
    );
  }
);

commands.on(
  {
    name: 'echo',
    aliases: ['e']
  },
  (args) => ({
    input: args.text()
  }),
  async (message, { input }) => {
    if (!message.member.roles.includes('971775516904423434')) {
      await message.inlineReply(
        '❌ You do not have permission to preform this action!'
      );
      return;
    }
    await message.reply({
      content: input
    });
    await message.delete();
  }
);

commands.on(
  'roll',
  (args) => ({
    sides: args.integer()
  }),
  async (message, { sides }) => {
    const result = Math.ceil(Math.random() * sides);
    await message.inlineReply(
      `🎲 The *${sides}-sided* landed on **${result}**!`
    );
  }
);

commands.on(
  {
    name: 'poll',
    aliases: ['p']
  },
  (args) => ({
    poll: args.text()
  }),
  async (message, { poll }) => {
    const s_channel = await message.getChannel();
    const embed = new discord.Embed();
    embed.setAuthor({
      name: message.author.getTag(),
      iconUrl: message.author.getAvatarUrl()
    });
    embed.setTitle(`${poll}`);
    embed.setDescription(
      `Vote either ✅ or ❎\n\n**When voting:**\nDon’t vote for both options.`
    );
    embed.setColor(0x00ffe9);
    s_channel?.sendMessage({ embed: embed }).then((x) => {
      x.addReaction('✅');
      sleep(3);
      x.addReaction('❎');
    });
    message.delete();
  }
);

commands.on(
  {
    name: 'slowmode',
    aliases: ['sm']
  },
  (args) => ({ time: args.number(), channel: args.guildTextChannelOptional() }),
  async (msg, { time, channel }) => {
    if (
      !(await discord.command.filters
        .canManageMessages(channel?.id ?? msg.channelId) //Modify this to the permission you want to require
        .filter(msg))
    ) {
      await msg?.inlineReply(
        `❌ Sorry, but you do not have permission in order to use this command!`
      );
      return;
    }
    const t: number = time ?? 0;
    const settedTime: number = t > 21600 ? 21600 : t;
    const theChannel =
      channel === null
        ? ((await msg.getChannel()) as discord.GuildTextChannel)
        : channel;

    await theChannel.edit({ rateLimitPerUser: settedTime });
    await msg?.inlineReply(
      `✅ The slowmode for the channel **<#${
        theChannel.id
      }>** has been set to \`${settedTime.toFixed(0)}\` second(s).`
    );
  }
);