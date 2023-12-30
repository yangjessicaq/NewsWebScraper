const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeYahooNews() {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	try {
		// navigate to Yahoo News
		await page.goto('https://news.yahoo.com/');
	
		// find selector with title and url elements
		await page.waitForSelector('li.js-stream-content');

		// extract data
		const articles = await page.$$eval('li.js-stream-content div.Pos\\(r\\) div.D\\(f\\) h3 a', (elements) =>
    		elements.map((element) => ({
    			title: element.textContent.trim(),
    			url: element.href,
    		}))
		);

		// JSON array --> CSV
	    const csvString = articles.map(article => `"${article.title.replace(/"/g, '""')}","${article.url}"`).join('\n');
		fs.writeFileSync('yahooScraped.csv', 'Title,URL\n' + csvString);
		console.log('CSV file created: yahooScraped.csv');
	
		return articles;
	} catch (error) {
		console.error('Error during scraping:', error);
   
	} finally {
		// close browser
		await browser.close();

	}
}

// Run function and log result
scrapeYahooNews().then((result) => {
	console.log(JSON.stringify(result, null, 2));
});
