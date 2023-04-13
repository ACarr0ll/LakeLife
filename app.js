const apiBtn = document.getElementById('apiBtn');
const outputDiv = document.getElementById('output');

apiBtn.addEventListener('click', (req, res) => {
    const symbol = req.body.stock;
  
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
  
    axios.get(url)
      .then(response => {
        const data = response.data;
        const quote = data['Global Quote'];
        res.json(stockInfo);
      })
      .catch(error => {
        console.error(`Request failed with error ${error.response.status}: ${error.response.statusText}`);
        res.status(error.response.status).send(error.response.statusText);
      });
  });
