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
      await interaction.editOriginal(
        '❌ Really? You are already verified dummy!'
      );
      return;
    }
    sleep(690420);
    await interaction.member.addRole(roleId);
    await interaction.editOriginal(
      "✅ You've been verifed! Here is what you can do now:\n- Hop over to <#971769909136736268> to talk with the others!\n- Do `/role` to get some roles for yourself.\nDo `/color` to change your name color.\nAnd so much more! Enjoy the server!"
    );
  }
);