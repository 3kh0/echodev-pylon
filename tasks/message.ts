const msgKv = new pylon.KVNamespace('message');
const authorKv = new pylon.KVNamespace('author');
const MsglogChannel = discord.getGuildTextChannel('972159547567374397');
discord.on('MESSAGE_CREATE', async (msg) => {
  if (!(msg.channelId == '972159547567374397') && msg.author.bot == false) {
    await msgKv.put(msg.channelId, `${msg.content}`);
    await authorKv.put(msg.channelId, msg.author.id);
  }
});
discord.on('CHANNEL_DELETE', async (channel) => {
  await msgKv.delete(channel.id);
});
discord.on('MESSAGE_DELETE', async (message) => {
  const msgcontent = await msgKv.get(message.channelId);
  const channelauthor = await authorKv.get<number>(message.channelId);
  const embed = new discord.Embed();
  const author = await discord.getUser(`${channelauthor}`);
  const avatar = author.getAvatarUrl();
  embed.setAuthor({
    name: `${author.username}#${author.discriminator} | ID: ${channelauthor}`,
    iconUrl: avatar
  });
  const server = await discord.getGuild();
  const ChannelsID = await server.getChannel(`${message.channelId}`);
  embed.setTitle(
    `Message deleted in #${ChannelsID.name} 
(Channel ID: ${message.channelId})`
  );
  embed.setDescription(`${msgcontent}`);
  embed.setColor(0xff0000);
  embed.setTimestamp(new Date().toISOString());
  const guild = await discord.getGuild();
  const channel = await guild.getChannel(
    '[channel which messages is logged in]'
  );
  if (guild && channel) {
    await channel.sendMessage({
      content: '',
      embed: embed
    });
  }
});
