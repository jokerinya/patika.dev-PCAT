const express = require('express');
const ejs = require('ejs');
const path = require('path');

const app = express();

// Template Engine
app.set('view engine', 'ejs');

// Milddlewares
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/add', (req, res) => {
  res.render('add');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
