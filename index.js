const TelegramApi = require('node-telegram-bot-api');
const dot = require('dotenv');
const commandListener = require('./modules/listeners/command-listener');
const textListener = require('./modules/listeners/text-listener');
const buttonListener = require('./modules/listeners/button-listener');

dot.config();
const token = process.env.TELEGRAMURL;

const bot = new TelegramApi(token, { polling: true });

bot.setMyCommands([
  { command: '/start', description: 'Начальное приветствие' },
  { command: '/help', description: 'Список всех команд' },
  { command: '/newtest', description: 'Создать новый тест' },
  { command: '/passtest', description: 'Проити тест' },
]);

// eslint-disable-next-line consistent-return
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const { data } = query;
  buttonListener(bot, chatId, data);
});

// eslint-disable-next-line consistent-return
bot.on('message', async (msg) => {
  const { text } = msg;
  const chatId = msg.chat.id;

  const res = await commandListener(bot, chatId, text);
  if (res) return;

  textListener(bot, chatId, text);
});
