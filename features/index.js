const express = require('express');
const bodyParser = require('body-parser');
const upload = require('multer')({ dest: 'uploads/' })
const path = require('path');
const gm = require('gm').subClass({imageMagick: true});

const app = express();
const port = 8001;

app.use(express.static('uploads'));

// handle application/json
app.use(bodyParser.json({extended: true}));
// handle application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

app.get('/html2pdf', (req, res) => {
  console.log('GET html2pdf action');
  res.sendFile('identify.html', {
    root: path.join(__dirname, './views')
  })
});

app.get('/identify', (req, res) => {
  console.log('GET html2pdf action');
  res.sendFile('identify.html', {
    root: path.join(__dirname, './views')
  })
});

app.post('/identify', upload.single('file'), (req, res) => {
  console.log('POST identify');
  const file = req.file;
  gm(file.path)
  .identify(function (err, data) {
    if (!err) {
      res.set('Content-Type', 'text/html');
      res.write(`<h1>${file.originalname}</h1>`);
      res.write(`<img alt="preview" width="50%" height="auto" src="${file.filename}">`);
      res.write(`<pre>${JSON.stringify(data, null, 2)}</pre>`);
      res.end();
    } else {
      res.send(err)
    }
  });
});

// handle multipart/form-data
app.post('/html2pdf', upload.single('file'), (req, res) => {
  console.log('POST html2pdf action');
  const headers = req.headers;
  console.log(headers);
  const body = req.body;
  const file = req.file;
  console.log(req.file);
  res.send(JSON.stringify(file));
});

app.listen(port, () => console.log(`App listening on port ${port}!`))
