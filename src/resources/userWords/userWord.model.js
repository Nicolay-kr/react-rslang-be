const { Schema, model, Types } = require('mongoose');

const UserWord = new Schema(
  {
    wordId: { type: Types.ObjectId, required: true },
    userId: { type: Types.ObjectId, required: true },
    difficult: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    correct: { type: Number, default: 0 },
    fail: { type: Number, default: 0 },
    group: { type: Number, default: 0 },
    page: { type: Number, default: 0 }
  },
  { collection: 'userWords' }
);

module.exports = model('UserWords', UserWord);
