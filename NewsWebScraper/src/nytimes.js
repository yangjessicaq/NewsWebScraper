const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeNYTimes() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
	  // navigate to The New York Times
	  await page.goto('https://www.nytimes.com/');

	  // find selector with title and url elements
	  await page.waitForSelector('a.css-9mylee');

	  // extract data
	  const articles = await page.$$eval('a.css-9mylee', (elements) =>
      	elements.map((element) => ({
      		title: element.textContent.trim(),
      		url: element.getAttribute('href') || '',
      	}))
	  );

	  // JSON array --> CSV
	  const csvString = articles.map(article => `"${article.title.replace(/"/g, '""')}","${article.url}"`).join('\n');
	  fs.writeFileSync('nytimesScraped.csv', 'Title,URL\n' + csvString);
	  console.log('CSV file created: nytimesScraped.csv');

	  return articles;
  } catch (error) {
	  console.error('Error during scraping:', error);
	  
  } finally {
	  // Close the browser
	  await browser.close();
   
  }
}

//run function and log result
scrapeNYTimes().then((result) => {
	console.log(JSON.stringify(result, null, 2));
});
