const {
  JSDOM
} = require('jsdom');
const queue = require('async/queue');
const fs = require('fs/promises');

let data = [];
async function doskaCat() {
  async function parse(url, isDetailed) {
  try {
    const dom = await JSDOM.fromURL(url);
    const d = dom.window.document;
    if (!isDetailed) {
      d.querySelectorAll('form>:nth-child(3)>tbody>tr').forEach(i => {
        const url = i.querySelector('.msga2 > a')?.getAttribute('href');
        const link = url ? `https://www.doska.by/${url}` : undefined;
        const name = i.querySelector('.d1> a')?.textContent;
        let price = i.querySelector('td:nth-child(6)')?.textContent?.replace(/\s+/g, ' ')?.trim()
        if(price == '-' || undefined || null)
        {price = 'Не указано/ Бесплатно!'}
        data.push({link: link},{name: name},{price: price});
      })
      d.querySelectorAll('.msga2>a').forEach(i => {
        if (i) {q.push({url: i,isDetailed: true})}
      });
      const next = d.querySelector('msga2 > a');
      if (next) {
        const nextUrl ='https://www.doska.by/'+next.getAttribute('href');
        q.push({url: nextUrl,isDetailed: false});
      }
    } else {
      const imgCat = d.querySelector('.ads_photo_label > div > div > a').getAttribute('href');
      data.push({img: imgCat});
      const updateCat = d.querySelector("td > table > tbody > tr:nth-child(2) > td:nth-child(3)").textContent.substr(17, 5);
      data.push({update: updateCat});
    }
  } catch (e) {
    console.error(e);
  }
}
const q = queue(async(data, done) => {
  await parse(data.url, data.isDetailed);
  done();
});
q.push({
  url: 'https://www.doska.by/animals/dogs/',
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
        let prevDataEdited = await prevData.map((el) => {
          const oldEl = el;
          oldEl.oldItem = true;
          return oldEl;
        });
        const {filterSourceData, botMessagePush} = require('../main')
        filterSourceData(data, dataintermediateResult, name, link, img, update, price, result, num)
        let newDataIndexes = [];
        for (let i = 0; i < prevDataEdited.length; i++) {
          const existedItemIndex = result.findIndex((el) => {
            return el.link === prevDataEdited[i].link;
          });
          if (existedItemIndex !== -1) {newDataIndexes.push(existedItemIndex)}
        }
        let newData = result;
        newData = newData.filter((el, i) => {
        return !newDataIndexes.includes(i);
        });
        const fullData = [...prevDataEdited, ... newData];
        botMessagePush(fullData)
        fs.writeFileSync('./data.txt', JSON.stringify(fullData));
        console.log(`Сохранено ${fullData.length} записей doska`);
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
  }
}
// return new Promise(res=>setTimeout(()=>{res(2000)}, 1800))
}


module.exports = doskaCat;
