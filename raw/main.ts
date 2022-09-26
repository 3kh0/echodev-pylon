// fuck it, lets put all of the commands here!
/** fun ight */

const commands = new discord.command.CommandGroup({
  defaultPrefix: '!',
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
          '- `!ping` - ping the bot and see the latency in the server',
          '- `!minecraft <server>` - get the stats to a mc server',
          '- `!binary <text>` - convert text into binary!',
          '- `!roll <sides>` - roll a dice with <sides>',
          '- `!hug <user>` - give someone a nice big hug',
          '- `!poll <question>` - make a nice poll',
        ].join('\n'),
      })
    );
  }
);

commands.on(
  {
    name: 'ping',
    aliases: ['pi'],
  },
  () => ({}),
  async (message) => {
    const response = await message.reply({
      content: '🔃 Pinging...',
      reply: message.id,
      allowedMentions: { reply: true },
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
    aliases: ['cr'],
  },
  () => ({}),
  async (message) => {
    await message.inlineReply({
      content: `❌ We are switching over to slash commands now, run the command </chat-revive:270148059269300224> to revive the chat!`,
    });
  }
);

commands.on(
  'binary',
  (args) => ({
    binary: args.text(),
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
  'roll',
  (args) => ({
    sides: args.integer(),
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
    aliases: ['p'],
  },
  (args) => ({
    poll: args.text(),
  }),
  async (message, { poll }) => {
    const s_channel = await message.getChannel();
    const embed = new discord.Embed();
    embed.setAuthor({
      name: message.author.getTag(),
      iconUrl: message.author.getAvatarUrl(),
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
    aliases: ['r'],
  },
  (args) => ({
    poll: args.text(),
  }),
  async (message, { poll }) => {
    const s_channel = await message.getChannel();
    const embed = new discord.Embed();
    embed.setAuthor({
      name: message.author.getTag(),
      iconUrl: message.author.getAvatarUrl(),
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
    name: 'slowmode',
    aliases: ['sm'],
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
