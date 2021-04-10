const { OK, NO_CONTENT } = require('http-status-codes');
const router = require('express').Router({ mergeParams: true });
const UserWord = require('./userWord.model');
const userWordService = require('./userWord.service');

router.get('/', async (req, res) => {
  console.log('ID В ГЕТ ВОРДС', req.userId);
  try {
    const userId = req.userId;
    const userWords = await UserWord.find({ userId });
    res.json(userWords);
  } catch (e) {
    console.log('get user words', e);
    res.json({ message: 'Что-то пошло не так :(' });
  }
});

router.get('/:wordId', async (req, res) => {
  try {
    const userId = req.userId;
    const wordId = req.params.wordId;
    const userWord = await UserWord.findOne({ wordId, userId });
    res.json(userWord);
  } catch (e) {
    console.log('user word id', e);
  }
});

router.post('/:wordId', async (req, res) => {
  console.log(req.body);
  console.log('ID пользователя в создании слова', req.userId);
  console.log('ID слова в создании слова', req.params.wordId);
  const userId = req.userId;
  const wordId = req.params.wordId;
  const body = req.body;
  const exist = await UserWord.findOne({ wordId, userId });
  if (exist) {
    res.json({ message: 'Слово уже лежит где нужно' });
  }
  const userWord = await UserWord.create({ ...body, userId, wordId });
  res.json(userWord);
});

router.put('/:wordId', async (req, res) => {
  const word = await userWordService.update(
    req.params.wordId,
    req.userId,
    req.body
  );
  res.status(OK).send(word.toResponse());
});

router.delete('/:wordId', async (req, res) => {
  await userWordService.remove(req.params.wordId, req.userId);
  res.sendStatus(NO_CONTENT);
});

module.exports = router;
