const testStoreManager = require('../test-store-manager');
const commandManager = require('../command-manager');
const directiveManager = require('../directive-manager');

const commandListener = async (bot, chatId, text) => {
  let result = false;

  try {
    if (text === '/help') {
      commandManager.help(bot, chatId);
      directiveManager.resetDirective(chatId);
      result = true;
    }
    if (text === '/newtest') {
      commandManager.newTest(bot, chatId);
      directiveManager.newTest(chatId);
      result = true;
    }
    if (text === '/passtest') {
      const testList = await testStoreManager.getAlltests(chatId);
      const res = commandManager.showTests(bot, chatId, testList);
      if (res) directiveManager.startPassTest(chatId);
      result = true;
    }
    if (text === '/settitle') {
      const testList = await testStoreManager.getAlltests(chatId);
      const res = commandManager.showTests(bot, chatId, testList);
      if (res) directiveManager.setTitle(chatId);
      result = true;
    }
    if (text === '/removetest') {
      const testList = await testStoreManager.getAlltests(chatId);
      const res = commandManager.showTests(bot, chatId, testList);
      if (res) directiveManager.deleteTest(chatId);
      result = true;
    }

    if (text === '/addquestion') {
      const testList = await testStoreManager.getAlltests(chatId);
      const res = commandManager.showTests(bot, chatId, testList);
      if (res) directiveManager.addQuestion(chatId);
      result = true;
    }

    if (text === '/showquestions') {
      const testList = await testStoreManager.getAlltests(chatId);
      const res = commandManager.showTests(bot, chatId, testList);
      if (res) directiveManager.showAllQuestions(chatId);
      result = true;
    }

    if (text === '/removequestion') {
      const testList = await testStoreManager.getAlltests(chatId);
      const res = commandManager.showTests(bot, chatId, testList);
      if (res) directiveManager.removeQuestion(chatId);
      result = true;
    }

    if (text === '/resetquestions') {
      const testList = await testStoreManager.getAlltests(chatId);
      const res = commandManager.showTests(bot, chatId, testList);
      if (res) directiveManager.resetQuestions(chatId);
      result = true;
    }
  } catch (e) {
    directiveManager.resetDirective(chatId);
    bot.sendMessage(chatId, 'Упс, что-то пошло не так');
    result = false;
    // eslint-disable-next-line no-console
    console.log(e);
  }

  return result;
};

module.exports = commandListener;
