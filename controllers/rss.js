const asyncWrapper = require('../middleware/async')

const getRSS = asyncWrapper( async (req, res) => {
    try {
        const response = await fetch('https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml');
        const data = await response.text();
        res.set('Content-Type', 'application/xml');
        res.send(data);
      } catch (error) {
        console.error('Error fetching RSS feed:', error);
        res.status(500).send('Error fetching RSS feed');
      }
})

module.exports = getRSS;