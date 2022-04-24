const {
  JSDOM
} = require('jsdom');
const queue = require('async/queue');
const fs = require('fs/promises');
let data = [];
async function irrDog() {
async function parse(url, isDetailed) {
  try {
    const dom = await JSDOM.fromURL(url);
    const d = dom.window.document;
    if (!isDetailed) {
      let linkAll = d.querySelectorAll('.listingItem');
      linkAll.forEach((i) => {
        data.push({link: i.getAttribute('href')});
      });
      let priceAll = d.querySelectorAll('div.listingItem__info > span');
      priceAll.forEach((i) => {
        let priceText = i.textContent.trim();
        if(priceText == '') 
        {priceText = 'Не указана/ Бесплатно!'}
        data.push({price: priceText});
      });
      let updateAll = d.querySelectorAll('div.listingItem__info > p:nth-child(5)');
      updateAll.forEach((i) => {
        let updateText = i.textContent.replace(/\s+/g, ' ').trim();
        data.push({update: updateText});
      });
      let nameAll = d.querySelectorAll('.js-listingItemTitle');
      nameAll.forEach((i) => {
        data.push({name: i.textContent});
      });
      const DogsCard = d.querySelectorAll('.listingItem');
      DogsCard.forEach(DogsCard => {
        const linkDog = DogsCard;
        if (linkDog) {
          const detailedUrl = linkDog.href;
          q.push({url: detailedUrl,isDetailed: true});
        }
      });
      const next = d.querySelector('.listingItem');
      if (next) {
        const nextUrl = next;
        q.push({url: nextUrl,isDetailed: false});
      }
    } else {
      let imgDog;
      if(d.querySelector('.carousel__image')) {
        imgDog = d.querySelector('.carousel__image').getAttribute('data-src');
      } else {imgDog = 'Картинки нет'}
      data.push({img: imgDog});
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
  url: 'http://minsk.m.irr.by/animalsandplants/animals/dogs/',
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
        console.log(`Сохранено ${fullData.length} записей irr`);
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
  // return new Promise(res=>setTimeout(()=>{res(2000)}, 1600))
}

module.exports = irrDog;