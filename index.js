const pup = require('puppeteer');

const url = "https://www.mercadolivre.com.br/";
const search = "macbook";

let counter = 1;

// simple variables
const log = (text) => console.log(text);

async function getData() {
  const browser = await pup.launch({ headless: false }); // Init browser
  const page = await browser.newPage(); // create new page 

  log('Start new Browser');
  await page.goto(url); // Redirect to url  

  log(`Research for ${search}`);
  await page.waitForSelector('#cb1-edit'); // await page is load
  await page.type('#cb1-edit', search); // SEARCH

  await Promise.all([
    page.waitForNavigation(),
    page.click('.nav-search-btn') // Select btn research
  ]);

  const links = await page.$$eval('.ui-search-result__image > a', el => el.map(link => link.href)) // execute a querySelectorAll
  
  for(const link of links) {
    console.log('Page', counter)
    await page.goto(link);
    await page.waitForSelector('.ui-pdp-title'); //vai carregar somente os dados que queremos

    const title = await page.$eval('.ui-pdp-title', element => element.innerText) // querySelector
    const price = await page.$eval('.andes-money-amount__fraction', element => element.innerText)

    const product = {
      title, 
      price
    }

    console.log(product)

    counter++;
  }


  setInterval(() => { // Await a time for close this page - 10s
    browser.close(); // Close browser
  }, 8000);
}

getData();