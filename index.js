const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));

// Connect to MongoDB
mongoose
  .connect('mongodb://mongodb:27017/docker-node-mongo')
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

module.exports = app;
