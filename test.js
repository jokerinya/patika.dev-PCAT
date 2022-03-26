const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Connect DB
mongoose
  .connect('mongodb://0.0.0.0:27017/pcat-test-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to DB'));

// Create Schema
const PhotoSchema = new Schema({
  title: String,
  description: String,
});

// Db model
const Photo = mongoose.model('Photo', PhotoSchema);

// Create a Photo
// Photo.create({
//   title: 'Photo Title 1',
//   description:
//     'Fugit dolorem quibusdam sed ipsa! Quis repudiandae exercitationem reiciendis atque nihil eveniet molestiae',
// });

// Read a Photo
// Photo.find({}, (err, data) => {
//   console.log(data);
// });

// Update Photo
// const id = '623f7cd5eb4255088d91d268';

// Photo.findByIdAndUpdate(
//   id,
//   { title: 'Photo title updated second time' },
//   { new: true }, // add for returning updated version
//   (err, data) => {
//     console.log(data);
//   }
// );

// Delete a photo
const id = '623f7cd5eb4255088d91d268';
Photo.findByIdAndDelete(id, (err) => {
  console.log(err);
  if (!err) {
    console.log('Photo Deleted');
  }
});
