const potatoCommands = new discord.command.CommandGroup({
  defaultPrefix: '!',
});
const potatoKV = new pylon.KVNamespace('potato');
const randomTimeBetween = (min: number, max: number) =>
  Math.round(Math.random() * (max - min) + min);

const setDefaultReply = (commandGroup: discord.command.CommandGroup) => {
  commandGroup.default(
    () => ({}),
    async (message) =>
      await message.inlineReply(
        `❌ That is not even a command lol what are you trying to do? \nIf you need some help, you can run \`!potato help\` to see the actual commands.`
      )
  );
};

discord.on(discord.Event.MESSAGE_CREATE, async (message: discord.Message) => {
  if (!message.author || message.author.bot) return;

  if (await potatoKV.get<boolean>('cooldown')) {
    if (message.content === discord.decor.Emojis.POTATO) {
      const [lastChannel, potatoId] =
        (await potatoKV.get<string>('lastPotato'))?.split('-') || [];
      if (lastChannel !== message.channelId) return;

      await message
        .getChannel()
        .then((c) => c.getMessage(potatoId))
        .then((m) => m?.delete())
        .catch(() => {});

      await message.delete().catch(() => {});

      const poisonous = Math.random() < 0.1;

      const oldCount = (await potatoKV.get<number>(message.author.id)) || 0;
      const newCount = Math.max(
        0,
        oldCount +
          (poisonous
            ? -Math.max(
                1,
                Math.min(10, Math.floor((Math.random() * oldCount) / 4))
              )
            : 1)
      );

      await potatoKV.put(message.author.id, newCount);
      await potatoKV.delete('lastPotato');
      await message.reply(
        new discord.Embed({
          title: `${
            poisonous ? discord.decor.Emojis.SKULL : discord.decor.Emojis.POTATO
          } The potato has been claimed! ${discord.decor.Emojis.POTATO}`,
          description: `${message.author.getTag()} ${
            poisonous
              ? `tried to pick up a poisonous potato, poisoning ${
                  oldCount - newCount
                } potatos in the process`
              : 'has claimed a potato'
          }, and now holds onto **${newCount}** potato${
            newCount === 1 ? '' : 's'
          }.`,
          color: 0x873f16,
          thumbnail: { url: message.author.getAvatarUrl() },
          footer: {
            text: poisonous
              ? 'We will just let them deal with that...'
              : 'Imagine not being fast enough to claim the potato, could not be me!',
          },
        })
      );
    }

    return;
  } else {
    const [lastChannel, potatoId] =
      (await potatoKV.get<string>('lastPotato'))?.split('-') || [];

    await discord
      .getGuild()
      .then(
        (g) =>
          g.getChannel(lastChannel) as Promise<
            discord.GuildTextChannel | undefined
          >
      )
      .then((c) => c?.getMessage(potatoId))
      .then((m) => m?.delete())
      .catch(() => {});
  }

  if (Math.random() > 0.3) return;

  const reply = await message.reply(
    new discord.Embed({
      title: 'A potato has been dropped!',
      description: 'Type in a `🥔` to claim it before someone else gets it!',
      color: 0x873f16,
    })
  );

  const cooldown = randomTimeBetween(3 * 60 * 1000, 20 * 60 * 1000);

  await potatoKV.put('cooldown', true, { ttl: cooldown });
  await potatoKV.put('lastPotato', `${message.channelId}-${reply.id}`);
});

potatoCommands.subcommand('potato', (potatoSubcommands) => {
  setDefaultReply(potatoSubcommands);

  potatoSubcommands.on(
    { name: 'help', description: 'potato help' },
    () => ({}),
    async (message) => {
      if (!message.author || message.author.bot) return;
      await message.inlineReply(
        new discord.Embed({
          title: `${discord.decor.Emojis.POTATO} Help page ${discord.decor.Emojis.POTATO}`,
          description: [
            `When a ${discord.decor.Emojis.POTATO} is dropped, be the first to pick it up by posting a ${discord.decor.Emojis.POTATO}.`,
            '',
            'Example command:',
            '`!potato example <required field> [optional field]`',
            '',
            '**Command list**:',
            '- `!potato` - show off your potato balance to others',
            '- `!potato help` - shows this help message',
            '- `!potato inspect [user]` - inspect another [user]s potatos',
            '- `!potato top [count]` - view the top [count] potato collectors',
            '- `!potato role` - gives or removes the potato ping role',
            '',
            '- `!potato steal <who> <count>` - steal potatos from other people',
            '- `!potato give <who> <count>` - give some of your potatos to other people',
            '- `!potato drop` - drop one of your potatos. the fastest to pick it up gets it',
            '- `!potato gamble <count>` - gamble <count> potatos',
            '- `!potato beg` - beg for some potatos, maybe you will get some',
            '- `!potato hourly` - get some potatos every hour',
            '- `!potato daily` - get some potatos every 24 hours',
            '',
            '- `!potato shop list` - list all available shop items',
            '- `!potato shop buy <item>` - buy <item> from the shop',
          ].join('\n'),
        })
      );
    }
  );

  potatoSubcommands.on(
    { name: 'role', description: 'Toggles potato ping role' },
    (args) => ({}),
    async (message, {}) => {
      if (!message.author || message.author.bot) return;
      const target = message.author;
      const roleId = '974820425320243231';
      if (message.member.roles.includes(roleId)) {
        message.member.removeRole(roleId);
        await message.inlineReply(
          '✅ You already had the role so I removed it from you! Run the command if you want the role to be added to you!'
        );
        return;
      }
      message.member.addRole(roleId);
      await message.inlineReply(
        '✅ I gave you the role, you will now be pinged when a new update for the potato system comes out!'
      );
    }
  );

  potatoSubcommands.on(
    { name: '', description: 'Potato count' },
    (args) => ({}),
    async (message, {}) => {
      if (!message.author || message.author.bot) return;
      const target = message.author;
      const currentCount = (await potatoKV.get<number>(target.id)) || 0;
      await message.inlineReply(
        new discord.Embed({
          title: `${discord.decor.Emojis.POTATO} Potato Count ${discord.decor.Emojis.POTATO}`,
          description: `${message.author.getTag()} has ${currentCount} potato${
            currentCount === 1 ? '!' : 's!'
          }. ${discord.decor.Emojis.POTATO.repeat(
            Math.min(currentCount, 100)
          )}`,
          color: 0x11111c,
          thumbnail: { url: message.author.getAvatarUrl() },
        })
      );
    }
  );

  potatoSubcommands.on(
    { name: 'inspect', description: 'potato count' },
    (args) => ({ who: args.user() }),
    async (message, { who }) => {
      if (!message.author || message.author.bot) return;
      const currentCount = (await potatoKV.get<number>(who.id)) || 0;
      await message.inlineReply(
        new discord.Embed({
          title: `${discord.decor.Emojis.POTATO} potato count ${discord.decor.Emojis.POTATO}`,
          description: `${who.getTag()} has ${currentCount} potato${
            currentCount === 1 ? '!' : 's!'
          }. ${discord.decor.Emojis.POTATO.repeat(
            Math.min(currentCount, 100)
          )}`,
          color: 0x11111c,
          thumbnail: { url: who.getAvatarUrl() },
        })
      );
    }
  );

  potatoSubcommands.on(
    { name: 'gamble', description: 'gamble potatos' },
    (args) => ({ count: args.integer() }),
    async (message, { count }) => {
      if (!message.author || message.author.bot) return;
      if (await potatoKV.get<boolean>(`gamble-${message.author?.id}`))
        return await message.inlineReply(
          `⚠️ Getting a gambling addiction is a big problem! They ask you to wait before gambling again!`
        );

      const currentCount =
        (await potatoKV.get<number>(message.author?.id)) || 0;

      if (count > currentCount)
        return await message.inlineReply(
          '❌ You can only gamble as many potatos as you have! Silly.'
        );

      if (count > 30 || count < 1)
        return await message.inlineReply(
          '❌ You can only gamble between 1 and 30 potatos.'
        );

      await potatoKV.put(`gamble-${message.author?.id}`, true, {
        ttl: randomTimeBetween(2 * 60 * 1000, 5 * 60 * 1000),
      });

      const won = Math.random() > 0.5;
      const newCount = currentCount + count * (won ? 1 : -1);
      await potatoKV.put(message.author?.id, newCount);

      await message.inlineReply(
        new discord.Embed({
          title: `${discord.decor.Emojis.GAME_DIE} ${discord.decor.Emojis.POTATO} ${discord.decor.Emojis.GAME_DIE}`,
          description: `Your gambling ${won ? 'paid off' : 'sucked'}, you ${
            won ? 'won' : 'lost'
          } ${count} potato${count === 1 ? '' : 's'}, ${
            won ? 'giving you' : 'leaving you with'
          } a total of ${newCount} potato${
            newCount === 1 ? '' : 's'
          }.\n\n ${discord.decor.Emojis.POTATO.repeat(newCount)} ${
            won
              ? discord.decor.Emojis.CHART_WITH_UPWARDS_TREND
              : discord.decor.Emojis.CHART_WITH_DOWNWARDS_TREND
          }`,
          color: 0x11111c,
        })
      );
    }
  );

  potatoSubcommands.on(
    { name: 'steal', description: 'steal potatos' },
    (args) => ({ who: args.user(), count: args.integer() }),
    async (message, { who, count }) => {
      if (!message.author || message.author.bot) return;
      if (message.author?.id === who.id)
        return await message.inlineReply(
          "❌ You can't steal from yourself! Silly."
        );
      if (await potatoKV.get<boolean>(`steal-${message.author?.id}`))
        return await message.inlineReply(
          `⚠️ Your potato thief actions are being currently scrutinized. Lay low for a while!`
        );
      const success = Math.random() < 0.5;
      const userPotatos = (await potatoKV.get<number>(message.author?.id)) || 0;
      const targetPotatos = (await potatoKV.get<number>(who.id)) || 0;

      if (count > userPotatos)
        return await message.inlineReply(
          '❌ You can only steal as many potatos as you have!'
        );

      if (count > targetPotatos)
        return await message.inlineReply(
          '❌ That user doesnt have that many potatos!'
        );

      if (count < 1)
        return await message.inlineReply(
          '❌ You need to steal at least one potato!'
        );

      if (count > 20)
        return await message.inlineReply(
          '❌ Your very small hands can only carry 20 potatos!'
        );

      await potatoKV.put(`steal-${message.author?.id}`, true, {
        ttl: randomTimeBetween(3 * 60 * 1000, 10 * 60 * 1000),
      });

      const newUserPotatos = userPotatos + count * (success ? 1 : -1);
      const newTargetPotatos = targetPotatos + count * (success ? -1 : 1);

      await potatoKV.put(message.author?.id, newUserPotatos);
      await potatoKV.put(who.id, newTargetPotatos);

      await message.inlineReply(
        new discord.Embed({
          title: `${message.author.username}'s little heist`,
          description: `Your thievery ${success ? 'paid off' : 'sucked'}, you ${
            success ? 'stole' : 'gave'
          } ${count} potato${count === 1 ? '' : 's'} ${
            success ? 'from' : 'to'
          } ${who.getTag()}, ${
            success ? 'giving you a total of' : 'leaving you with'
          } ${newUserPotatos} potato${
            newUserPotatos === 1 ? '' : 's'
          }.\n\n ${discord.decor.Emojis.POTATO.repeat(newUserPotatos)} ${
            success
              ? discord.decor.Emojis.CHART_WITH_UPWARDS_TREND
              : discord.decor.Emojis.CHART_WITH_DOWNWARDS_TREND
          }`,
          color: 0x11111c,
        })
      );
    }
  );

  potatoSubcommands.on(
    { name: 'give', description: 'give potatos to other people' },
    (args) => ({ who: args.user(), count: args.integerOptional() }),
    async (message, { who, count }) => {
      if (!message.author || message.author.bot) return;
      if (message.author?.id === who.id)
        return await message.inlineReply(
          "❌ You can't give potatos to yourself!"
        );
      if (who.bot)
        return await message.inlineReply(
          "❌ You can't give potatos to bots! Bots are so dumb, they can not see the power of the potato!"
        );
      const userPotatos = (await potatoKV.get<number>(message.author?.id)) || 0;
      const targetPotatos = (await potatoKV.get<number>(who.id)) || 0;

      if (!count && count !== 0) count = 1;

      if (count > userPotatos)
        return await message.inlineReply(
          '❌ You can only give as many potatos as you have! Do I really have to tell you that?'
        );

      if (count < 1)
        return await message.inlineReply(
          '❌ You need to send at least one potato. Do I really have to tell you that?'
        );

      const newUserPotatos = userPotatos - count;
      const newTargetPotatos = targetPotatos + count;

      await potatoKV.put(message.author?.id, newUserPotatos);
      await potatoKV.put(who.id, newTargetPotatos);

      await message.inlineReply(
        `✅ You gave ${count} potato${
          count === 1 ? '' : 's'
        } to ${who.getTag()}, how nice of you!`
      );
    }
  );

  potatoSubcommands.on(
    { name: 'top', description: 'top potatos' },
    (args) => ({ count: args.integerOptional() }),
    async (message, { count }) => {
      if (!message.author || message.author.bot) return;
      count = Math.min(Math.max(3, count || 10), 20);
      const items = await potatoKV.items();
      const filtered = items.filter(
        (entry) =>
          !isNaN(entry.key as unknown as number) &&
          (entry.value as unknown as number) > 0
      );
      const sorted = filtered.sort(
        (a, b) => (b.value as number) - (a.value as number)
      );
      const top = sorted.slice(0, count);
      count = top.length;
      const userMap = await Promise.all(
        top.map((entry) =>
          discord
            .getUser(entry.key)
            .then((user) => ({ user, potatos: entry.value as number }))
        )
      );

      let description = `${discord.decor.Emojis.POTATO} **${filtered
        .reduce((a, b) => a + (b.value as number), 0)
        .toLocaleString()}**\n`;
      description += `${discord.decor.Emojis.MAN_FARMER} **${filtered.length}**\n\n`;
      description += `${discord.decor.Emojis.CHART_WITH_UPWARDS_TREND} **Ranks** ${discord.decor.Emojis.MUSCLE}\n`;

      for (const entry of userMap.slice(0, Math.max(3, count - 1))) {
        const { user, potatos } = entry;
        const place = userMap.indexOf(entry);
        description += `\` ${
          MEDALS[place] || `${(place + 1).toString().padStart(2, ' ')} `
        } \` **${user?.username}**#${
          user?.discriminator
        } - ${potatos.toLocaleString()} potatos\n`;
      }

      const ownIndex = sorted.findIndex(
        (item) => item.key === message.author.id
      );

      if (ownIndex >= count) {
        description += `\` ... \` *${ownIndex - count + 1}* other farmers\n`;
        description += `\` ${(ownIndex + 1).toString().padStart(2, ' ')} \` **${
          message.author.username
        }**#${message.author.discriminator} - ${sorted[ownIndex].value} potato${
          sorted[ownIndex].value === 1 ? '' : 's'
        }`;
      } else if (count > 3) {
        const { user, potatos } = userMap[count - 1];
        description += `\` ${count.toString().padStart(2, ' ')}  \` **${
          user?.username
        }**#${user?.discriminator} - ${potatos.toLocaleString()} potatos\n`;
      }

      await message.inlineReply(
        new discord.Embed({
          title: `${discord.decor.Emojis.TROPHY} Leaderboard​ ${discord.decor.Emojis.CROWN}`,
          description,
        })
      );
    }
  );

  potatoSubcommands.on(
    { name: 'drop', description: 'drop a potato in the chat' },
    () => ({}),
    async (message) => {
      if (!message.author || message.author.bot) return;
      const userPotatos = (await potatoKV.get<number>(message.author?.id)) || 0;

      if (!userPotatos)
        return await message.inlineReply("⚠️ You don't have any potatos!");

      const lastPotato = await potatoKV.get<string>('lastPotato');
      if (lastPotato)
        return await message.inlineReply(
          `⚠️ There is already an active potato waiting to be picked up in <#${
            lastPotato.split('-')[0]
          }>!`
        );

      await potatoKV.put(message.author?.id, userPotatos - 1);

      const reply = await message.reply(
        new discord.Embed({
          title: 'A potato has been dropped!',
          description: 'Type in a `🥔` to claim it!',
          color: 0x873f16,
        })
      );
      const cooldown = randomTimeBetween(3 * 60 * 1000, 20 * 60 * 1000);
      await potatoKV.put('cooldown', true, { ttl: cooldown });
      await potatoKV.put('lastPotato', `${message.channelId}-${reply.id}`, {
        ttl: cooldown,
      });
    }
  );

  potatoSubcommands.on(
    {
      name: 'modify',
      description: 'modify a users potatos',
    },
    (args) => ({ who: args.user(), count: args.string() }),
    async (message, { who, count }) => {
      if (!message.author || message.author.bot) return;
      if (!(await discord.command.filters.isAdministrator().filter(message)))
        return await message.inlineReply(
          '❌ Imagine trying to excute a admin command but not having admin. What a loser!'
        );
      const oldCount = (await potatoKV.get<number>(who.id)) || 0;

      let newCount = oldCount;
      if (count.startsWith('+')) newCount += parseInt(count.replace('+', ''));
      else if (count.startsWith('-'))
        newCount -= parseInt(count.replace('-', ''));
      else newCount = parseInt(count);

      if (isNaN(newCount as number))
        return await message.inlineReply(
          '⚠️ Invalid count, use a real number dummy!'
        );

      await potatoKV.put(who.id, newCount as number);
      await message.reply(
        `✅ ${who.getTag()}'s potatos have been updated to **${newCount}**!`
      );
      await message.delete();
    }
  );

  potatoSubcommands.on(
    { name: 'beg', description: 'beg for potatos' },
    () => ({}),
    async (message) => {
      if (!message.author || message.author.bot) return;
      if (await potatoKV.get<boolean>(`begcmd-${message.author.id}`))
        return await message.inlineReply(
          '⚠️ Stop begging so much, it makes you look like a big baby, the cooldown is only one minute ok?'
        );
      await potatoKV.put(`begcmd-${message.author.id}`, true, {
        ttl: Math.ceil(Date.now() / 1000 / 60) * 60 * 1000 - Date.now(),
      });
      let amount = Math.floor(Math.random() * 4);
      if (amount === 0) {
        return await message.inlineReply(
          '❌ You did not get anything from begging this time, maybe you should try again later?'
        );
      }
      const newCount = await potatoKV.transact(
        message.author.id,
        (prev: number | undefined) => (prev || 0) + amount
      );
      await message.inlineReply(
        `✅ You got **${amount}** potato(s) from begging, and now hold onto **${newCount}** potatos!`
      );
    }
  );

  potatoSubcommands.on(
    { name: 'hourly', description: 'hourly potato' },
    () => ({}),
    async (message) => {
      if (!message.author || message.author.bot) return;
      if (await potatoKV.get<boolean>(`hourly-${message.author.id}`)) {
        return await message.inlineReply(
          new discord.Embed({
            description: `❌ You have already claimed your hourly potato! You think I am made out of potatos?`,
            color: 0xff0000,
            footer: { text: 'Ah yes, hourly potatoes do not be going brrr' },
          })
        );
      }

      await potatoKV.put(`hourly-${message.author.id}`, true, {
        ttl:
          Math.ceil(Date.now() / 1000 / 60 / 60) * 60 * 60 * 1000 - Date.now(),
      });
      let amount = 3;
      const newCount = await potatoKV.transact(
        message.author.id,
        (prev: number | undefined) => (prev || 0) + amount
      );
      await message.inlineReply(
        new discord.Embed({
          description: `✅ You claimed **${amount}** potatos as your hourly reward, and now hold onto **${newCount}** potatos!`,
          color: 0x00ff00,
          footer: { text: 'Ah yes, hourly potatoes do be going brrr' },
        })
      );
    }
  );

  potatoSubcommands.on(
    { name: 'daily', description: 'daily potato' },
    () => ({}),
    async (message) => {
      if (!message.author || message.author.bot) return;
      if (await potatoKV.get<boolean>(`daily-${message.author.id}`)) {
        return await message.inlineReply(
          new discord.Embed({
            description: `❌ You have already claimed your daily potato! You think I am made out of potatos?`,
            color: 0xff0000,
            footer: { text: 'Ah yes, daily potatoes do not be going brrr' },
          })
        );
      }
      await potatoKV.put(`daily-${message.author.id}`, true, {
        ttl:
          Math.ceil(Date.now() / 1000 / 60 / 60 / 24) * 24 * 60 * 60 * 1000 -
          Date.now(),
      });
      let amount = 10;
      const newCount = await potatoKV.transact(
        message.author.id,
        (prev: number | undefined) => (prev || 0) + amount
      );
      await message.inlineReply(
        new discord.Embed({
          description: `✅ You claimed **${amount}** potatos as your daily reward, and now hold onto **${newCount}** potatos!`,
          color: 0x00ff00,
          footer: { text: 'Ah yes, daily potatoes do be going brrr' },
        })
      );
    }
  );

  const shop = potatoSubcommands.subcommandGroup({
    name: 'shop',
    description: 'potato shop commands',
  });

  const SHOP_ITEMS = {
    marble: {
      price: 1,
      description:
        '`marble` Buy a invisable marble that you lose right after you buy it!',
      async onPurchase(user: discord.User) {
        // the user just lost their marble :(
      },
      enabled: true,
      duration: 24 * 60 * 60 * 1000, // 24 hours, checked in 5 minute intervals
    },
    notScam: {
      price: 30,
      description:
        '`notScam` Buy 20 potatoes with 30 potatoes... Why on earth would you do this???',
      async onPurchase(user: discord.User) {
        await potatoKV.transact(
          user.id,
          (prev: number | undefined) => (prev || 0) + 20
        );
      },
      enabled: true,
      duration: 24 * 60 * 60 * 1000, // 24 hours, checked in 5 minute intervals
    },
    echo: {
      price: 9999999,
      description:
        '`echo` Get Echo in a box! Comes within 1-2 days, with free shipping!',
      async onPurchase(user: discord.User) {},
      enabled: true,
      duration: 24 * 60 * 60 * 1000, // 24 hours, checked in 5 minute intervals
    },
  } as {
    [key: string]: {
      price: number;
      duration: number | undefined;
      description: string;
      enabled: boolean;
      onPurchase: Function;
    };
  };
  const MEDALS = [
    discord.decor.Emojis.FIRST_PLACE_MEDAL,
    discord.decor.Emojis.SECOND_PLACE_MEDAL,
    discord.decor.Emojis.THIRD_PLACE_MEDAL,
  ];

  setDefaultReply(shop);

  shop.on(
    { name: 'list', aliases: [''], description: 'list all potato shop items' },
    () => ({}),
    async (message) => {
      if (!message.author || message.author.bot) return;
      const fields = await Promise.all(
        Object.entries(SHOP_ITEMS)
          .filter(([, item]) => item.enabled)
          .map(async ([name, item]) => ({
            name: `${name} - ${item.price} ${discord.decor.Emojis.POTATO}`,
            value: item.description,
            inline: false,
          }))
      );

      await message.inlineReply(
        new discord.Embed({
          title: 'The Great Potato Shop',
          description: `Currently, the shop is **open**! You can buy something buy something by using \`!potato shop buy <id>\`, the item id is listed with the item.`,
          color: 0x00ff00,
          fields,
        })
      );
    }
  );

  shop.on(
    {
      name: 'buy',
      aliases: ['purchase'],
      description: 'purchase a potato shop item',
    },
    (args) => ({ item: args.text() }),
    async (message, { item }) => {
      if (!message.author || message.author.bot) return;
      const itemObj = SHOP_ITEMS[item];
      if (!itemObj || !itemObj.enabled) {
        return await message.inlineReply(
          new discord.Embed({
            title: 'The Great Potato Shop',
            description: `❌ I do not know what that is! Use \`!potato shop list\` to get a list of items.`,
            color: 0xff0000,
            footer: {
              text: 'Imagine trying to buy something that does not exist',
            },
          })
        );
      }

      const userPotatos = (await potatoKV.get<number>(message.author.id)) || 0;
      if (userPotatos < itemObj.price) {
        return await message.inlineReply(
          new discord.Embed({
            title: 'The Great Potato Shop',
            description: `❌ You don't have enough potatos for that item!`,
            color: 0xff0000,
            footer: { text: 'Wow your so poor, what a bum!' },
          })
        );
      }

      try {
        await itemObj.onPurchase(message.author);
      } catch (err) {
        return await message.inlineReply(
          new discord.Embed({
            title: 'The Great Potato Shop',
            description: `⚠️ There was an error processing your order: ${err}`,
            color: 0xffee00,
            footer: { text: 'That was not supposed to happen!' },
          })
        );
      }

      await potatoKV.transact(
        message.author.id,
        (prev: number | undefined) => (prev || 0) - itemObj.price
      );

      await potatoKV.transact(
        'shop',
        (prev: pylon.JsonArray | undefined) =>
          [
            ...(prev || []),
            {
              user: message.author.id,
              item,
              expiresAt: itemObj.duration
                ? Date.now() + itemObj.duration
                : undefined,
            },
          ] as pylon.JsonArray
      );
      await message.inlineReply(
        new discord.Embed({
          title: 'The Great Potato Shop',
          description: `✅ You successfully purchased \`${item}\`!`,
          color: 0x00ff00,
          footer: { text: 'Thank you for your business!' },
        })
      );
    }
  );
});
