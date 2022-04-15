const TelegramApi = require('node-telegram-bot-api');
const commandManager = require('./modules/command-manager');
const directiveManager = require('./modules/directive-manager');
const testManager = require('./modules/test-manager');
const store = require('./modules/test-manager');
const testLocalManager = require('./modules/test-local-manager');
const dot = require('dotenv');
const commandListener = require('./modules/listeners/command-listener');

dot.config();
const token = process.env.TELEGRAMURL;

const bot = new TelegramApi(token, { polling: true });

// testManager.connectToDatabase();

bot.setMyCommands([
  { command: '/start', description: 'Начальное приветствие' },
  { command: '/help', description: 'Список всех команд' },
  { command: '/newtest', description: 'Создать новый тест' },
  { command: '/passtest', description: 'Проити тест' },
]);

// eslint-disable-next-line consistent-return
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const { data } = query;
  const direction = directiveManager.getDirective(chatId);
  const resData = testLocalManager.getResponseData(chatId);
  const selectedTest = testLocalManager.getTest(chatId);
  let passIndex = testLocalManager.getIndex(chatId);


  if (direction === directiveManager.constants.STARTPASSTEST) {
    const test = await testManager.findTest(chatId, data);
    const { questions } = test;
    if (questions.length < 1) {
      bot.sendMessage(chatId, 'End');
      directiveManager.resetDirective(chatId);
    } else {
      testLocalManager.setResponseData(chatId, questions);
      testLocalManager.innitStats(chatId);
      const question = questions[passIndex].title;
      const { answers } = questions[passIndex];
      directiveManager.passTest(chatId);
      commandManager.askQuestion(bot, chatId, question, answers);
    }
  }

  if (direction === directiveManager.constants.PASSTEST && resData) {
    const questions = resData;
    const { trueanswer } = questions[passIndex];
    if (data === trueanswer) testLocalManager.answerTrue(chatId);
    else testLocalManager.answerFalse(chatId);
    if (testLocalManager.getIndex(chatId) < questions.length - 1) {
      testLocalManager.increaseIndex(chatId);
      passIndex = passIndex + 1;
      const question = questions[passIndex].title;
      const { answers } = questions[passIndex];
      commandManager.askQuestion(bot, chatId, question, answers);
    } else {
      commandManager.passEnd(bot, chatId, testLocalManager.getStats(chatId));
      directiveManager.resetDirective(chatId);
      testLocalManager.resetStats(chatId);
    }
  }

  if (direction === directiveManager.constants.DELETE) {
    testManager.removeTest(chatId,data);
    bot.sendMessage(chatId, `${data} deleted`);
    directiveManager.resetDirective(chatId);
  }

  if (direction === directiveManager.constants.SETTITLE) {
    commandManager.setNewTitle(bot, chatId);
    testLocalManager.setTest(chatId, data);
  }

  if (direction === directiveManager.constants.ADDQUESTION) {
    commandManager.titleQuestions(bot, chatId);
    directiveManager.setTitleQuestion(chatId);
    testLocalManager.setTest(chatId, data);
  }

  if (direction === directiveManager.constants.TRUEANSWER && selectedTest && resData) {
    resData.trueanswer = data;
    testManager.addQuestion(chatId, selectedTest, resData);
    directiveManager.resetDirective(chatId);
    testLocalManager.setTest(chatId, '');
    testLocalManager.setResponseData(chatId, '');
    commandManager.questionAdded(bot, chatId);
  }

  if (direction === directiveManager.constants.SHOWQUESTIONS) {
    const res = await testManager.findTest(chatId, data);
    commandManager.showAllQuestions(bot, chatId, res);
    directiveManager.resetDirective(chatId);
  }

  if (direction === directiveManager.constants.REMOVEQUESTION) {
    commandManager.removeQuestion(bot, chatId);
    testLocalManager.setTest(chatId, data);
  }

  if (direction === directiveManager.constants.RESETQUESTIONS) {
    testManager.resetQuestions(chatId, data);
    commandManager.resetQuestions(bot, chatId);
    directiveManager.resetDirective(chatId);
  }
});

// eslint-disable-next-line consistent-return
bot.on('message', async (msg) => {
  const { text } = msg;
  const chatId = msg.chat.id;
  const direction = directiveManager.getDirective(chatId);
  const selectedTest = testLocalManager.getTest(chatId);
  const resData = testLocalManager.getResponseData(chatId);

  const res = await commandListener(bot, chatId, text);
  if (res) return;

  if (!direction) {
    commandManager.default(bot, chatId);
    return;
  }
  if (direction === directiveManager.constants.NEWTEST) {
    const res = await testManager.findTest(chatId,text);
    if (res) {
      bot.sendMessage(chatId, 'Такой тест уже существует введите другое название')
      return;
    }
    const newTest = {
      title: text,
      type: 'test',
      questions: [],
    };
    store.addTest(chatId, newTest);
    commandManager.createdTest(bot, chatId, text);
    directiveManager.resetDirective(chatId);
    return;
  }

  if (direction === directiveManager.constants.SETTITLE && selectedTest) {
    testManager.cahangeName(chatId, selectedTest, text);
    testLocalManager.setTest(chatId, '');
    directiveManager.resetDirective(chatId);
    commandManager.changedTitle(bot, chatId);
    return;
  }
  if (direction === directiveManager.constants.DELETE) {
    bot.sendMessage(text);
    return;
  }
  if (direction === directiveManager.constants.SETTITLEQUESTION && selectedTest) {
    const candidate = {
      title: text,
      answers: [],
      trueanswer: 0,
    };
    testLocalManager.setResponseData(chatId, candidate);
    commandManager.questionAnswers(bot, chatId);
    directiveManager.setQuestionAnswers(chatId);
    return;
  }
  if (direction === directiveManager.constants.QUESTIONANSWERS && selectedTest && resData) {
    const ress = text.split(',');
    resData.answers = ress;
    testLocalManager.setResponseData(chatId, resData);
    commandManager.trueAnswer(bot, chatId, ress);
    directiveManager.trueAnswer(chatId);
    return;
  }

  if (direction === directiveManager.constants.REMOVEQUESTION && selectedTest) {
    commandManager.removedQuestion(bot, chatId);
    testManager.removeQuestion(chatId, selectedTest, text);
    directiveManager.resetDirective(chatId);
    testLocalManager.setTest(chatId, '');
    return;
  }
});
