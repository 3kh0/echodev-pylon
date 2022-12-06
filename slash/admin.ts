// Goofy person wanted admin >:)
// The record maps choice name -> Discord role ID
const ROLES: Record<string, string> = {
  'Admin :)': '############',
};

discord.interactions.commands.register(
  {
    name: 'admin',
    description: 'Get admin perms!!!!',
    ackBehavior: discord.interactions.commands.AckBehavior.MANUAL,
    options: (opts) => ({
      role: opts.string({
        required: true,
        description: 'Add/remove admin',
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
