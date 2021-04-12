const router = require('express').Router({ mergeParams: true });
const UserWord = require('./userWord.model');

router.get('/', async (req, res) => {
  console.log('ID В ГЕТ ВОРДС', req.userId);
  try {
    const userId = req.userId;
    const userWords = await UserWord.find({ userId });
    res.status(200).json({ userWords, message: 'Ваши слова доставлены' });
  } catch (e) {
    console.log('get user words', e);
    res.status(400).send(e);
  }
});

router.get('/:wordId', async (req, res) => {
  try {
    const userId = req.userId;
    const wordId = req.params.wordId;
    const userWord = await UserWord.findOne({ wordId, userId });
    res.status(200).json({ userWord, message: 'Ваше слово доставлено' });
  } catch (e) {
    console.log('user word id', e);
    res.status(400).send(e);
  }
});

router.post('/:wordId', async (req, res) => {
  try {
    const userId = req.userId;
    const wordId = req.params.wordId;
    const wordBody = req.body;
    console.log(wordBody);
    console.log(userId);
    console.log(wordId);
    const wordEntity = await UserWord.findOne({ wordId, userId });
    console.log(wordEntity);
    let allUserWords = [];
    if (wordEntity) {
      const updatedWord = await UserWord.findOneAndUpdate(
        { wordId, userId },
        { $set: wordBody },
        { new: true }
      );
      if (!updatedWord) {
        res.status(400).json({ message: 'слово не смогло обновиться' });
      }
      allUserWords = UserWord.find({ userId });
      res.status(200).json({
        allUserWords,
        word: updatedWord,
        message: 'Слово обновилось'
      });
    }
    const newUserWord = await UserWord.create({ ...wordBody, userId, wordId });
    allUserWords = UserWord.find({ userId });
    let message = 'Слово добавлено в ваш словарь';
    if (
      wordBody &&
      wordBody.difficulty &&
      wordBody.difficulty === 'weak' &&
      wordBody.optional.deleted
    ) {
      message =
        'Слово удалено из книги, но вы можете его восстановить в вашем словаре ( вкладка "Удалённые слова" )';
    }
    res.status(200).json({
      newUserWord,
      allUserWords,
      message
    });
  } catch (e) {
    console.log('user word id', e);
    res.status(400).send(e);
  }
});

// router.put('/:wordId', async (req, res) => {
//   try {
//     const userId = req.userId;
//     const wordId = req.params.wordId;
//     const userWord = req.body;
//     console.log(req.body);
//     const updatedWord = await UserWord.findOneAndUpdate(
//       { wordId, userId },
//       { $set: userWord },
//       { new: true }
//     );
//     if (!updatedWord) {
//       res.status(400).json({ message: 'слово не смогло обновиться' });
//     }
//     res.status(200).send({ updatedWord, message: 'Слово обновилось' });
//   } catch (e) {
//     console.log('update userWord', e);
//     res.status(400).send(e);
//   }
// });

router.delete('/:wordId', async (req, res) => {
  const wordId = req.params.wordId;
  const userId = req.userId;
  await UserWord.deleteOne({ wordId, userId });
  res.status(200).json({ message: 'Слово восстановлено' });
});

module.exports = router;
