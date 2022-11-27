const pup = require("puppeteer");

const url = "https://www.mercadolivre.com.br/";
const search = "PS4";

let counter = 1;
const list = [];

// simple variables
const log = (text) => console.log(text);

(async ()  => {
  const browser = await pup.launch({ headless: false }); // Init browser
  const page = await browser.newPage(); // create new page

  log("Start new Browser");
  await page.goto(url); // Redirect to url

  log(`Research for ${search}`);
  await page.waitForSelector("#cb1-edit"); // await page is load
  await page.type("#cb1-edit", search); // SEARCH

  await Promise.all([
    page.waitForNavigation(),
    page.click(".nav-search-btn"), // Select btn research
  ]);

  const links = await page.$$eval(".ui-search-result__image > a", (el) =>
    el.map((link) => link.href)
  ); // execute a querySelectorAll

  for (const link of links) {
    if(counter === 10) continue;
    console.log("Page", counter);
    await page.goto(link);
    await page.waitForSelector(".ui-pdp-title"); //vai carregar somente os dados que queremos

    const title = await page.$eval(
      ".ui-pdp-title",
      (element) => element.innerText
    ); // querySelector
    const price = await page.$eval(
      ".andes-money-amount__fraction",
      (element) => element.innerText
    );
   
   const seller = await page.evaluate(() => {
    const el = document.querySelector('.ui-pdp-seller__link-trigger');
    if(!el) return null;
    return el.innerText;
   })


    const obj = {
      title: title,
      price: price,
      seller: seller ? seller : 'Nao informado',
      link: link,
    };
    counter++;
    list.push(obj);
  }

  console.log(list);

  setInterval(() => {
    // Await a time for close this page - 10s
    browser.close(); // Close browser
  }, 3000);

})();

