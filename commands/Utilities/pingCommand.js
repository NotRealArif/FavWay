const Discord = require("discord.js");
const { EmbedBuilder, ApplicationCommandType } = require("discord.js");
const config = require("../../config.json");
const fetch = require("node-fetch");

module.exports = {
    name: "ping",
    category: "info",
    description: "Shows the bot's latency",
    type: ApplicationCommandType.ChatInput,
    Admin: false,
    
    run: async (client, interaction, args) => {
        const { guild } = interaction;

      let test = await fetch('https://endpoint.satify.cf/api/food/fruits').then(r => r.json());
        
        var ping = Date.now() - interaction.createdTimestamp;
        const embed = new EmbedBuilder()
            .setAuthor({ name: `${config.bot.name}`})
            .setColor(config.colours.embed)
            .setDescription(`Latency: **${ping}**ms \nAPI Latency: **${Math.round(client.ws.ping)}**ms`)
            .setFooter({ text: `${interaction.user.username}, ${test.name} ${test.emoji}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
            .setTimestamp();
        interaction.reply({ embeds: [embed] });

        const logChannel = client.channels.cache.get(config.logs.utilitiesLog)
        
        const logger = new EmbedBuilder()
            .setColor(config.colours.logger)
            .setTitle("Command log")
            .setDescription(`**[Ping Command]** run by **${interaction.user.tag}**`)
            .addFields(
                { name: "Guild:", value: `${guild.name}` }
            )
            .setTimestamp();
        
        logChannel.send({ embeds: [logger] });
    }
}