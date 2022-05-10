// Configure the roles you would like to use here
// The record maps choice name -> Discord role ID
const COLOR: Record<string, string> = {
  Red: '972955088404512889',
  Orange: '972955981506027570',
  Yellow: '972956081980600320',
  Green: '972956105300930561',
  Blue: '972956131209150484',
  Purple: '972956317742419988',
  Black: '972959437125984256',
  White: '972959574934057120',
  Mint: '972961776142540851'
};

discord.interactions.commands.register(
  {
    name: 'color',
    description: 'Add/Remove a color from yourself!',
    ackBehavior: discord.interactions.commands.AckBehavior.MANUAL,
    options: (opts) => ({
      role: opts.string({
        required: true,
        description: 'The color to add/remove',
        choices: Object.keys(COLOR)
      })
    })
  },
  async (interaction, { role }) => {
    const roleId = COLOR[role];
    if (!roleId) {
      await interaction.respondEphemeral(
        '❌ Something unexpected happened! Please ping Echo/Piplup so they can fix this!'
      );
      return;
    }
    if (interaction.member.roles.includes(roleId)) {
      await interaction.member.removeRole(roleId);
      await interaction.respondEphemeral(
        `✅ Since you already had the \`${role}\` color, I removed it from you!`
      );
      return;
    }
    await interaction.member.addRole(roleId);
    await interaction.respondEphemeral(
      `✅ You've been given the \`${role}\` color!`
    );
  }
);