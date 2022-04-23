const fs = require('fs/promises');
let data = [];
const puppeteer = require('puppeteer');

async function kufarCat() {
try {
const browser = await puppeteer.launch({
  'args' : [
    '--no-sandbox',
    '--disable-setuid-sandbox'
  ]
});
const page = await browser.newPage()
await page.goto('https://www.kufar.by/l/sobaki', {timeout: 0})
const update = await page.evaluate(() => {
return [...document.querySelectorAll('section > a > div > div > div > span')].map(i => ({
update: i.innerText}))
})
const img = await page.evaluate(() => {
return [...document.querySelectorAll('section > a')].filter((value, index) => index > 2).map(i => {
const el = i.querySelector('div > div > div > img:nth-child(2)');
if (el) return {
img: el.getAttribute('data-src')}
if(!el) return {
img: 'Картинки нет'
}})
})
const link = await page.evaluate(() => {
return [...document.querySelectorAll('section > a')].filter((value, index) => index > 2).map(i => ({
link: i.getAttribute('href')}))
})
const name = await page.evaluate(() => {
return [...document.querySelectorAll('section > a > div > div > div > h3')].filter((value, index) => index > 2).map(i => ({
name: i.textContent.trim()}))
})
const price = await page.evaluate(() => {
return [...document.querySelectorAll('section > a > div > div > div > p > span:nth-child(1)')].filter((value, index) => index > 2).map(i => ({
price: i.textContent.trim()}))
})
data.push(...update, ...img, ...link, ...name, ...price);
browser.close();
 if (data.length > 0) {
  СreatingValidDate();
  function СreatingValidDate() {
    const fs = require('fs')
    let database = []
    let dataintermediateResult = []
    let name = []
    let link = []
    let img = []
    let update = []
    let price = []
    let result = [];
    let num = 0;
    fs.readFile('./data.txt', 'utf8', 
    async (error, dataRes) => {
      if (error) throw error;
      database = await JSON.parse(('[' + dataRes + ']').replace(/\]\[/g, '],['));
      database = await database.flat(Infinity)
      if(database.length > 1200) {
        console.log('обрезаем лишнее', database.length)
        const length  = database.length - 1200
        database.splice(0, length)
      }
      if (database.length) {
        let prevData = database;
        let prevDataEdited = prevData.map((el) => {
          const oldEl = el;
          oldEl.oldItem = true;
          return oldEl;
        });
        const {filterSourceData, botMessagePush} = require('../main')
        filterSourceData(data, dataintermediateResult, name, link, img, update, price, result, num)
        console.log(update.length)
console.log(link.length, 'link')
        let newDataIndexes = [];
        for (let i = 0; i < prevDataEdited.length; i++) {
          let existedItemIndex = result.findIndex((el) => {
            return el.link === prevDataEdited[i].link;
          });
          if (existedItemIndex !== -1) {newDataIndexes.push(existedItemIndex)}
        }
        let newData = result;
        newData = newData.filter((el, i) => {
        return !newDataIndexes.includes(i);
        });
        let fullData = [...prevDataEdited, ... newData];
        botMessagePush(fullData)
        fs.writeFileSync('./data.txt', JSON.stringify(fullData));
        console.log(`Сохранено ${fullData.length} записей kufar`);
        prevData = []
        prevDataEdited = []
        newDataIndexes = []
        database = []
        dataintermediateResult = []
        name = []
        link = []
        img = []
        update = []
        price = []
        result = [];
        num = 0;
        data = []
      }
    })
  }}
} catch(error) {
  console.log(error)
}
// return new Promise(res=>setTimeout(()=>{res(2000)}, 1600))
}
module.exports = kufarCat;

