const testStoreManager = require('../test-store-manager');
const commandManager = require('../command-manager');
const directiveManager = require('../directive-manager');
const testLocalManager = require('../test-local-manager');

const buttonListener = async (bot, chatId, data) => {
  try {
    const direction = directiveManager.getDirective(chatId);
    const resData = testLocalManager.getResponseData(chatId);
    const selectedTest = testLocalManager.getTest(chatId);
    let passIndex = testLocalManager.getIndex(chatId);

    if (direction === directiveManager.constants.STARTPASSTEST) {
      const test = await testStoreManager.findTest(chatId, data);
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
        passIndex += 1;
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
      testStoreManager.removeTest(chatId, data);
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
      testStoreManager.addQuestion(chatId, selectedTest, resData);
      directiveManager.resetDirective(chatId);
      testLocalManager.setTest(chatId, '');
      testLocalManager.setResponseData(chatId, '');
      commandManager.questionAdded(bot, chatId);
    }

    if (direction === directiveManager.constants.SHOWQUESTIONS) {
      const res = await testStoreManager.findTest(chatId, data);
      commandManager.showAllQuestions(bot, chatId, res);
      directiveManager.resetDirective(chatId);
    }

    if (direction === directiveManager.constants.REMOVEQUESTION) {
      commandManager.removeQuestion(bot, chatId);
      testLocalManager.setTest(chatId, data);
    }

    if (direction === directiveManager.constants.RESETQUESTIONS) {
      testStoreManager.resetQuestions(chatId, data);
      commandManager.resetQuestions(bot, chatId);
      directiveManager.resetDirective(chatId);
    }
  } catch (e) {
    directiveManager.resetDirective(chatId);
    bot.sendMessage(chatId, 'Упс, что-то пошло не так');
    testLocalManager.resetAll(chatId);
    // eslint-disable-next-line no-console
    console.log(e);
  }
};

module.exports = buttonListener;
