const Photo = require('../models/Photo');
const fs = require('fs');

exports.getAllPhotos = async (req, res) => {
  const photos = await Photo.find({}).sort('-dateCreated');
  res.render('index', { photos });
};

exports.getOnePhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render('photo', { photo });
};

exports.createPhoto = async (req, res) => {
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
  let uploadPath = __dirname + '/../public/uploads/' + uploadImage.name; // gonderecegim yol

  // gonderen fonksiyon
  uploadImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadImage.name,
    });
    res.redirect('/');
  });
};

exports.updatePhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  photo.title = req.body.title;
  photo.description = req.body.description;
  photo.save();
  res.redirect(`/photos/${photo._id}`);
};

exports.deletePhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  // dosyadan kaldir
  let deletedImagePath = __dirname + '/../public' + photo.image;
  fs.unlinkSync(deletedImagePath);
  await Photo.findByIdAndDelete(photo._id);
  res.redirect('/');
};
