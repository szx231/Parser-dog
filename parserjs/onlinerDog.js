const {
JSDOM
} = require('jsdom');
const queue = require('async/queue');
const fs = require('fs/promises');
let data = [];
async function onlinerCat() {
async function parse(url, isDetailed) {
  try {
    const dom = await JSDOM.fromURL(url);
    const d = dom.window.document;
    if (!isDetailed) {
      d.querySelectorAll('tr').forEach((i) => {
        if(i !== null && i.querySelector('.lst')) {
          let update = i.querySelector('.ba-post-up')?.textContent;
          let link = i.querySelector('.wraptxt > a')?.href;
          let price = i.querySelector('.price-primary')?.textContent?.trim()
          if(i.querySelector('.cost .price-primary') == null ) {
            price = 'Не указано/ Бесплатно!';
          }
          data.push({update: update},{link: link}, {price: price});
        }
      });
      d.querySelectorAll('.img-va > a').forEach(i => {
        if (i) {q.push({url: i,isDetailed: true});}
      });
    } 
      let img;
      if(d.querySelector('.msgpost-img')) {
        img = d.querySelector('.msgpost-img')?.getAttribute('src');
      }
      const name = d.querySelector('.title')?.textContent;
      data.push({name: name}, {img: img,});
  } catch (e) {
    console.error(e);
  }
}
const q = queue(async(data, done) => {
  await parse(data.url, data.isDetailed);
  done();
});
q.push({
  url: 'https://baraholka.onliner.by/viewforum.php?f=608&cat=1',
  isDetailed: false
});
  await q.drain();
  if (data.length > 0) {
  СreatingValidDate();
  async function СreatingValidDate() {
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
      if (database.length) {
        let prevData = database;
        let prevDataEdited = prevData.map((el) => {
          const oldEl = el;
          oldEl.oldItem = true;
          return oldEl;
        });
        const {filterSourceData, botMessagePush} = require('../main')
        filterSourceData(data, dataintermediateResult, name, link, img, update, price, result, num)
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
        console.log(`Сохранено ${fullData.length} записей onliner`);
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
  // return new Promise(res=>setTimeout(()=>{res(2000)}, 1400))
}

module.exports = onlinerCat;