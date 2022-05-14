const Photo = require('../models/Photo');
const fs = require('fs');

exports.getAllPhotos = async (req, res) => {
  const page = req.query.page || 1; // gelen requestte sayfa numarasi varsa o yoksa 1
  const photosPerPage = 2; // bunu biz belirledik
  const totalPhotos = await Photo.find().countDocuments(); // photo sayilari
  // skip methodu kullanacagiz
  const photos = await Photo.find({})
    .sort('-dateCreated')
    .skip((page - 1) * photosPerPage)
    .limit(photosPerPage);

  // console.log(totalPhotos);

  // console.log(req.query);
  res.render('index', {
    photos: photos,
    current: page,
    pages: Math.ceil(totalPhotos / photosPerPage),
  });
};

exports.getOnePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    res.render('photo', { photo });
  } catch (error) {
    console.log(error);
    res.render('error', {
      title: "Can't Find Photo",
      message: "Can't find your page, please check your link and try again.",
    });
  }
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

  // check how many photos are in uploaddir
  const length = fs.readdirSync(uploadDir).length;
  const maxPhotoNum = 5;
  if (length >= maxPhotoNum) {
    res.render('error', {
      title: `Max image number is ${maxPhotoNum}!`,
      message: 'Delete at least one photo to upload your photo',
    });
  } else {
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
  }
};

exports.updatePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    photo.title = req.body.title;
    photo.description = req.body.description;
    photo.save();
    res.redirect(`/photos/${photo._id}`);
  } catch (error) {
    console.log(error);
    res.render('error', {
      title: "Can't Find Photo",
      message: "Can't find your page, please check your link and try again.",
    });
  }
};

exports.deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    // dosyadan kaldir
    let deletedImagePath = __dirname + '/../public' + photo.image;
    fs.unlinkSync(deletedImagePath);
    await Photo.findByIdAndDelete(photo._id);
    res.redirect('/');
  } catch (error) {
    console.log(error);
    if (error.code == 'ENOENT') {
      // this is required for heroku ephemeral file system
      await Photo.findByIdAndDelete(req.params.id);
    }
    res.render('error', {
      title: "Can't Find Photo",
      message:
        "Can't find your photo, that is why description has been also deleted.",
    });
  }
};
