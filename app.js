// 3th party
const express = require('express');
const ejs = require('ejs');
const mangoose = require('mongoose');
const fileUpload = require('express-fileupload');
var methodOverride = require('method-override');
// Node Core

// Mine
const photoControllers = require('./controllers/photoControllers');
const pageController = require('./controllers/pageController');

require('dotenv').config();

// start app
const app = express();

// Connect to db
(async () => {
  try {
    // await mangoose.connect('mongodb://0.0.0.0:27017/pcat-test-db', {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   // useFindAndModify: false, // bu olmasada olur node 17
    // });
    await mangoose.connect(
      `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASSWORD}@${process.env.DB_CLUSTER_ADDRESS}/${process.env.DB_NAME}?retryWrites=true&w=majority`
    );
    console.log('Connected to db');
  } catch (error) {
    console.log(error);
  }
})();

// Template Engine
app.set('view engine', 'ejs');

// Milddlewares
app.use(express.static(__dirname + '/public')); // bu daha saglikli
// app.use(express.static('public'));
// Bu iki body parser islemi yapar ve request bodysini yazmaya yarar
app.use(express.urlencoded({ extended: true })); // urldeki datayi okumayi saglar
app.use(express.json()); // urldeki datayi json yapar
// image upload
app.use(fileUpload());
// Put delete method helper
app.use(
  methodOverride('_method', {
    methods: ['GET', 'POST'],
  })
);

// Routes
app.get('/', photoControllers.getAllPhotos);
app.get('/photos/:id', photoControllers.getOnePhoto);
app.post('/photos', photoControllers.createPhoto);
app.put('/photos/:id', photoControllers.updatePhoto);
app.delete('/photos/:id', photoControllers.deletePhoto);

app.get('/about', pageController.getAboutPage);
app.get('/add', pageController.getAddPage);
app.get('/photos/edit/:id', pageController.getEditPage);

app.all('*', pageController.getErrorPage);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
