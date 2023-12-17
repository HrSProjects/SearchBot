require("dotenv/config");
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const { Console } = require("rxl-rest");
// Client Config
const client = new Client({
  intents: [Object.keys(GatewayIntentBits)],
  partials: [Object.keys(Partials)],
});
// Execute Functions
const { Run } = require("./src/functions/Run");
Run(client);

// Make Module for client & Definition the token
module.exports.Client = client;
const token = process.env.TOKEN;

// Login to bot
client.login(token);

// Debugging Errors
Console.DebuggingErrors();
