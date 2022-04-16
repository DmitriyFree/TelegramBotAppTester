const commandManager = {
  newTest(bot, chatId) {
    bot.sendMessage(chatId, 'Хорошо, введите название вашего теста');
  },
  createdTest(bot, chatId, data) {
    bot.sendMessage(
      chatId,
      `Поздравляем, вы созали новый тест с названием ${data}
      \n/addquestion - добавить вопросы
      \n/help - список всех комманд`
    );
  },
  setNewTitle(bot, chatId) {
    bot.sendMessage(chatId, 'Выберете новое назвние для теста');
  },
  changedTitle(bot, chatId) {
    bot.sendMessage(chatId, 'Название теста было успешно изменино');
  },
  showTests(bot, chatId, testList) {
    if (testList.length === 0) {
      bot.sendMessage(chatId, `У вас нет тестов\n/newtest - создать новый`);
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

    bot.sendMessage(chatId, 'Выберете тест', {
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

    bot.sendMessage(chatId, 'Выберете тест', {
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
      bot.sendMessage(chatId, `У вас нет тестов\n/newtest - создать новый`);
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

    bot.sendMessage(chatId, 'Выберете правильный ответ', {
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
      \n /addquestion - добавить новый вопрос\n /help - список всех команд`
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
        str += `#${index + 1} ${item.title}\n  Ответы:`;
        const { answers, trueanswer } = item;
        answers.forEach((answer) => {
          str += ` ${answer},`;
        });
        str += `\n  Истина: ${trueanswer} \n\n`;
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
    bot.sendMessage(chatId, `Я не понимаю тебя\n/help - список доступный комманд`);
  },
};

module.exports = commandManager;
