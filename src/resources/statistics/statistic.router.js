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

    const todayDate = new Date().toLocaleDateString();
    let parsedStats = null;
    if (!statistics) {
      res.status(200).json({
        message: 'Ваша статистика готова',
        parsedStats
      });
    }

    const allGames = statistics.games;

    const savannaGameStats = getStatsPerGame(allGames, 'savanna', 'Саванна');

    const matchGameStats = getStatsPerGame(
      allGames,
      'match',
      'Отгадай картинку'
    );

    const sprintGameStats = getStatsPerGame(allGames, 'sprint', 'Спринт');

    const audioGameStats = getStatsPerGame(allGames, 'audio', 'Аудиовызов');

    const percentToday = getCorrectPercentToday(allGames, `${todayDate}`);

    const learnedWordsPerDate = getLearnedWordsPerDate(allGames);

    const learnedWordsToday = getLearnedWordsToday(allGames, `${todayDate}`);

    const learnedWordsTotal = getLearnedWordsTotal(learnedWordsPerDate);

    parsedStats = {
      todayDate,
      learnedWordsTotal,
      learnedWordsToday,
      learnedWordsPerDate,
      percentToday,
      games: [savannaGameStats, matchGameStats, sprintGameStats, audioGameStats]
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
