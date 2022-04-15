const directiveManager = {
  store: {},
  constants: {
    NEWTEST: 'newtest',
    SETTITLE: 'settitle',
    DELETE: 'delete',
    ADDQUESTION: 'addquestion',
    SETTITLEQUESTION: 'settitlequestion',
    QUESTIONANSWERS: 'questionanswer',
    TRUEANSWER: 'trueanswer',
    SHOWQUESTIONS: 'showquestions',
    CHOOSECOMMAND: 'choose-command',
    REMOVEQUESTION: 'removequestion',
    RESETQUESTIONS: 'resetquestions',
    STARTPASSTEST: 'startpasstest',
    PASSTEST: 'passtest',
  },
  newTest(chatId) {
    this.store[chatId] = this.constants.NEWTEST;
  },
  startPassTest(chatId) {
    this.store[chatId] = this.constants.STARTPASSTEST;
  },
  passTest(chatId) {
    this.store[chatId] = this.constants.PASSTEST;
  },
  setTitle(chatId) {
    this.store[chatId] = this.constants.SETTITLE;
  },
  deleteTest(chatId) {
    this.store[chatId] = this.constants.DELETE;
  },
  addQuestion(chatId) {
    this.store[chatId] = this.constants.ADDQUESTION;
  },
  setTitleQuestion(chatId) {
    this.store[chatId] = this.constants.SETTITLEQUESTION;
  },
  setQuestionAnswers(chatId) {
    this.store[chatId] = this.constants.QUESTIONANSWERS;
  },
  trueAnswer(chatId) {
    this.store[chatId] = this.constants.TRUEANSWER;
  },
  showAllQuestions(chatId) {
    this.store[chatId] = this.constants.SHOWQUESTIONS;
  },
  removeQuestion(chatId) {
    this.store[chatId] = this.constants.REMOVEQUESTION;
  },
  resetQuestions(chatId) {
    this.store[chatId] = this.constants.RESETQUESTIONS;
  },
  chooseCommand(chatId) {
    this.store[chatId] = this.constants.CHOOSECOMMAND;
  },
  getDirective(chatId) {
    return this.store[chatId];
  },
  resetDirective(chatId) {
    this.store[chatId] = '';
  },
};

module.exports = directiveManager;
