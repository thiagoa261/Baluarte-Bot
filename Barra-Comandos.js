const dotenv = require("dotenv");
dotenv.config();

const { REST, Routes } = require("discord.js");

const fs = require("node:fs");
const path = require("node:path");

const commandFiles = fs
  .readdirSync(path.join(__dirname, "./commands"))
  .filter((file) => file.endsWith(".js"));

const commands = [];

for (const file of commandFiles) {
  const command = require("./commands/" + file);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  console.log(`Registrando ${commands.length} comandos`);

  try {
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands,
    });

    console.log("Comandos registrados com sucesso!");
  } catch (error) {
    console.error(error);
  }
})();
