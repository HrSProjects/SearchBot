const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
} = require("discord.js");
const {
  VideoInformations,
  PlaylistInformations,
} = require("../../functions/Youtube");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("search")
    .setDescription("Get Youtube [Videos, Playlists]")
    .addStringOption((o) =>
      o
        .setName("type")
        .setDescription("Select Type To Show the suggestions into it")
        .addChoices(
          {
            name: "Videos",
            value: "video",
          },
          {
            name: "Playlists",
            value: "playlist",
          }
        )
        .setRequired(true)
    ),
  /**
   * @param { ChatInputCommandInteraction } interaction
   * @param { Client } client
   */
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    const { options } = interaction;
    const type = options.getString("type");

    try {
      switch (type) {
        case "video":
          VideoInformations(interaction);
          break;

        case "playlist":
          PlaylistInformations(interaction);
          break;
        default:
          await interaction.editReply({
            content: `Something Wen't Wrong!`,
            ephemeral: true,
          });
          break;
      }
    } catch (error) {
      console.error(error);
      await interaction.editReply({
        content: "An error occurred while fetching data",
        ephemeral: true,
      });
    }
  },
};
