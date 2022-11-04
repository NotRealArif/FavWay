import { commands } from "../handlers/commands.js";
import { CommandInteraction, ComponentInteraction } from "eris";
import { colour } from "printly.js";
import { User } from "../database/profile.js";
import config from "../config.json" assert { type: "json" };

export function interactionCreate(client, interaction) {
  client.on("interactionCreate", async (interaction) => {
    if (interaction instanceof CommandInteraction) {
      for (let slashCommand of commands) {
        if (slashCommand.name === interaction.data.name) {
          await slashCommand.run(client, interaction)
          const user = interaction.member;
          const userData = await User.findOne({ id: user.id }) || new User({ id: user.id });
          userData.commandRans += 1;
          userData.save();
            break
        }
      }
    }
  });
  console.log(colour.cyanBright("[Event] interactionCreate.js is loaded"));
}