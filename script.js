import {config} from "dotenv"
config()
import {Configuration, OpenAIApi} from "openai"
import {Client, GatewayIntentBits, Routes} from "discord.js"
import{REST} from "@discordjs/rest"

const client = new Client({intents: [GatewayIntentBits.Guilds]})
client.login(process.env.BOT_TOKEN)

const CLIENT_ID = process.env.CLIENT_ID;

const commands =[{
    name: 'prompt',
    description: 'Prompts ChatGPT',
    options: [{
        name: 'prompt',
        description: 'The prompt you want to ask ChatGPT',
        type: 3,
        required: true,
    },
],
},
];

const rest = new REST({version: '10'}).setToken(process.env.BOT_TOKEN)

try {
    console.log('Started refreshing application (/) commands.');
  
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
  
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }

const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.API_KEY
}))

const chatResponse = async prompt =>{
    const botresponse = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages:[{role:"user", content: prompt}],
    })
    
    return botresponse.data.choices[0].message.content;
}

client.on('ready', ()=>[
    console.log(`${client.user.username} is ready!`)
])

client.on("interactionCreate", async (interaction) => {
    if(!interaction.isChatInputCommand){
        return;
    }
    if(interaction.commandName === 'prompt'){
    try{
        interaction.reply(await chatResponse(interaction.options.getString('prompt')));
        }catch(err){
            console.log(err);
        }
    }
})

