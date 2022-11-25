const pup = require('puppeteer');

const url = "https://www.mercadolivre.com.br/";
const search = "macbook";

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

  setInterval(() => { // Await a time for close this page - 10s
    browser.close(); // Close browser
  }, 8000);
}

getData();