const { Schema, model, Types } = require('mongoose');
const { addMethods } = require('../../utils/toResponse');

const UserWordsSchema = new Schema(
  {
    wordId: { type: Types.ObjectId, required: true },
    userId: { type: Types.ObjectId, required: true },
    difficulty: { type: String, required: false },
    optional: {
      type: Object,
      required: false
    }
  },
  { collection: 'userWords' }
);

UserWordsSchema.index({ wordId: 1, userId: 1 }, { unique: true });

addMethods(UserWordsSchema);

module.exports = model('UserWords', UserWordsSchema);
