const testStoreManager = require('../test-store-manager');
const commandManager = require('../command-manager');
const directiveManager = require('../directive-manager');
const testLocalManager = require('../test-local-manager');

const textListener = async (bot, chatId, text) => {
  const direction = directiveManager.getDirective(chatId);
  const selectedTest = testLocalManager.getTest(chatId);
  const resData = testLocalManager.getResponseData(chatId);
  try {
    if (!direction) {
      commandManager.default(bot, chatId);
      return;
    }
    if (direction === directiveManager.constants.NEWTEST) {
      const res = await testStoreManager.findTest(chatId, text);
      if (res) {
        bot.sendMessage(chatId, 'Такой тест уже существует введите другое название');
        return;
      }
      const newTest = {
        title: text,
        type: 'test',
        questions: [],
      };
      testStoreManager.addTest(chatId, newTest);
      commandManager.createdTest(bot, chatId, text);
      directiveManager.resetDirective(chatId);
      return;
    }

    if (direction === directiveManager.constants.SETTITLE && selectedTest) {
      testStoreManager.cahangeName(chatId, selectedTest, text);
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
      testStoreManager.removeQuestion(chatId, selectedTest, text);
      directiveManager.resetDirective(chatId);
      testLocalManager.setTest(chatId, '');
      return;
    }
  } catch (e) {
    directiveManager.resetDirective(chatId);
    bot.sendMessage(chatId, 'Упс, что-то пошло не так');
    testLocalManager.resetAll(chatId);
    // eslint-disable-next-line no-console
    console.log(e);
  }
};

module.exports = textListener;
