require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith('!chat')) return;

  const userMessage = message.content.slice(5).trim();

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userMessage }],
    });

    message.reply(response.data.choices[0].message.content);
  } catch (error) {
    console.error(error);
    message.reply("❌ صار خطأ من ChatGPT، حاول بعد شوي.");
  }
});

client.login(process.env.DISCORD_TOKEN);