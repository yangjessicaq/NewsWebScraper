const PORT = 8000

// require the packages to use them
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const fs = require('fs')

const app = express()

const newsUrl = 'https://www.theguardian.com'

// parses through url via axios and retrieves data
axios.get(newsUrl)
	.then(response => {
		const html = response.data
		// parses through html and saves it to $
		const $ = cheerio.load(html)
		const articles = []
	
		// find title and url and add to array
		$('.dcr-omk9hw', html).each(function() {
			const title = "\"" + $(this).text() + "\""
			const url = "https://www.theguardian.com" + $(this).find('a').attr('href')
			if (url != undefined) {
				articles.push({
					title,
					url
				})
			}
		})
			
		// print JSON array to csv
	    const csvString = articles.map(article => `${article.title},${article.url}`).join('\n');
	    fs.writeFileSync('guardianAxiosScraped.csv', 'Title,URL\n' + csvString);
	    console.log('CSV file created: guardianScrapedAxios.csv');
	        	        	       	        
	}).catch(err => console.log(err))

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
