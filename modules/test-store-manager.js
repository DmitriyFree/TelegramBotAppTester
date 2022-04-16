const { MongoClient } = require('mongodb');
const dot = require('dotenv');

dot.config();

const client = new MongoClient(process.env.MONGOURL);

// eslint-disable-next-line consistent-return
const innitCollection = async (collectionName) => {
  try {
    await client.connect();
    let res = await client.db().listCollections().toArray();
    res = res.filter((item) => item.name === collectionName);
    if (!res.length) await client.db().createCollection(collectionName);
    return await client.db().collection(collectionName);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('Error innit collection for database', e);
  }
};

const testStoreManager = {
  async addTest(collection, test) {
    const db = await innitCollection(`col${collection}`);
    await db.insertOne(test);
  },
  async getAlltests(collection) {
    const db = await innitCollection(`col${collection}`);
    const res = await db.find({}).toArray();
    return res;
  },
  async findTest(chatId, title) {
    const db = await innitCollection(`col${chatId}`);
    const result = await db.findOne({ title });
    return result;
  },
  findIndexTest(title) {
    return this.listTests.findIndex((item) => item.title === title);
  },
  async cahangeName(chatId, oldTitle, newTitle) {
    const db = await innitCollection(`col${chatId}`);
    const result = await this.findTest(chatId, oldTitle);
    result.title = newTitle;
    await db.replaceOne({ title: oldTitle }, result);
  },
  async removeTest(chatId, title) {
    const db = await innitCollection(`col${chatId}`);
    await db.deleteOne({ title });
  },
  async addQuestion(chatId, testName, question) {
    const db = await innitCollection(`col${chatId}`);
    const result = await this.findTest(chatId, testName);
    result.questions.push(question);
    await db.replaceOne({ title: testName }, result);
  },
  async removeQuestion(chatId, test, n) {
    const db = await innitCollection(`col${chatId}`);
    const result = await this.findTest(chatId, test);
    result.questions.splice(n - 1, 1);
    await db.replaceOne({ title: test }, result);
  },
  async resetQuestions(chatId, test) {
    const db = await innitCollection(`col${chatId}`);
    const result = await this.findTest(chatId, test);
    result.questions = [];
    await db.replaceOne({ title: test }, result);
  },
};

module.exports = testStoreManager;
