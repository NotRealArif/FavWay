import { commands } from '../handlers/commands.js';
import { CommandInteraction, ComponentInteraction } from 'eris';
import { colour, ms } from 'printly.js';
import { User } from '../database/profile.js';
import config from '../config.json' assert { type: 'json' };

const InteractionType = {
    command: 1,
};
export { InteractionType };

export function interactionCreate(client, interaction) {
    client.on('interactionCreate', async (interaction) => {
        if (interaction instanceof CommandInteraction) {
            for (let slashCommand of commands) {
                if (slashCommand.name === interaction.data.name) {
                    const user = interaction.member;
                    const userData = await User.findOne({
                        id: user.id,
                    });
                    const dmChannel = await client.getDMChannel(
                        interaction.member.id
                    );
                    if (!userData) {
                        await client.createMessage(dmChannel.id, {
                            content: `**Welcome to FavWay, ${user.username}!**\n**FavWay** is a another Discord to have fun with it, it's have roleplay system where users can play mini version of roleplay games.\n\n**FavWay Community**\nhttps://discord.gg/Ea4jrSSrjM`,
                        });
                        await User.create({
                            id: user.id,
                        });
                        console.info(
                            `user: ${user.username} account has been created!`
                        );
                    }
                    await slashCommand.run(client, interaction);
                    userData.commandRans += 1;
                    // userData.xp += Math.floor(Math.random() * 5);
                    userData.lastTime = Date.now();
                    userData.save();
                    break;
                }
            }
        } else if (interaction instanceof ComponentInteraction) {
        }
    });
    console.log(colour.cyanBright('[Event] interactionCreate.js is loaded'));
}
