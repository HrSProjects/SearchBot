const { EmbedBuilder } = require("discord.js");
const { color } = require("../json/config.json");
const axios = require("axios");

async function PlaylistInformations(interaction) {
  try {
    const response = await axios.get(
      `https://youtube.googleapis.com/youtube/v3/playlists?part=snippet&channelId=${process.env.YOUTUBE_PROFILE}&maxResults=25&key=${process.env.CONSOLEGOOGLE_APIKEY}`
    );

    // Youtube Playlists Information Embed
    const PlayYtEmbed = new EmbedBuilder();

    if (response.status === 200) {
      const playlists = response.data.items;
      if (playlists.length > 0) {
        // Get the channel's thumbnail
        const channelInfo = await axios.get(
          `https://youtube.googleapis.com/youtube/v3/channels?part=snippet&id=${process.env.YOUTUBE_PROFILE}&key=${process.env.CONSOLEGOOGLE_APIKEY}`
        );

        const channelThumbnail =
          channelInfo.data.items[0]?.snippet.thumbnails?.default?.url;

        // Add channel thumbnail to the embed
        if (channelThumbnail) {
          PlayYtEmbed.setThumbnail(channelThumbnail);
        }

        const playlistInfo = playlists.map((playlist) => ({
          title: playlist.snippet.title,
          link: `https://www.youtube.com/playlist?list=${playlist.id}`,
        }));

        for (const playlist of playlistInfo) {
          PlayYtEmbed.addFields({
            name: `${playlist.title}`,
            value: `[Open Link](${playlist.link})`,
            inline: false,
          });
          PlayYtEmbed.setColor(color);
        }

        await interaction.editReply({
          embeds: [PlayYtEmbed],
        });
      } else {
        await interaction.editReply({
          content: "No playlists found for this channel",
        });
      }
    } else {
      await interaction.editReply({
        content: "Failed to fetch data from YouTube",
      });
    }
  } catch (error) {
    console.error("Error fetching playlists:", error);
    await interaction.editReply({
      content: "An error occurred while fetching data",
    });
  }
}

async function VideoInformations(interaction) {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${process.env.YOUTUBE_PROFILE}&key=${process.env.CONSOLEGOOGLE_APIKEY}`
    );

    // Youtube Videos Information Embed
    const VideoYtEmbed = new EmbedBuilder();

    if (response.status === 200) {
      const videos = response.data.items;
      if (videos.length > 0) {
        // Reverse the videos to display from newer to older
        const videoInfo = videos.map((video) => ({
          title: video.snippet.title,
          link: `https://www.youtube.com/watch?v=${video.id.videoId}`,
          thumbnail: video.snippet.thumbnails.default.url, // Thumbnail URL
        }));

        for (const video of videoInfo) {
          VideoYtEmbed.addFields({
            name: `${video.title}`,
            value: `[Open Link](${video.link})`,
            inline: false,
          });
        }

        // Set thumbnail for the first video only
        VideoYtEmbed.setThumbnail(videoInfo[0].thumbnail);

        await interaction.editReply({
          embeds: [VideoYtEmbed],
        });
      } else {
        await interaction.editReply({
          content: "No videos found for this channel",
        });
      }
    } else {
      await interaction.editReply({
        content: "Failed to fetch data from YouTube",
      });
    }
  } catch (error) {
    console.error("Error fetching videos:", error);
    await interaction.editReply({
      content: "An error occurred while fetching data",
    });
  }
}

module.exports = { PlaylistInformations, VideoInformations };
