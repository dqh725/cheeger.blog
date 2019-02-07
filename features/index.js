const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const upload = require('multer')({ dest: 'uploads/' })
const port = 8000;

// handle application/json
app.use(bodyParser.json({extended: true}));
// handle application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

app.get('/html2pdf', (req, res) => {
  console.log('GET html2pdf action');
  const query = req.query;
  const headers = req.headers;
  console.log(JSON.stringify(query) + JSON.stringify(headers));
  res.send(JSON.stringify(headers));
});

// handle multipart/form-data
app.post('/html2pdf', upload.single('file'), (req, res) => {
  console.log('POST html2pdf action');
  const body = req.body;
  console.log(body);
  console.log(req.file);
  res.send(JSON.stringify(body));
});

app.listen(port, () => console.log(`App listening on port ${port}!`))
