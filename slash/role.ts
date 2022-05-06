// Configure the roles you would like to use here
// The record maps choice name -> Discord role ID
const ROLES: Record<string, string> = {
  'Giveaway ping': '972251344872284240',
  'Chat revival': '972251625668366376',
  'Tweet ping': '972252086840471562'
};

discord.interactions.commands.register(
  {
    name: 'role',
    description: 'Add/Remove a role from yourself!',
    ackBehavior: discord.interactions.commands.AckBehavior.MANUAL,
    options: (opts) => ({
      role: opts.string({
        required: true,
        description: 'The role to add.',
        choices: Object.keys(ROLES)
      })
    })
  },
  async (interaction, { role }) => {
    const roleId = ROLES[role];
    if (!roleId) {
      await interaction.respond(
        '❌ Something unexpected happened! Please ping Echo so he can fix this!'
      );
      return;
    }
    if (interaction.member.roles.includes(roleId)) {
      await interaction.member.removeRole(roleId);
      await interaction.respond(
        `✅ Since you already had the \`${role}\` role, I removed it from you!`
      );
      return;
    }
    await interaction.member.addRole(roleId);
    await interaction.respond(`✅ You've been given the \`${role}\` role!`);
  }
);
