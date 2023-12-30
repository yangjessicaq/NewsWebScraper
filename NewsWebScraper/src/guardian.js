const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeTheGuardian() {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	try {
		// navigate to The Guardian
		await page.goto('https://www.theguardian.com');
	
		// find selector with title and url elements
		await page.waitForSelector('.dcr-lv2v9o');
	
		// extract data
		const articles = await page.$$eval('.dcr-lv2v9o', (elements) =>
	    	elements.map((element) => {
	    		const title = element.getAttribute('aria-label');
	    		const url = 'https://www.theguardian.com' + element.getAttribute('href');
	    		return { title, url };
	    	})
		);
	
		// JSON array --> CSV
	    const csvString = articles.map(article => `"${article.title.replace(/"/g, '""')}","${article.url}"`).join('\n');
		fs.writeFileSync('guardianScraped.csv', 'Title,URL\n' + csvString);
		console.log('CSV file created: guardianScraped.csv');
	
		return articles;
		
	} catch (error) {
		  console.error('Error during scraping:', error);
		  
	} finally {
		  // close browser
		  await browser.close();
		    
	}
}

// run function and log result
scrapeTheGuardian().then((result) => {
	console.log(JSON.stringify(result, null, 2));
});
