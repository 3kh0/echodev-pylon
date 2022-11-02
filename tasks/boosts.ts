discord.on(discord.Event.GUILD_MEMBER_UPDATE, async (member, oldMember) => {
  if (member.premiumSince && !oldMember.premiumSince) {
    const channelId = await discord.getGuildTextChannel('1037097414714212373');
    await channelId.sendMessage(
      `${member.user.toMention()} just started boosting!`
    );
    const gen = await discord.getGuildTextChannel('971769909136736268');
    await gen.sendMessage(
      'Arise all ye <@&972251625668366376>! ' +
        member.user.toMention() +
        ' has just boosted the server! Please thank them!'
    );
  }
});
