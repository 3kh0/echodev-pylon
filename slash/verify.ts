discord.interactions.commands.register(
  {
    name: 'verify',
    description: 'Verify yourself!'
  },
  async (interaction) => {
    await interaction.respondEphemeral(
      '🔃 Verifying your discord account... This should not take too long!'
    );
    const roleId = '971775755853897740';
    if (interaction.member.roles.includes(roleId)) {
      await interaction.editOriginal('❌ You are already verified silly!');
      return;
    }
    sleep(2443);
    await interaction.member.addRole(roleId);
    await interaction.editOriginal(`✅ You've been verifed!`);
  }
);
