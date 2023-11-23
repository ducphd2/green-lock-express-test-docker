const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(express.json(), express.urlencoded({ extended: false }));

mongoose
  .connect('mongodb://mongodb:27017/test')
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

const Item = require('./models/Item');

app.get('/', (req, res) => {
  Item.find()
    .then((items) => res.render('index', { items }))
    .catch((err) => res.status(404).json({ msg: 'No items found' }));
});

app.post('/item/add', (req, res) => {
  const newItem = new Item({
    name: req.body.name,
  });

  newItem
    .save()
    .then((item) => {
      console.log(item);
      res.redirect('/');
    })
    .catch((err) => console.log(err));
});

app.use((error, req, res, next) => {
  console.error('Request error', error);
  res.status(500).json({ message: 'internal error' });
});

process.on('uncaughtException', (error) => {
  console.error('Unhandled error', error);
});

const port = 3000;
require('http')
  .createServer(app)
  .listen(port, function () {
    console.info('Listening for HTTP on 👉', this.address());
  });

module.exports = app;
