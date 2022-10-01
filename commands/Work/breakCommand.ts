const { ActionRowBuilder, EmbedBuilder, SelectMenuBuilder, ComponentType, Client } = require('discord.js');
const { ApplicationCommandOptionType } = require("discord.js");
const { Profile } = require("../../database/game/profile");
const Discord = require("discord.js");
const moment = require("moment");
const config = require("../../config.json");
const emojis = require("../../api/emojis.json");
const tips = require('../../tips.json');
const { ms } = require('printly.js');
const wait = require('node:timers/promises').setTimeout; 
require('moment-duration-format');

module.exports = {
    name: "break",
    description: "SubCommand of work",
    botPerm: [""],
    category: "Work",
    options: [{
      name: 'tree',
      description: 'break some trees and get woods, require: axe',
      type: ApplicationCommandOptionType.Subcommand,
    }],
    
    run: async (client, interaction) => {
      if (interaction.options.getSubcommand() === "tree") {

    const { guild } = interaction;
    const user = interaction.member.user;
    const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id })

    if (userData.equips.axe.wooden || userData.equips.axe.stone - 0)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colours.work)
            .setDescription("You dont have axe to break trees"),
        ],
      });
    
    const duration = moment
        .duration(userData.cooldowns.breaktree - Date.now())
        .format("m[m], s[s]");

    if (userData.cooldowns.breaktree > Date.now())
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colours.work)
            .setDescription(
              `⌛ You can break trees again in **\`${duration}\`**`
            ),
        ],
      });

    if (userData.equips.axe.wooden - 1)
    amount = Math.floor((Math.random() * 4) + 1);
    if (userData.equips.axe.stone - 1) 
    amount = Math.floor((Math.random() * 12) + 3);

    userData.woods += amount;
    userData.cooldowns.breaktree = Date.now() + ms("7s");
    userData.save();

    if (userData.equips.axe.wooden || userData.equips.axe.stone - 1)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`You cropped trees and you gots ${amount}${config.emojis.wood}Woods!`)
            .setColor(config.colours.work),
        ],
      });

      const logChannel = client.channels.cache.get(config.logs.workLog)
        
      const logger = new EmbedBuilder()
       .setColor(config.colours.logger)
       .setTitle("Command log")
       .setDescription(`**[Break Tree SubCommand]** run by **${interaction.user.tag}**`)
       .addFields(
          { name: "Value", value: `Got ${amount} woods from cropping some tree` },
          { name: "Guild:", value: `${guild.name}` }
        )
       .setTimestamp();
        
        logChannel.send({ embeds: [logger] }); 
      }
    }
};