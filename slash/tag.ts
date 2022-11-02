const tagTxt: Record<string, string> = {
  'How to revive chat':
    'You can revive the chat by using the command `/chat-revive`, make sure you use the command `/role` and get the Chat revive role!',
  'How to get roles':
    'You can get notification roles by using the command `/role`. If you want to change the color of your name use the command `/color`',
  'How to deploy the website':
    'Go to the github page found [here](https://github.com/3kh0/3kh0.github.io#host-the-website) to view the different services you can use to deploy the website. If you do not have that much expertise in this you might want to go to <#988900031912349699> and use some community-made links!',
};

discord.interactions.commands.register(
  {
    name: 'tag',
    description: 'Send template text',
    ackBehavior: discord.interactions.commands.AckBehavior.MANUAL,
    options: (opts) => ({
      tag: opts.string({
        required: true,
        description: 'The text to send',
        choices: Object.keys(tagTxt),
      }),
    }),
  },
  async (interaction, { tag }) => {
    const text = tagTxt[tag];
    if (!interaction.member.roles.includes('972148068453580872')) {
      await interaction.respondEphemeral(
        `❌ You do not have permission to use this command, please contact Echo if this is a mistake.`
      );
      return;
    }
    await interaction.respond(text);
  }
);
