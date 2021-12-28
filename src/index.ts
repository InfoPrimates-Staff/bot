import { Client as client, Intents, MessageActionRow, MessageButton } from "discord.js";
import { config } from "dotenv";
config();

const Client = new client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
});

Client.on("ready", () => {
  console.log("Lista!");
});

Client.on("messageCreate", async (message) => {
  if (message.content.length < 750 || message.content.startsWith("!")) return;
  const Row = new MessageActionRow().addComponents(
      new MessageButton()
      .setLabel("Ok")
      .setStyle("PRIMARY")
      .setCustomId("ok"),
      new MessageButton()
        .setLabel("Ignorar")
        .setStyle("PRIMARY")
        .setCustomId("ignore")
  )
  const buffr = Buffer.from(message.content, "utf8");
  let msg = await message.channel.send({
    files: [
      { attachment: buffr, name: `Mensaje de ${message.author.tag}.txt`,  },
    ],
    components: [
        Row,
    ]
  });

  const collector = msg.createMessageComponentCollector({componentType: "BUTTON",time: 30000 })

  collector.on("collect", i=>{
      if(i.member.user.id !== message.member.user.id) return i.reply({content:"No puedes usar este boton.", ephemeral: true})
      if (i.customId == "ok") {
          message.delete()
          msg.edit({components:[]})
    } else {
        msg.delete()
    }


  })
  collector.on("end", ()=>{
      msg.delete();        
})

});

Client.login(process.env.TOKEN)