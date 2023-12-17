const { Events, ActivityType } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    let ClientInfo = {
      Name: client.user.tag,
      Id: client.user.id,
      Guilds: client.guilds.cache.size,
      Users: client.users.cache.size,
    };

    // ====> Bot & Status Connection <==== \\
    let Users = await client.guilds.cache.reduce(
      (a, b) => a + b.memberCount,
      0
    );
    await console.table(ClientInfo);
    await console.log(`▶️ | Client Is Ready!`);
    await client.user.setPresence({
      activities: [
        {
          name: `Client Users: ${Users}`,
          type: ActivityType.Streaming,
          url: `https://www.twitch.tv/discord`,
        },
      ],
      status: "idle",
    });
  },
};
