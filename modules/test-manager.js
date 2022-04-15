const {MongoClient} = require("mongodb");
const dot = require('dotenv');

dot.config();

const client = new MongoClient(process.env.MONGOURL);


const innitCollection = async (collectionName) => {
  try {
    await client.connect();
    let res = await client.db().listCollections().toArray();
    res = res.filter(item => {return item.name == collectionName});
    if (!res.length) await client.db().createCollection(collectionName);
    return await client.db().collection(collectionName);

  } catch (e) {
    console.log('Error check', e);
  }
};

const testManager = {

  async addTest(collection, test) {
    const db = await innitCollection('col'+collection);
    await db.insertOne(test);
  },
  async getAlltests(collection) {
    const db = await innitCollection('col'+collection);
    return await db.find({}).toArray();
  },
  async findTest(chatId, title) {
    const db = await innitCollection('col'+chatId);
    const result = await db.findOne({title: title});
    return result;
  },
  findIndexTest(title) {
    return this.listTests.findIndex((item) => item.title === title);
  },
  async cahangeName(chatId, oldTitle, newTitle) {
    const db = await innitCollection('col'+chatId);
    const result = await this.findTest(chatId, oldTitle);
    result.title = newTitle;
    await db.replaceOne({title: oldTitle}, result);
  },
  async removeTest(chatId, title) {
    const db = await innitCollection('col'+ chatId);
    await db.deleteOne({title: title});
  },
  async addQuestion(chatId, testName, question) {
    const db = await innitCollection('col'+ chatId);
    const result = await this.findTest(chatId, testName);
    result.questions.push(question);
    await db.replaceOne({title: testName}, result);
  },
  async removeQuestion(chatId, test, n) {
    const db = await innitCollection('col'+ chatId);
    const result = await this.findTest(chatId, test);
    result.questions.splice(n - 1, 1);
    await db.replaceOne({title: test}, result);
  },
  async resetQuestions(chatId, test) {
    const db = await innitCollection('col'+ chatId);
    const result = await this.findTest(chatId, test);
    result.questions = [];
    await db.replaceOne({title: test}, result);
  },
};

module.exports = testManager;
