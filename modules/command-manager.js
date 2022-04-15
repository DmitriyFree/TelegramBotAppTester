

const commandManager = {
  newTest(bot, chatId) {
    bot.sendMessage(chatId, 'Good. Please choose a title for your new test');
  },
  createdTest(bot, chatId, data) {
    bot.sendMessage(
      chatId,
      `Congratulete! You created new test with name ${data}
      \n/addquestion - add question
      \n/help - list all commands`
    );
  },
  chooseCommand(bot, chatId) {
    bot.sendMessage(chatId, 'Выбери действие', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Изменить название', callback_data: 'ddd' },
            { text: 'Добавить вопрос', callback_data: 'ddd' },
            { text: 'Удалить вопрос', callback_data: 'ddd' },
          ],
        ],
      },
    });
  },
  setNewTitle(bot, chatId) {
    bot.sendMessage(chatId, 'Выберете новое назвние для теста');
  },
  changedTitle(bot, chatId) {
    bot.sendMessage(chatId, 'Название теста было успешно изменино');
  },
  showTests(bot, chatId, testList) {

    if (testList.length === 0) {
      bot.sendMessage(chatId, `not any test\n/newtest - create new test`);
      return false;
    }
    const arr = [];
    let row = [];
    let count = 1;

    testList.forEach((item) => {
      const obj = {
        text: item.title,
        callback_data: item.title,
      };
      row.push(obj);
      if (count === 3) {
        arr.push(row);
        row = [];
        count = 1;
      }
    });
    arr.push(row);

    bot.sendMessage(chatId, 'Choose test', {
      reply_markup: {
        inline_keyboard: arr,
      },
    });
    return true;
  },

  deleteTest(bot, chatId, testList) {
    const arr = [];
    let row = [];
    let count = 1;

    testList.forEach((item) => {
      const obj = {
        text: item.title,
        callback_data: item.title,
      };
      row.push(obj);
      if (count === 3) {
        arr.push(row);
        row = [];
        count = 1;
      }
    });
    arr.push(row);

    bot.sendMessage(chatId, 'Choose test', {
      reply_markup: {
        inline_keyboard: arr,
      },
    });
  },
  askQuestion(bot, chatId, ask, answers) {
    const arr = [[]];
    answers.forEach((answer) => {
      const obj = {
        text: answer,
        callback_data: answer,
      };
      arr[0].push(obj);
    });
    bot.sendMessage(chatId, ask, {
      reply_markup: {
        inline_keyboard: arr,
      },
    });
  },
  passEnd(bot, chatId, stats) {
    bot.sendMessage(
      chatId,
      `Тест закончен\n  Всего вопросов: ${stats.count}\n  Правильных: ${stats.qtrue}\n  Неправильных: ${stats.qfalse}`
    );
  },
  help(bot, chatId) {
    bot.sendMessage(
      chatId,
      `
     Вы можете созавать и проходить тесты
     \nСписок команд:
     \n /newtest - создать новый тест\n /passtest - пройти тест\n /settitle - изменить название теста\n /removetest - удалить тест
     \n /addquestion - добавить вопрос\n /showquestions - показать вопросы детально\n /removequestion - показать вопросы детально \n /resetquestions - очистить все вопросы`
    );
  },
  titleQuestions(bot, chatId) {
    bot.sendMessage(chatId, `Введите название вопроса`);
  },
  questionAnswers(bot, chatId) {
    bot.sendMessage(chatId, `Введите доступные ответы через знак ','`);
  },
  trueAnswer(bot, chatId, answers) {
    if (answers.length === 0) {
      bot.sendMessage(chatId, `not any test\n/newtest - create new test`);
      return false;
    }
    const arr = [];
    let row = [];
    let count = 1;

    answers.forEach((item) => {
      const obj = {
        text: item,
        callback_data: item,
      };
      row.push(obj);
      if (count === 3) {
        arr.push(row);
        row = [];
        count = 1;
      }
    });
    arr.push(row);

    bot.sendMessage(chatId, 'Choose true answer', {
      reply_markup: {
        inline_keyboard: arr,
      },
    });
    return true;
  },
  questionAdded(bot, chatId) {
    bot.sendMessage(
      chatId,
      `Вопрос добавлен
      \n /addquestion - add new question\n /help - enother commands`
    );
  },
  showAllQuestions(bot, chatId, test) {
    const { questions } = test;
    if (questions.length === 0) {
      bot.sendMessage(
        chatId,
        'Здесь не вопросов\n /addquestion - добавинь вопрос\n /help - другие комманды'
      );
    } else {
      let str = `${test.title}\n\n`;
      questions.forEach((item, index) => {
        str += `#${index + 1} ${item.title}\n`;
        const { answers } = item;
        answers.forEach((answer) => {
          str += `  ${answer}\n`;
        });
        str += `\n`;
      });
      bot.sendMessage(chatId, str);
    }
  },
  removeQuestion(bot, chatId) {
    bot.sendMessage(chatId, `Введите номер вопроса для удаления`);
  },
  removedQuestion(bot, chatId) {
    bot.sendMessage(chatId, `Вопрос успешно удален`);
  },
  resetQuestions(bot, chatId) {
    bot.sendMessage(chatId, `Все вопросы были очишчены`);
  },
  default(bot, chatId) {
    bot.sendMessage(chatId, `I don't understand you\n/help - for see list of commands`);
  },
};

module.exports = commandManager;
