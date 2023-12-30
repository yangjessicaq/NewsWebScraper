const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeCnnNews() {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	try {
	    // navigate to CNN
	    await page.goto('https://www.cnn.com');
	
	    // find selector with title and url elements
	    await page.waitForSelector('a.container__link');
	
	    // extract data
	    const articles = await page.$$eval('a.container__link', (elements) => {
	    	// reverse html due to duplicate elements (the duplicate contains the appropriate title)
	    	const reversedElements = elements.slice().reverse();
	    	const uniqueArticles = new Map(); 

	    	return reversedElements.reduce((acc, element) => {
	    		const title = element.getAttribute('data-zjs-card_name');
	    		let url = element.getAttribute('href');

	    		if (title != undefined) {
	    			// check if url has http portion; add if it doesn't
	    			if (!uniqueArticles.has(url)) {
	    				uniqueArticles.set(url, true);
	    				if (!url.startsWith("h")) {
	    					url = "https://www.cnn.com" + url;
	    				}
	    				acc.push({ title, url });
	    			}
	    		}
	    		return acc;
	    	}, []);
	    });

		// JSON array --> CSV
	    const csvString = articles.map(article => `"${article.title.replace(/"/g, '""')}","${article.url}"`).join('\n');
		fs.writeFileSync('cnnScraped.csv', 'Title,URL\n' + csvString);
		console.log('CSV file created: cnnScraped.csv');
	
	    return articles;
	    
  	} catch (error) {
	  console.error('Error during scraping:', error);
	  
  	} finally {
	    // close browser
	    await browser.close();
	    
  	}
}

// run function and log result
scrapeCnnNews().then((result) => {
	console.log(JSON.stringify(result, null, 2));
});