import { User } from '../../database/profile.js';
import config from '../../config.json' assert { type: 'json' };
import { ms } from 'printly.js';
import moment from 'moment';
import 'moment-duration-format';
import random from 'random-number-csprng';

export default {
    data: {
        name: 'mine',
        description: "Let's mine something today!",
    },
    run: async (client, interaction) => {
        const user = interaction.member;
        const userData =
            (await User.findOne({ id: user.id })) || new User({ id: user.id });

        const duration = moment
            .duration(userData.cooldowns.mine - Date.now())
            .format('m[m], s[s]');

        if (user && userData.cooldowns.mine > Date.now()) {
            return interaction.createMessage({
                contenr: `You can mine again in ${duration}`,
                flags: 64,
            });
        }

        if (user && userData.items.pickaxes < 1) {
            return interaction.createMessage({
                content: `:x: You don't have pickaxe to mine!`,
                flags: 64,
            });
        }

        let items = '';
        let rand = (await random(1, 1000)) / 10;
        let stoneAmount = 0;
        let ironOreAmount = 0;
        let mineCooldown = ms('3m');
        let stoneBoost = 0;
        let ironOreBoost = 0;
        if (userData.boost.cakeNormal > Date.now()) {
            stoneBoost += 65;
            ironOreBoost += 35;
        }
        if (rand <= 80) {
            stoneAmount = Math.floor(Math.random() * 4) + 1 + stoneBoost;
            items = `**${config.emojis.stone}Stone** ${stoneAmount}`;
        } else if (rand <= 90) {
            stoneAmount = Math.floor(Math.random() * 8) + 1 + stoneBoost;
            items = `**${config.emojis.stone}Stone** ${stoneAmount}`;
        } else if (rand <= 100) {
            stoneAmount = Math.floor(Math.random() * 12) + 1 + stoneBoost;
            ironOreAmount = Math.floor(Math.random() * 14) + 1 + ironOreBoost;
            items = `**${config.emojis.stone}Stone** ${stoneAmount} and **${config.emojis.ironOre}Iron Ore** ${ironOreAmount}`;
        }

        userData.resources.stones += stoneAmount;
        userData.resources.ironOres += ironOreAmount;
        userData.health.pickaxe += 1;
        userData.cooldowns.mine = Date.now() + mineCooldown;
        if (userData.health.pickaxe == 27) {
            userData.health.pickaxe -= 27;
            userData.items.pickaxe -= 1;
        }
        userData.save();

        await interaction.createMessage({
            content: `You found ${items} from mining Happy work!`,
        });
    },
};
