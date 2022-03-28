// 3th party
const express = require('express');
const ejs = require('ejs');
const mangoose = require('mongoose');
const fileUpload = require('express-fileupload');
var methodOverride = require('method-override');
// Node Core
const path = require('path');
const fs = require('fs');
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
      // useFindAndModify: false, // bu olmasada olur node 17
    });
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
app.get('/', async (req, res) => {
  const photos = await Photo.find({}).sort('-dateCreated');
  res.render('index', { photos });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/photos', async (req, res) => {
  // console.log(req.files.image);
  // await Photo.create(req.body);
  // res.redirect('/');

  // kaydedilecek dosya ismi
  const uploadDir = 'public/uploads';
  // dosya yoksa olustur
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadImage = req.files.image; // resmim
  let uploadPath = __dirname + '/public/uploads/' + uploadImage.name; // gonderecegim yol

  // gonderen fonksiyon
  uploadImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadImage.name,
    });
    res.redirect('/');
  });
});

app.get('/photos/edit/:id', async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render('edit', { photo });
});

app.get('/photos/:id', async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render('photo', { photo });
});

app.put('/photos/:id', async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  photo.title = req.body.title;
  photo.description = req.body.description;
  photo.save();
  res.redirect(`/photos/${photo._id}`);
});

app.delete('/photos/:id', async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  // dosyadan kaldir
  let deletedImagePath = __dirname + '/public' + photo.image;
  fs.unlinkSync(deletedImagePath);
  await Photo.findByIdAndDelete(photo._id);
  res.redirect('/');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
