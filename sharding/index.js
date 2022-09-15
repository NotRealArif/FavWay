const { ShardingManager } = require('discord.js');
const config = require("../config.json");
const { printly, colour } = require("printly.js");

let manager = new ShardingManager('./index.js', {
    token: process.env.TOKEN,
    totalShards: 1,
    mode: 'process',
    // execArgv: ['--inspect']
});

manager.on('shardCreate', shard => {
    printly(colour.grey(`[Shard ${shard.id + 1}] Ready!`));
})

manager.spawn();