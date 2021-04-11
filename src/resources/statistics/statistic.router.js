const router = require('express').Router();
const Statistics = require('./statistic.model');
const {
  getLearnedWordsTotal,
  getLearnedWordsToday,
  getLearnedWordsPerDate,
  getCorrectPercentToday,
  getStatsPerGame
} = require('../../utils/statsFunctions');

router.get('/', async (req, res) => {
  try {
    const ID = req.userId;

    const statistics = await Statistics.findOne({ owner: ID });

    const allGames = statistics.games;
    const todayDate = new Date().toLocaleDateString();

    const savannaGameStats = getStatsPerGame(allGames, 'savanna');

    const matchGameStats = getStatsPerGame(allGames, 'match');

    const sprintGameStats = getStatsPerGame(allGames, 'sprint');

    const audioGameStats = getStatsPerGame(allGames, 'audio');

    const percentToday = getCorrectPercentToday(allGames, `${todayDate}`);

    const learnedWordsPerDate = getLearnedWordsPerDate(allGames);

    const learnedWordsToday = getLearnedWordsToday(allGames, `${todayDate}`);

    const learnedWordsTotal = getLearnedWordsTotal(learnedWordsPerDate);

    const parsedStats = {
      learnedWordsTotal,
      learnedWordsToday,
      learnedWordsPerDate,
      percentToday,
      savannaGameStats,
      matchGameStats,
      sprintGameStats,
      audioGameStats
    };
    res.status(200).json({
      message: 'Ваша статистика готова',
      statistics,
      parsedStats
    });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.put('/', async (req, res) => {
  try {
    const ID = req.userId;
    const game = req.body;

    await Statistics.findOneAndUpdate(
      { owner: ID },
      { $push: { games: game } },
      { upsert: true }
    );
    res.status(200).json({ message: 'Статистика обновлена' });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

module.exports = router;
