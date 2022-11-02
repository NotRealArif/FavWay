import { Constants } from "eris";
import config from "../../config.json" assert { type: "json" };
import resource from "../../shopList/resources.json" assert { type: "json" };
import item from "../../shopList/items.json" assert { type: "json" };
import food from "../../shopList/foods.json" assert { type: "json" };
import crop from "../../shopList/crops.json" assert { type: "json" };

import { setTimeout as wait } from "node:timers/promises";

export default {
  data: {
    name: "shop",
    description: "Let's do some buying today!"
  },
  run: async (client, interaction) => {

    var resourceList = "";
    var itemList = "";
    var foodList = "";
    var cropList = "";

    resource.map(el => {
        resourceList += `${config.emojis[el.emoji]}**${el.name}** : ${config.emojis.coin}${el.price}\n${el.category}\n\n`;
    });
    let resources = {
      title: "Resources's Shop",
      color: 0xcec6ff,
      description: `${resourceList}`,
      timestamp: new Date()
    }

    item.map(el => {
        itemList += `${config.emojis[el.emoji]}**${el.name}** : ${config.emojis.coin}${el.price}\n${el.category}\n\n`;
    });
    let items = {
      title: "Item's Shop",
      color: 0xcec6ff,
      description: `${itemList}`,
      timestamp: new Date()
    }

    food.map(el => {
        foodList += `${config.emojis[el.emoji]}**${el.name}** : ${config.emojis.coin}${el.price}\n${el.category}\n\n`;
    });
    let foods = {
      title: "Food's Shop",
      color: 0xcec6ff,
      description: `${foodList}`,
      timestamp: new Date()
    }

    crop.map(el => {
        cropList += `${config.emojis[el.emoji]}**${el.name}** : ${config.emojis.coin}${el.price}\n${el.category}\n\n`;
    });
    let crops = {
      title: "Crop's Shop",
      color: 0xcec6ff,
      description: `${cropList}`,
      timestamp: new Date()
    }


    let menu = {
      type: 1,
      components: [{
        type: 3,
        custom_id: "menu",
        placeholder: "Explore more shops!",
        options: [
          {
            label: "Resources's Shop",
            description: "Here you can find all the resources from the Resource's Shop.",
            value: "resources"
          },
          {
            label: "Item's Shop",
            description: "Here you can find all the items from the Item's Shop.",
            value: "items"
          },
          {
            label: "Food's Shop",
            description: "Here you can find all the foods from the Food's Shop.",
            value: "foods"
          },
          {
            label: "Crop's Shop",
            description: "Here you can find all the crops from the Crop's Shop.",
            value: "crops"
          }
        ]
      }]
    }

    const message = await interaction.createMessage({ embeds: [resources], components: [menu] });

    client.on("interactionCreate", async (i) => {
      if (i.member.id !== interaction.member.id)
        return i.createMessage({
          content: "This is not your menu!.",
          flags: 64
        });
      if (i.data.custom_id === "menu") {
        await i.deferUpdate();
        if (i.data.values[0] === "resources") {
          await wait(100);
          await i.editOriginalMessage({ embeds: [resources] });
        } if (i.data.values[0] === "items") {
          await wait(100);
          await i.editOriginalMessage({ embeds: [items] });
        } if (i.data.values[0] === "foods") {
          await wait(100);
          await i.editOriginalMessage({ embeds: [foods] });
        } if (i.data.values[0] === "crops") {
          await wait(100);
          await i.editOriginalMessage({ embeds: [crops] });
        }
      }
    });
  }
}