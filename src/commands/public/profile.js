const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Return Chess.com profile")
    .addStringOption((o) =>
      o.setName("name").setDescription("Chess.com Player").setRequired(true)
    ),

  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });

    let player = interaction.options.getString("name");

    axios
      .get("https://api.chess.com/pub/player/" + player)
      .then(async (response) => {
        let data = response.data;
        if (response.status !== 200)
          return await interaction.editReply({ content: "No Little data" });
        return await interaction.editReply({ content: data.avatar || "No data" });
      })
      .catch(async (error) => {
        console.log(error);
        return await interaction.editReply({ content: "No data been found" });
      });
  },
};
