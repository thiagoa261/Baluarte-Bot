const dotenv = require("dotenv");
dotenv.config();

const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection();

console.log("\nIniciando Baluarte...");

const fs = require("node:fs");
const path = require("node:path");

const commandFiles = fs
  .readdirSync(path.join(__dirname, "./commands"))
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(__dirname, "./commands", file);
  const command = require(filePath);

  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`Comando ${filePath} com problemas`);
  }
}

client.on("ready", (bot) => {
  console.log(`Baluarte online como: ${client.user?.tag}!`);
});

client.login(process.env.DISCORD_TOKEN);

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.log(error);
  }
});
