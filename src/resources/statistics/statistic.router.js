const { Router } = require('express');
const Statistics = require('./statistic.model');
const router = Router();
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
    res.json({
      message: 'Ваша статистика с охуенного бэка готова',
      statistics,
      parsedStats
    });
  } catch (e) {
    console.log(e);
  }
});

// validator(statistics, 'body'),.send(statistic.toResponse()
router.put('/', async (req, res) => {
  try {
    const ID = req.userId;
    const game = req.body;
    console.log('ID', ID);
    console.log(req.body);

    const statistics = await Statistics.findOneAndUpdate(
      { owner: ID },
      { $push: { games: game } },
      { upsert: true, new: true }
    );
    console.log(statistics);
    // const statistic = await statisticService.upsert(ID, req.body);
    res.json({ message: 'Статистика обновлена' });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
