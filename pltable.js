const https = require('https');
const cheerio = require('cheerio');
const fs = require('fs');

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    let html = '';

    https.get(url, (res) => {
      res.on('data', chunk => html += chunk);
      res.on('end', () => resolve(html));
    }).on('error', (err) => reject(err));
  });
}

async function scrapeLastTenYears() {
  try {
    const html = await fetchHTML('https://footballrates.com/lasttenyears.html');
    const $ = cheerio.load(html);

    const table = $('table');

    if (table.length === 0) {
      throw new Error('Tableau non trouvé sur la page');
    }

    const headers = [];
    table.find('thead tr th').each((i, el) => {
      headers.push($(el).text().trim());
    });

    const rows = table.find('tbody tr');
    console.log(`${rows.length} lignes trouvées dans le tableau.`);

    const dataRows = [];

    rows.slice(0, 10).each((i, row) => {
      const rowData = {};
      $(row).find('td').each((j, cell) => {
        rowData[headers[j]] = $(cell).text().trim();
      });
      dataRows.push(rowData);
    });

    console.log(dataRows);

    // Optional: Save to file
    // fs.writeFileSync('lastTenYearsData.json', JSON.stringify(dataRows, null, 2));

  } catch (error) {
    console.error('Erreur lors du scraping :', error.message);
  }
}

scrapeLastTenYears();
