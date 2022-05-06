// fuck it, lets put all of the commands here!

const commands = new discord.command.CommandGroup({
  defaultPrefix: '!'
});

commands.on(
  { name: 'help', description: 'help' },
  () => ({}),
  async (message) => {
    await message.inlineReply(
      new discord.Embed({
        title: 'Help menu',
        description: [
          'Example command:',
          '`!example <required> [optional]`',
          '**Commands**:',
          'General commands',
          '- `!roll <sides>` - roll a dice with <sides>',
          '- `!hug <user>` - give someone a hug!',
          '- `!hey-siri [question]` - ask siri something',
          '- `!poll <question>` - make a nice poll',
          '- `!info` - get some information!',
          'Staff commands',
          '- `!slowmode <time> [optional]` - set the slowmode for a channel',
          '- `!kick <user> [reason` - kick someone from the server'
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
  'hug',
  (args) => ({
    user: args.user()
  }),
  async (message, { user }) => {
    await message.inlineReply(
      `${message.author.username} hugged ${user.username}!`
    );
  }
);

commands.on(
  {
    name: 'hey-siri',
    aliases: ['hs']
  },
  (args) => ({
    input: args.textOptional()
  }),
  async (message, { input }) => {
    const siriResponses = [
      'Searching for nearby sushi restaraunts...',
      'Sending images of Google search "butt" to grandmother',
      'The coin landed heads.',
      'The coin landed tails.',
      'The square root of 27 is 5.196152423.',
      'Setting alarm for "11:00 PM snack"',
      'TikTok was just removed from existance!',
      'Ordered 420 pizzas from Pizza Hut!',
      'Did you know, not breathing means that you are not breathing!',
      'Sorry, I do not know what you are trying to do!',
      'Stop it, get some help!',
      'Calling 911...',
      'Launching intercontinental ballistic missile. Target: Northwest Syria',
      "Yes, I'm Siri.",
      'Buying $GME Stock...',
      'Preordering tickets to Disney\'s 2021 "Cruella"',
      'Search results show you may have the black plague.'
    ];
    const randSiriResponse =
      Math.floor(Math.random() * siriResponses.length) + 1;
    await message.inlineReply(siriResponses[randSiriResponse]);
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
      `🎲 The *${sides}-sided* dice landed on **${result}**!`
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
    name: 'info'
  },
  () => ({}),
  async (message) => {
    await message.inlineReply(
      new discord.Embed({
        title: 'About',
        description: [
          'This bot is coded by Echo',
          '',
          'You can view the source code here:',
          'https://github.com/3kh0/echodev-pylon'
        ].join('\n')
      })
    );
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

commands.on(
  {
    name: 'kick',
    aliases: ['k'],
    filters: discord.command.filters.canKickMembers()
  },
  (args) => ({
    member: args.guildMember(),
    reason: args.textOptional()
  }),
  async (message, { member }) => {
    const guild = await discord.getGuild();
    const channel = await discord.getGuildTextChannel('972159547567374397');

    const logger = new discord.Embed();
    logger.setTitle('User kicked!');
    logger.setColor(0x00ff00);
    logger.setFooter({
      text: guild.name
    });
    logger.setThumbnail({ url: member.user.getAvatarUrl() });
    logger.addField({
      name: 'User Name',
      value: `${member.user.username}`,
      inline: false
    });
    logger.addField({
      name: 'User ID',
      value: `${member.user.id}`,
      inline: false
    });
    logger.setTimestamp(new Date().toISOString());
    if (guild) {
      await member.kick;
      channel?.sendMessage({
        content: '',
        embed: logger
      });
      await message.inlineReply(
        `✅ **${member.user.username}** was kicked from the server!`
      );
    }
  }
);
