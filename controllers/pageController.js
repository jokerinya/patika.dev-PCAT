const Photo = require('../models/Photo');

exports.getAboutPage = (req, res) => {
  res.render('about');
};

exports.getAddPage = (req, res) => {
  res.render('add');
};

exports.getEditPage = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    res.render('edit', { photo });
  } catch (error) {
    console.log(error);
    res.render('error', {
      title: "Can't Find Photo",
      message: "Can't find your page, please check try again.",
    });
  }
};

exports.getErrorPage = async (req, res) => {
  res.render('error', {
    title: 'Page Not Found',
    message: 'Try to go back home page',
  });
};
