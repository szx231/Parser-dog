const fs = require('fs');
const { all } = require('async');
// nodejs modules
require('dotenv').config()
//Telegram bot
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, {polling: true});



//import modules(parser dosk file)
const doskaCatModule = require('./parserjs/doskaCat')
const irrCatModule = require('./parserjs/irrCat')
const kufarCatModule = require('./parserjs/kufarCat')
const onlinerCatModule = require('./parserjs/onlinerCat')
const zooCatModule = require('./parserjs/zooCat');
const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler');

const scheduler = new ToadScheduler()

const task = new Task('simple task', () => allFn())
const job = new SimpleIntervalJob({ seconds: 480, }, task)

scheduler.addSimpleIntervalJob(job)
console.log('15')
// launch functions
const allFn = async ()=>{
  try {
    await onlinerCatModule()
    console.log('Выполнилась 1-я ф-ция')
    await irrCatModule()
    console.log('Выполнилась 2-я ф-ция')
    await doskaCatModule()
    console.log('Выполнилась 3-я ф-ция')
    await zooCatModule()
    console.log('Выполнилась 4-я ф-ция')
    await kufarCatModule() 
    console.log('Выполнилась 5-я ф-ция')
  }catch (e) {
    console.error(e)
  }
}
allFn()

//function for filtering incoming data (source array)
function filterSourceData(data, dataintermediateResult, name, link, img, update, price, result, num) {
  try {
    console.log('work')
    for (let i = 0; i < data.length; i++) {
      if (data[i].name) {name.push(data[i])}
      if (data[i].link) {link.push(data[i])}
      if (data[i].img) {img.push(data[i])}
      if (data[i].update) {update.push(data[i])}
      if (data[i].price) {price.push(data[i])}
    }
    for (let i = 0; i < name.length; i++) {
      dataintermediateResult.push(name[i], link[i], img[i], update[i], price[i])
    }
    let obj;
    dataintermediateResult.forEach(e => {
      if (num++ === 0) result.push(obj = {});
      Object.assign(obj, e);
      if (num === 5) num = 0;
    });
  } catch (e) {
    console.error(e)
  }
}

//function for push messages to telegram(and message template)
function botMessagePush(fullData) {
  try {
    console.log('запуск пуша')
    let filteredData = fullData.filter((el) => {
      return el.oldItem === undefined;
    });
    console.log(filteredData.length, 'filterData')
    for (let i = 0; filteredData.length > i; i++) {
      setTimeout(() => {
        pushMessage(i)
      }, 6000 * i);
    }

    function pushMessage(i) {
      const html = `
<strong>${filteredData[i].name}</strong>
<strong>Цена</strong>: ${filteredData[i].price}❗
<strong>Изменено/добавлено</strong>: ${filteredData[i].update}
<a href ='${filteredData[i].img}'>Фото</a> 📷
<a href="${filteredData[i].link}">Ссылка</a>🙏🏻
`
      bot.sendMessage(-1001774067521, html, {
        parse_mode: 'HTML'
      })
    }
  } catch (e) {
    console.error(e)
  }
}

module.exports = {filterSourceData, botMessagePush}

