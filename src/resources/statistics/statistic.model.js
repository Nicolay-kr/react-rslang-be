const { Schema, model, Types } = require('mongoose');
const { addMethods } = require('../../utils/toResponse');

const StatisticSchema = new Schema(
  {
    owner: { type: Types.ObjectId, ref: 'User' },
    games: [
      {
        gameName: { type: String },
        totalWords: { type: Number },
        correctPercent: { type: Number },
        longestSeries: { type: Number },
        date: { type: String }
      }
    ]
  },
  { collection: 'statistic' }
);

addMethods(StatisticSchema);

module.exports = model('Statistic', StatisticSchema);
