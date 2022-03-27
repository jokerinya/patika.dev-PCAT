// 3th party
const express = require('express');
const ejs = require('ejs');
const mangoose = require('mongoose');
// Node
const path = require('path');
// Mine
const Photo = require('./models/Photo');

// start app
const app = express();

// Connect to db
(async () => {
  try {
    await mangoose.connect('mongodb://0.0.0.0:27017/pcat-test-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to db');
  } catch (error) {
    console.log(error);
  }
})();

// Template Engine
app.set('view engine', 'ejs');

// Milddlewares
app.use(express.static('public'));
// Bu iki body parser islemi yapar ve request bodysini yazmaya yarar
app.use(express.urlencoded({ extended: true })); // urldeki datayi okumayi saglar
app.use(express.json()); // urldeki datayi json yapar

// Routes
app.get('/', async (req, res) => {
  const photos = await Photo.find();
  res.render('index', { photos });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/photos', async (req, res) => {
  await Photo.create(req.body);
  res.redirect('/');
});

app.get('/de', (req, res) => {
  res.render('video-page');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
