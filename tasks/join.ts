// This script here detects is a user is joining or leaving then sends a message 
// into a channel. You will get a error saying Object is possibly 'null'. Just 
// ignore it!

discord.on('GUILD_MEMBER_ADD', async (member) => {
  const channelId = await discord.getGuildTextChannel('971795641409888326');
  await channelId.sendMessage(
    '📥 ' +
      member.toMention() +
      ' has joined the server! Be sure to read <#971777923663138858> before chatting with others!'
  );
});

discord.on('GUILD_MEMBER_REMOVE', async (member) => {
  const channelId = await discord.getTextChannel('971795641409888326');
  await channelId.sendMessage(
    '📤 **' + member.user.username + '** has left the server. Imagine.'
  );
});