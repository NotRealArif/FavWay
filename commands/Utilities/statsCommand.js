const { EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");
const { Profile } = require("../../database/game/profile");
const { printly, ms } = require("printly.js");
const config = require("../../config.json");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
    name: "stats",
    description: "Check out FavWay Statistics.",
    botPerm: [""],
    category: "Utilities",
    
    run: async (client, interaction) => {

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
          .setTitle("Loading...")
          .setColor(config.colours.embed)
          .setDescription(`Please wait we are collecting **${config.bot.name}** data for you.`)
          .setTimestamp(),
        ],
      });

      const guildstotal = await client.shard.fetchClientValues('guilds.cache.size')
      const userstotal = await client.shard.fetchClientValues('users.cache.size')
      const channelstotal = await client.shard.fetchClientValues('channels.cache.size')

      const uptimeDuration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");

      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
          .setTitle(`**${config.bot.name}** Statistics`)
          .setColor(config.colours.embed)
          .setDescription(`Here is **${config.bot.name}** full statistics of this month.`)
          .setFields(
            {
              name: 'General',
              value: `**Servers:** ${guildstotal}\n**Users:** ${userstotal}\n**Channels:** ${channelstotal}`,
              inline: false
            },
            {
              name: 'System',
              value: `**Uptime:** ${uptimeDuration}`
            }
          )
          .setTimestamp(),
        ],
      });
    }
}