// Configure the roles you would like to use here
// The record maps choice name -> Discord role ID
const ROLES: Record<string, string> = {
  'Giveaway ping': '972251344872284240',
  'Chat revival': '972251625668366376',
  'Tweet ping': '972252086840471562',
  'He/Him/His': '972264415812550666',
  'She/Her/Hers': '972264485047910410',
  'They/Them/Theirs': '972264670599737374'
};

discord.interactions.commands.register(
  {
    name: 'role',
    description: 'Add/Remove a role from yourself!',
    ackBehavior: discord.interactions.commands.AckBehavior.MANUAL,
    options: (opts) => ({
      role: opts.string({
        required: true,
        description: 'The role to add/remove',
        choices: Object.keys(ROLES)
      })
    })
  },
  async (interaction, { role }) => {
    const roleId = ROLES[role];
    if (!roleId) {
      await interaction.respondEphemeral(
        '❌ Something unexpected happened! Please ping Echo/Piplup so they can fix this!'
      );
      return;
    }
    if (interaction.member.roles.includes(roleId)) {
      await interaction.member.removeRole(roleId);
      await interaction.respondEphemeral(
        `✅ Since you already had the \`${role}\` role, I removed it from you!`
      );
      return;
    }
    await interaction.member.addRole(roleId);
    await interaction.respondEphemeral(
      `✅ You've been given the \`${role}\` role!`
    );
  }
);