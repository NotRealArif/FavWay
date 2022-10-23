const { ActionRowBuilder, EmbedBuilder, SelectMenuBuilder, ComponentType, Client } = require('discord.js');
const { ApplicationCommandOptionType } = require("discord.js");
const { Profile } = require("../../database/game/profile");
const Discord = require("discord.js");
const moment = require("moment");
const config = require("../../config.json");
const emojis = require("../../api/emojis.json");
const tips = require("../../tips.json");
const { ms } = require("printly.js");
const wait = require('node:timers/promises').setTimeout; 
require('moment-duration-format');

module.exports = {
    name: "buy",
    description: "SubCommand of Buy",
    botPerm: [""],
    category: "RolePlay",
    options: [{
      name: 'woodworking',
      description: 'Buy stuffs from Woodworking workshop',
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
        name: 'item',
        description: 'What type of stuff do you want to buy?',
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          { name: 'Wood', value: 'wood' }
        ], 
      }, {
          name: 'quantity',
          description: 'Please enter your item quantity to buy it.',
          type: ApplicationCommandOptionType.Number,
          required: false
      }],
    }, {
      name: 'lapidary',
      description: 'Buy stones, gems and many more from Lapidary shop',
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
        name: 'item',
        description: 'What type of stuff do you want to buy?',
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          { name: 'Stone', value: 'stone' },
        ]
      }, {
        name: 'quantity',
        description: 'Please enter your item quantity to buy it.',
        type: ApplicationCommandOptionType.Number,
        required: false
      }],
    }, {
      name: 'tools',
      description: 'Buy some tools to start your journey with FavWay!',
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
        name: 'tool',
        description: 'What tool do you want to buy?',
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          { name: 'Stone Axe', value: 'stoneAxe' },
          { name: 'Stone Pickaxe', value: 'stonePickaxe' },
          { name: 'Iron Axe', value: 'ironAxe' },
          { name: 'Iron Pickaxe', value: 'ironPickaxe' }
        ],
      }], 
    }, {
      name: 'foundry',
      description: 'Buy foundry items from Foundry Workshop.',
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
        name: 'item',
        description: 'What foundry item do you want?',
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          { name: 'Furnace', value: 'furnace' },
          { name: 'Forge', value: 'forge' },
          { name: 'Iron Brick', value: 'ironBrick' }
        ],
      }, {
        name: 'quantity',
        description: 'Please enter your item quatity.',
        type: ApplicationCommandOptionType.Number,
        required: false
      }],
    }, {
      name: 'ore',
      description: 'Buy types of ores from Ore Market.',
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
        name: 'ore',
        description: 'What ore do you want?',
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          { name: 'Iron Ore', value: 'ironOre' }
        ],
      }, {
        name: 'quantity',
        description: 'How much do you want to buy?',
        type: ApplicationCommandOptionType.Number,
        require: false
      }],
    }],
    
    run: async (client, interaction, args) => {
      
      if (interaction.options.getSubcommand() === "woodworking") {

      const quantity = interaction.options.getNumber('quantity') || '20';

      const { guild } = interaction;
      const user = interaction.member.user;
        
      const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id })

      userData.commandRans += 1;
      userData.save();

      if (interaction.options.get('item').value === "wood") {
        itemEmoji = config.emojis.wood;
        itemName = "Wood";
        price = quantity * 5;
      }
        
        if (userData.coins < price)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(`Sorry you don't have enough money to buy **${itemName}**`)
                .setColor(config.colours.error)
                .setTimestamp(),
            ],
          });
        
          userData.coins -= price; 
        if (interaction.options.get('item').value === "wood") {
          userData.resources.woods += quantity;
        }
          userData.save();

        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`You bought **${quantity.toLocaleString()}** ${itemEmoji}**${itemName}** at: ${config.emojis.currency} **${price}**`)
              .setColor(config.colours.success)
              .setTimestamp(),
          ],
        });

        const logChannel = client.channels.cache.get(config.logs.buyLog)
        
        const logger = new EmbedBuilder()
            .setColor(config.colours.logger)
            .setTitle("Command log")
            .setDescription(`**[Buy Workworking SubCommand]** run by **${interaction.user.tag}**`)
            .addFields(
                {
                  name: "Value:", value: `bought **${quantity}** ${itemEmoji}**${itemName}**`
                },
                { name: "Guild:", value: `${guild.name}` }
            )
            .setTimestamp();
        
        logChannel.send({ embeds: [logger] });
      
    } else if (interaction.options.getSubcommand() === "tools") {
        
      const tools = interaction.options.get('tool').value;

      const { guild } = interaction;
      const user = interaction.member.user;
        
      const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id })

      userData.commandRans += 1;
      userData.save();

      if (interaction.options.get('tool').value === 'stoneAxe') {
        price = 90;
        itemName = "Stone Axe";
        choice = userData.axe.stone
      }
      if (interaction.options.get('tool').value === 'stonePickaxe') {
        price = 120;
        itemName = "Stone Pickaxe";
        choice = userData.pickaxe.stone;
      }
      if (interaction.options.get('tool').value === 'ironAxe') {
        price = 450;
        itemName = "Iron Axe";
        choice = userData.axe.iron;
      }
      if (interaction.options.get('tool').value === 'stonePickaxe') {
        price = 570;
        itemName = "Iron Pickaxe";
        choice = userData.pickaxe.iron;
      }
        
        if (userData.coins < price)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(`Sorry you dont have enough money to buy **${itemName}**`)
                .setColor(config.colours.error)
                .setTimestamp(),
            ],
          });
        

        if (interaction.options.get('tool').value === "stoneAxe") {
        userData.axe.stone += 1;
        userData.coins -= price;
        }
        if (interaction.options.get('tool').value === "stonePickaxe") {
        userData.pickaxe.stone += 1;
        userData.coins -= price;
        }
        if (interaction.options.get('tool').value === "ironAxe") {
        userData.axe.iron += 1;
        userData.coins -= price;
        }
        if (interaction.options.get('tool').value === "ironPickaxe") {
        userData.pickaxe.iron += 1;
        userData.coins -= price;
        }
        userData.save();

        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`You bought ${itemName} for ${config.emojis.currency} **${price}**`)
              .setColor(config.colours.success)
              .setTimestamp(),
          ],
        });

        const logChannel = client.channels.cache.get(config.logs.buyLog)
        
        const logger = new EmbedBuilder()
            .setColor(config.colours.logger)
            .setTitle("Command log")
            .setDescription(`**[Buy Tools SubCommand]** run by **${interaction.user.tag}**`)
            .addFields(
                {
                  name: "Value:", value: `Bought **${tools}**`
                },
                { 
                  name: "Guild:", value: `${guild.name}`
                }
            )
            .setTimestamp();
        
        logChannel.send({ embeds: [logger] });
        
    } else if (interaction.options.getSubcommand() === "foundry") {

      const quantity = interaction.options.getNumber('quantity') || '20';
        
      const { guild } = interaction;
      const user = interaction.member.user;
        
      const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id })

      userData.commandRans += 1;
      userData.save();

      if (interaction.options.get('item').value === 'furnace') {
        price = 5999;
        itemName = "Furance";
        choice = userData.items.furnace;
      }
      if (interaction.options.get('item').value === 'forge') {
        price = 9000;
        itemName = "Forge";
        choice = userData.items.forge;
      }
      if (interaction.options.get('item').value === 'ironBrick') {
        price = quantity * 22;
        itemName = "Iron Brick";
        itemEmoji = config.emojis.ironBrick;
        choice = null;
      }

      if (user && choice) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
            .setTitle("Error: you already have")
            .setColor(config.colours.error)
            .setDescription(`Woohoo... You already have **${itemName}**\nYou don't need to buy anymore.`)
            .setTimestamp(),
          ],
        });
      }
        
        if (userData.coins < price )
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(`Sorry you dont have enough money to buy **${itemName}**`)
                .setColor(config.colours.error)
                .setTimestamp(),
            ],
          });

        if (interaction.options.get('item').value === "furnace") {
          userData.items.furnace = true;
          userData.coins -= price;
        }
        if (interaction.options.get('item').value === "forge") {
          userData.items.forge = true;
          userData.coins -= price;
        }
        if (interaction.options.get('item').value === "ironBrick") {
          userData.resources.ironBricks = quantity;
          userData.coins -= price;
        }
          userData.save();

        const success = new EmbedBuilder()
         .setColor(config.colours.success)
         .setTimestamp();
        
        if (interaction.options.get('item').value === "furnace" || "forge") {
          success.setDescription(`You bought **${itemName}** for ${config.emojis.currency} **${price}**`)
        } else {
          success.setDescription(`You bought **${quantity}** ${itemEmoji}**${itemName}** for ${config.emojis.currency} **${price}**`)
        }

        interaction.reply({ embeds: [success] });

        const logChannel = client.channels.cache.get(config.logs.buyLog)
        
        const logger = new EmbedBuilder()
            .setColor(config.colours.logger)
            .setTitle("Command log")
            .setDescription(`**[Buy Foundry SubCommand]** run by **${interaction.user.tag}**`)
            .addFields(
                {
                  name: "Value:", value: `Bought **${itemName}**`
                },
                { 
                  name: "Guild:", value: `${guild.name}`
                }
            )
            .setTimestamp();
        
        logChannel.send({ embeds: [logger] });
        
      } else if (interaction.options.getSubcommand() === "lapidary") {

      const quantity = interaction.options.getNumber('quantity') || '20';

      const { guild } = interaction;
      const user = interaction.member.user;
        
      const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id })

      userData.commandRans += 1;
      userData.save();
        
      if (interaction.options.get('item').value === "stone") {
        price = quantity * 7;
        itemName = "Stone";
        itemEmoji = config.emojis.stone;
      }
        
        if (userData.coins < price)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(`Sorry you don't have enough money to buy ${itemEmoji}**${itemName}**`)
                .setColor(config.colours.error)
                .setTimestamp(),
            ],
          });
        
        if (interaction.options.get('item').value === "stone") {
          userData.coins -= price;
          userData.resources.stones += quantity;
        }
          userData.save();

        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`You bought **${quantity.toLocaleString()}** ${itemEmoji}**${itemName}** at: ${config.emojis.currency} **${price}**`)
              .setColor(config.colours.success)
              .setTimestamp(),
          ],
        });

        const logChannel = client.channels.cache.get(config.logs.buyLog)
        
        const logger = new EmbedBuilder()
            .setColor(config.colours.logger)
            .setTitle("Command log")
            .setDescription(`**[Buy Lapidary SubCommand]** run by **${interaction.user.tag}**`)
            .addFields(
                {
                  name: "Value:", value: `bought **${quantity}** ${itemEmoji}**${itemName}**`
                },
                { name: "Guild:", value: `${guild.name}` }
            )
            .setTimestamp();
        
        logChannel.send({ embeds: [logger] });
        
      } else if (interaction.options.getSubcommand() === "ore") {

        const quantity = interaction.options.getNumber('quantity') || '20';

        const { guild } = interaction;
        const user = interaction.member.user;
        
        const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id })

        userData.commandRans += 1;
        userData.save();

        if (interaction.options.get('ore').value === "ironOre") {
          price = quantity * 16;
          itemName = "Iron Ore";
          itemEmoji = config.emojis.ironOre;
        }

        if (userData.coins < price)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(`Sorry you don't have enough money to buy ${itemEmoji}**${itemName}**`)
                .setColor(config.colours.error)
                .setTimestamp(),
            ],
          });

        if (interaction.options.get('ore').value === "ironOre") {
          userData.coins -= price;
          userData.resources.ironOres += quantity;
        }
          userData.save();

        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`You bought **${quantity.toLocaleString()}** ${itemEmoji}**${itemName}** at: ${config.emojis.currency} **${price}**`)
              .setColor(config.colours.success)
              .setTimestamp(),
          ],
        });

        const logChannel = client.channels.cache.get(config.logs.buyLog)
        
        const logger = new EmbedBuilder()
            .setColor(config.colours.logger)
            .setTitle("Command log")
            .setDescription(`**[Buy Ore SubCommand]** run by **${interaction.user.tag}**`)
            .addFields(
                {
                  name: "Value:", value: `bought **${quantity}** ${itemEmoji}**${itemName}**`
                },
                { name: "Guild:", value: `${guild.name}` }
            )
            .setTimestamp();
        
        logChannel.send({ embeds: [logger] });
      }
   }
}