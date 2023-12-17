const {
  REST,
  Collection,
  ApplicationCommandType,
  Events,
  Routes,
} = require("discord.js");
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
const { readdirSync } = require("node:fs");
const path = require("node:path");
const ascii = require("ascii-table");

// Make Table to Events & SlashCommands
const SlashCommandsTable = new ascii("Slash Commands").setJustify();
const EventsTable = new ascii("Events").setJustify();

async function SlashCommandHandler(client) {
  const commands = [];
  client.commands = new Collection();
  const commandsDir = path.join(__dirname, "../commands");

  readdirSync(commandsDir).forEach((folder) => {
    const commandFiles = readdirSync(path.join(commandsDir, folder)).filter(
      (file) => file.endsWith(".js")
    );
    for (const file of commandFiles) {
      const command = require(path.join(commandsDir, folder, file));
      if (command.name && command.description) {
        commands.push({
          type: ApplicationCommandType.ChatInput,
          name: command.name,
          description: command.description,
          options: command.options || [],
        });
        client.commands.set(command.name, command);
        SlashCommandsTable.addRow(`/${command.name}`, "🟢 Working");
      } else if (command.data?.name && command.data?.description) {
        commands.push(command.data.toJSON());
        client.commands.set(command.data.name, command);
        SlashCommandsTable.addRow(`/${command.data.name}`, "🟢 Working");
      } else {
        SlashCommandsTable.addRow(file, "🔴 Not working");
      }
    }
  });
  console.log(SlashCommandsTable.toString());

  client.once(Events.ClientReady, async (c) => {
    try {
      const data = await rest.put(Routes.applicationCommands(c.user.id), {
        body: commands,
      });
      await console.log(
        `🟢 | Started refreshing ${commands.length} application (/) commands.`
      );
      await console.log(
        `🟢 | Successfully reloaded ${data.length} application (/) commands.`
      );
    } catch (error) {
      console.error(error);
    }
  });
}

// -> Events
async function EventHandler(client) {
  const eventsDir = path.join(__dirname, "../events");
  readdirSync(eventsDir).forEach((folder) => {
    const eventFiles = readdirSync(path.join(eventsDir, folder)).filter(
      (file) => file.endsWith(".js")
    );
    for (const file of eventFiles) {
      const event = require(path.join(eventsDir, folder, file));
      if (event.name) {
        if (event.once) {
          client.once(event.name, (...args) => event.execute(...args, client));
        } else {
          client.on(event.name, (...args) => event.execute(...args, client));
        }
        EventsTable.addRow(event.name, "🟢 Working");
      } else {
        EventsTable.addRow(file, "🔴 Not working");
      }
    }
  });
  console.log(EventsTable.toString());
}

// -> Express
async function Express(client) {
  const express = require("express");
  const app = express();
  const port = process.env.PORT || 3000;

  app.get("/", (req, res, next) => {
    res.send("Hello World!");
  });
  app.listen(port, () => {
    setTimeout(() => {
      console.log(`🟢 | Connected to port: http://localhost:${port}`);
    }, 2 * 1000); // 2 * 1000 = 2 seconds
  });
}

async function Run(client) {
  Express(client);
  SlashCommandHandler(client);
  EventHandler(client);
}

module.exports = { Run };
