const {
  SlashCommandBuilder,
  Client,
  ChatInputCommandInteraction,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Get Client Response"),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });

    return await interaction.editReply({
      content: `🚀 Client Response: **${client.user.id}**`,
    });
  },
};
