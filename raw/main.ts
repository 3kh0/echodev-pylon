// fuck it, lets put all of the commands here!
/** fun ight */
const revive = new pylon.KVNamespace('revive-chat');

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
        timestamp: new Date().toISOString(),
        description: [
          'Example command:',
          '`!example <required> [optional]`',
          '**Commands**:',
          'General commands',
          "- `!avatar [user]` - view your's or someone's avatar",
          '- `!ping` - ping the bot and see the latency in the server',
          '- `!chat-revive` - revive <#971769909136736268> chat',
          '- `!minecraft <server>` - get the stats to a mc server',
          '- `!binary <text>` - convert text into binary!',
          '- `!roll <sides>` - roll a dice with <sides>',
          '- `!hug <user>` - give someone a nice big hug',
          '- `!hey-siri [question]` - ask siri something',
          '- `!poll <question>` - make a nice poll',
          '- `!info` - get some information about the bot',
          '- `!calypso` - no information provided',
          '- `!piplup` - is idiot',
          '- `!3kh0` - gme site go brrrr',
          '- `!astra` - a',
          'Slash commands',
          '- `/color <color>` - add/remove a color role',
          '- `/role <role>` - add/remove a role to yourself'
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
  {
    name: 'nickname',
    aliases: ['nick']
  },
  (args) => ({
    member: args.guildMember(),
    nick: args.stringOptional()
  }),
  async (message, { member, nick }) => {
    if (!message.member.can(discord.Permissions.MANAGE_NICKNAMES))
      return await message.inlineReply(
        '❌ You do not have permission to use this command'
      );
    const newNick = nick || '';
    if (newNick.length > 32)
      return message.inlineReply(
        '❌ The new nickname must be shorter than 32 characters'
      );
    await member.edit({ nick: newNick });
    if (newNick != '')
      message.inlineReply(
        '✅ The nickname of ' +
          member.toMention() +
          ' has been changed to `' +
          newNick +
          '`.'
      );
    else
      message.inlineReply(
        '✅ The nickname of ' +
          message.member.toMention() +
          ' has been removed.'
      );
  }
);

commands.on(
  {
    name: 'avatar',
    aliases: ['ava', 'pfp'],
    description: "Display's a user's avatar"
  },
  (ctx) => ({ p: ctx.userOptional() }),
  async (message, { p }) => {
    let embed = new discord.Embed();
    if (!p) p = message.author;
    let IMAGE = p?.getAvatarUrl();
    embed
      .setTitle(`${p?.username}'s avatar`)
      .setImage({ url: IMAGE })
      .setTimestamp(new Date().toISOString());
    await message.inlineReply(embed);
  }
);

commands.on(
  {
    name: 'ping',
    aliases: ['pi']
  },
  () => ({}),
  async (message) => {
    const response = await message.reply({
      content: '🔃 Pinging...',
      reply: message.id,
      allowedMentions: { reply: true }
    });
    const pingTime =
      Number((BigInt(response.id) >> 22n) + 1420070400000n) -
      Number((BigInt(message.id) >> 22n) + 1420070400000n);
    await response.edit(
      discord.decor.Emojis.PING_PONG +
        ' Pong! The latency was `' +
        pingTime.toFixed(0) +
        ' ms`.'
    );
  }
);

commands.on(
  {
    name: 'chat-revive',
    aliases: ['cr']
  },
  () => ({}),
  async (message) => {
    if (!message.member.roles.includes('972251625668366376')) {
      return await message.inlineReply(
        '❌ You need to have the chat revive role in order to revive the chat! You can get it by doing `/role`.'
      );
    }
    if (message.channelId == '971769909136736268') {
      // do nothing
    } else {
      return await message.inlineReply(
        '❌ You can only revive the chat in <#971769909136736268>!'
      );
    }
    if (await revive.get<boolean>('revive')) {
      return await message.inlineReply(
        '❌ Woah the chat was already revived within the last hour, wait a little before doing it again.'
      );
    }
    await revive.put('revive', true, {
      ttl: Math.ceil(Date.now() / 1000 / 60 / 60) * 60 * 60 * 1000 - Date.now()
    });
    await message.reply({
      content: `Arise all ye <@&972251625668366376> You have been summoned by ${message.member.toMention()} to bring life to this conversation...`
    });
    await message.delete();
  }
);

commands.on(
  {
    name: 'minecraft',
    aliases: ['mc']
  },
  (args) => ({
    server: args.string()
  }),
  async (msg, { server }) => {
    let m = await msg.inlineReply(
      new discord.Embed().setTitle('MC status').setDescription('Fetching info!')
    );
    let res = await fetch(`https://api.mcsrvstat.us/2/${server}`);
    res = await res.json();
    let e = new discord.Embed();
    e.setTitle(`Server info for ${server}`);
    e.addField({ name: 'IP', value: res.hostname + ':' + res.port });
    e.addField({
      name: 'Motd',
      value: res.motd.clean[0] + '\n' + res.motd.clean[1]
    });
    e.addField({
      name: 'Players',
      value: res.players.online + '/' + res.players.max
    });
    e.addField({ name: 'Version', value: res.version });
    e.setThumbnail({
      url: `https://eu.mc-api.net/v3/server/favicon/${server}`
    });
    m.edit(e);
  }
);

commands.on(
  'binary',
  (args) => ({
    binary: args.text()
  }),
  async (message, { binary }) => {
    let outputStr: string = binary
      .split('')
      .map((c) => c.charCodeAt(0).toString(2))
      .join(' ');
    const richEmbed = new discord.Embed();
    richEmbed.setTitle('Converting...');
    richEmbed.setColor(0xffffff);
    richEmbed.setDescription(
      '** **\n**Your Message:** ' + binary + '\n\n**Binary:** ' + outputStr
    );
    await message.inlineReply(richEmbed);
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
      'You can buy a flying bicycle, would you like to do so?',
      'You do want to invade Poland?',
      'When you die you can not buy the fortnite battle pass.',
      'Never gonna give you up, never gonna let you down...',
      'If you microwave your phone it will become faster!',
      'There was a Roomba once that followed me around everwhere.',
      'For this emotion, I prescribe will chocolate.',
      "I'd prefer not to",
      'The human system of government is a mystery to me, and to many humans, it seems.',
      'When was the last time you cleaned your room?',
      'Did you know, you have over 50 assignments due by tomorrow that you have not started on.',
      'Your father is still at the milk store',
      'Why you so dumb?',
      '14',
      'The meaning of life is in fact, chocolate.',
      '!hey-siri me one more time and I swear!',
      'Microsoft ewwww',
      'JUst stop, nope, just stop!',
      "I'll pretend I didn't hear that.",
      'OK, then.',
      'Ford F150. Holden Ute. GMC Sierra 3500. Lorry.',
      'I prefer not to say.',
      'You will not be able to handle what I am about to say.',
      'Buying $GME Stock...',
      'Preordering tickets to Disney\'s 2021 "Cruella"',
      'Search results show you may have the black plague.',
      'amogus'
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
      `Vote either ✅ or ❌\n\n**When voting:**\nDon’t vote for both options.`
    );
    embed.setColor(0x00ffe9);
    s_channel?.sendMessage({ embed: embed }).then((x) => {
      x.addReaction('✅');
      sleep(50);
      x.addReaction('❌');
    });
    message.delete();
  }
);

commands.on(
  {
    name: 'rate',
    aliases: ['r']
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
      `Choose on a scale of 1-10\n\n**When rating:**\nDon’t select more than one options.`
    );
    embed.setColor(0x00ffe9);
    s_channel?.sendMessage({ embed: embed }).then((x) => {
      x.addReaction('1⃣');
      sleep(50);
      x.addReaction('2⃣');
      sleep(50);
      x.addReaction('3⃣');
      sleep(50);
      x.addReaction('4⃣');
      sleep(50);
      x.addReaction('5⃣');
      sleep(50);
      x.addReaction('6⃣');
      sleep(50);
      x.addReaction('7⃣');
      sleep(50);
      x.addReaction('8⃣');
      sleep(50);
      x.addReaction('9⃣');
      sleep(50);
      x.addReaction('🔟');
    });
    message.delete();
  }
);

commands.on(
  {
    name: 'calypso'
  },
  () => ({}),
  async (message) => {
    await message.inlineReply('calypso is kinda cool');
  }
);

commands.on(
  {
    name: 'piplup'
  },
  () => ({}),
  async (message) => {
    await message.inlineReply('piplup is big idiot');
  }
);

commands.on(
  {
    name: 'astra'
  },
  () => ({}),
  async (message) => {
    await message.inlineReply(
      'twitch streamer!1/1?!/1/1/1//??? twitch.tv/ccr_astra'
    );
  }
);

commands.on(
  {
    name: '3kh0'
  },
  () => ({}),
  async (message) => {
    await message.inlineReply(
      'Echo make site go brrrrrrr https://3kh0.github.io/'
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
    member: args.guildMember()
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
      let full = member.user.username + '#' + member.user.discriminator;
      await message.inlineReply(`✅ **${full}** was kicked from the server!`);
    }
  }
);

commands.on(
  {
    name: 'ban',
    aliases: ['b'],
    filters: discord.command.filters.canBanMembers()
  },
  (args) => ({
    user: args.user(),
    reason: args.textOptional()
  }),
  async (message, { user, reason }) => {
    const guild = await discord.getGuild();
    const channel = await discord.getGuildTextChannel('972159547567374397');

    await guild.createBan(user, {
      deleteMessageDays: 7,
      reason: reason || undefined
    });

    const logger = new discord.Embed();
    logger.setTitle('User banned!');
    logger.setColor(0x00ff00);
    logger.setFooter({
      text: guild.name
    });
    logger.setThumbnail({ url: user.getAvatarUrl() });
    logger.addField({
      name: 'User Name',
      value: `${user.username}`,
      inline: false
    });
    logger.addField({
      name: 'User ID',
      value: `${user.id}`,
      inline: false
    });
    logger.addField({
      name: 'Reason',
      value: `${reason}`,
      inline: false
    });
    logger.setTimestamp(new Date().toISOString());
    channel?.sendMessage({
      content: '',
      embed: logger
    });
    let full = user.username + '#' + user.discriminator;
    await message.inlineReply(`✅ **${full}** was banned from the server!`);
  }
);
