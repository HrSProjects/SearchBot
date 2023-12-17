const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
        if (!command) return interaction.reply({ content: `No command matching ${interaction.commandName} was found.`, ephemeral: true });
        try {
            await command.execute(interaction, client);
        } catch (error) {
            interaction.reply({ content: `Error executing ${interaction.commandName}`, ephemeral: true });
            console.error(error);
        }
        } else if (interaction.isAutocomplete()) {
            const commands = interaction.client.commands.get(interaction.commandName);
    
            if (!commands) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
    
            try {
                await commands.autocomplete(interaction, client);
            } catch (error) {
                console.error(error);
            }
        }
    },
};