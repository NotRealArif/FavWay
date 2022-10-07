const { ActionRowBuilder, SelectMenuBuilder, ComponentType, Client } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const { Profile } = require("../../database/game/profile");
const Discord = require("discord.js");
const config = require("../../config.json");
const emojis = require("../../api/emojis.json");
const tips = require('../../tips.json');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    name: "inventory",
    description: "Check your Inventory",
    botPerm: [""],
    category: "RolePlay",
    
    run: async (client, interaction, args) => {
        
        const user = interaction.member.user
        const { guild } = interaction;
        
        const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id })
        
        let tip = tips.tip[Math.floor((Math.random() * tips.tip.length))];
        
        let emoji = emojis.emoji[Math.floor((Math.random() * emojis.emoji.length))];


      if (userData.resources.woods || userData.resources.stones) {
        resourcesMessage = "Nice resources";
      } else {
        resourcesMessage = "You don't have any resources";
      }
      
        let resources = new EmbedBuilder()
        .setTitle(`${user.username}'s Inventory`)
        .setDescription(`${resourcesMessage}`)
        .setColor(config.colours.embed)
        .setThumbnail(user.displayAvatarURL())
        .setTimestamp()
      if (userData.resources.woods) {
        resources.addFields({ name: `${config.emojis.wood}Wood`, value: `${userData.resources.woods.toLocaleString()}` })
      }
      if (userData.resources.stones) {
        resources.addFields({ name: `${config.emojis.stone}Stone`, value: `${userData.resources.stones.toLocaleString()}` })
      }
      if (userData.resources.ironOres) {
        resources.addFields({ name: `${config.emojis.ironOre}Iron Ore`, value: `${userData.resources.ironOres.toLocaleString()}` })
      }


      if (userData.axe.stone || userData.pickaxe.stone) {
        toolsMessage = "Nice tools";
      } else {
        toolsMessage = "You don't have any tools";
      }
        let tools = new EmbedBuilder()
        .setTitle(`${user.username}'s Inventory`)
        .setDescription(`${toolsMessage}`)
        .setColor(config.colours.embed)
        .setThumbnail(user.displayAvatarURL())
        .setTimestamp()
      if (userData.axe.stone) {
        tools.addFields({ name: `Axe`, value: `own` })
      }
      if (userData.pickaxe.stone) {
        tools.addFields({ name: `Pickaxe`, value: `own` })
      }
        
        
        const row = new ActionRowBuilder()
			.addComponents(
				new SelectMenuBuilder()
					.setCustomId('inventory')
					.setPlaceholder('View items by category.')
					.addOptions(
						{
							label: 'Resources',
							description: 'View your resources',
							value: 'resources',
						},
            {
              label: 'Tools',
              description: 'View your tools',
              value: 'tools',
            },
					),
			);
      
      
        let message = await interaction.reply({ embeds: [resources], components: [row], fetchReply: true });

        const logChannel = client.channels.cache.get(config.logs.roleplayLog)
        
        const logger = new EmbedBuilder()
            .setColor(config.colours.logger)
            .setTitle("Command log")
            .setDescription(`**[Inventory Command]** run by ${interaction.user.tag}`)
            .addFields(
                { name: "Guild:", value: `${guild.name}` }
            )
            .setTimestamp();

        let viewRes = new EmbedBuilder()
            .setColor(config.colours.logger)
            .setTitle("Command log")
            .setDescription(`**[Inventory Command]** viewing resources **${interaction.user.tag}**`)
            .addFields(
                { name: "Guild:", value: `${guild.name}` }
            )
            .setTimestamp();

        let viewTools = new EmbedBuilder()
            .setColor(config.colours.logger)
            .setTitle("Command log")
            .setDescription(`**[Inventory Command]** viewing tools **${interaction.user.tag}**`)
            .addFields(
                { name: "Guild:", value: `${guild.name}` }
            )
            .setTimestamp();
        
        logChannel.send({ embeds: [logger] });
        
        const collector = message.createMessageComponentCollector({ 
            filter: fn => fn,
            componentType: ComponentType.SelectMenu, 
            time: 2000 
        });

collector.on('collect', i => {
	if (i.user.id === interaction.user.id) 
		return i.reply({ content: `These menu aren't for you!`, ephemeral: true });
});
        
        
client.on('interactionCreate', async (interaction, client) => {
    if (!interaction.isSelectMenu()) return;
            
    switch (interaction.values[0]) {
        case "tools":  
           await interaction.deferUpdate();
           await wait(100);
           await interaction.editReply({ embeds: [tools], components: [row] })
           await logChannel.send({ embeds: [viewTools] });
            break;
        case "resources":  
           await interaction.deferUpdate();
           await wait(100);
           await interaction.editReply({ embeds: [resources], components: [row] })
           await logChannel.send({ embeds: [viewRes] });
            break;
    };                
});
    }
}
