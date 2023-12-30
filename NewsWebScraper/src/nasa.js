const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeNasaNews() {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	try {
		// navigate to NASA News
		await page.goto('https://www.nasa.gov/news/all-news/');
		
		// find selector with title and url elements
		await page.waitForSelector('.hds-content-item');

		// extract data
		const articles = await page.$$eval('.hds-content-item', (elements) =>
	    	elements.map((element) => ({
	    		title: element.querySelector('.hds-content-item-inner a h3').textContent.trim(),
	    		url: element.querySelector('.hds-content-item-inner a').href
	    	}))
		);
	
		// JSON array --> CSV
	    const csvString = articles.map(article => `"${article.title.replace(/"/g, '""')}","${article.url}"`).join('\n');
		fs.writeFileSync('nasaScraped.csv', 'Title,URL\n' + csvString);
		console.log('CSV file created: nasaScraped.csv');
	
		return articles;
		
	} catch (error) {
	    console.error('Error during scraping:', error);
	    
	} finally {
		// close browser
		await browser.close();
		
	}
}

// run function and log result
scrapeNasaNews().then((result) => {
	console.log(JSON.stringify(result, null, 2));
});
