const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeBbcNews() {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	// navigate to BBC News
	await page.goto('https://www.bbc.com/');
	
	try {
		// find selector with title and url elements
		await page.waitForSelector('.sc-827276f7-1.bxwUsG');
	
		// extract data
		const articles = await page.$$eval('.sc-827276f7-1.bxwUsG', (elements) =>
	    	elements.map((element) => ({
	    		title: element.querySelector('a h2').textContent.trim(),
	    		url: element.querySelector('a').href
	    	}))
		);
	
		// JSON array --> CSV
	    const csvString = articles.map(article => `"${article.title.replace(/"/g, '""')}","${article.url}"`).join('\n');
		fs.writeFileSync('bbcScraped.csv', 'Title,URL\n' + csvString);
		console.log('CSV file created: bbcScraped.csv');
		
		return articles;
		
	} catch (error) {
	    console.error('Error during scraping:', error);
	    
	} finally {
		// close browser
		await browser.close();
		
	}
}

// run function and log result
scrapeBbcNews().then((result) => {
	console.log(JSON.stringify(result, null, 2));
});
