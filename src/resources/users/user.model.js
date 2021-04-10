const { Schema, model } = require('mongoose');

const User = new Schema(
  {
    name: { type: String, Default: 'Unregistered raccoon' },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    avatarURL: {
      type: String,
      default:
        'http://res.cloudinary.com/nazdac/image/upload/v1616652013/travelAppFolder/dmlfcuvyr79gpkbgg639.jpg'
    }
  },
  { collection: 'users' }
);

module.exports = model('Users', User);
