const router = require('express').Router({ mergeParams: true });
const UserWord = require('./userWord.model');
const Word = require('../words/word.model');
const { getMessage } = require('../../utils/wordsCount');

router.get('/', async (req, res) => {
  try {
    const userId = req.userId;
    const userWords = await UserWord.find({ userId });
    res.status(200).json({ userWords, message: 'Ваши слова доставлены' });
  } catch (e) {
    console.log('get user words', e);
    res.status(400).send(e);
  }
});

router.get('/dictionary', async (req, res) => {
  try {
    const userId = req.userId;
    const userWords = await UserWord.find({ userId });
    const dictionaryWords = await Promise.all(
      userWords.map(async item => {
        const ID = item.wordId;
        const correct = item.correct || 0;
        const fail = item.fail || 0;
        const deleted = item.deleted || false;
        const difficult = item.difficult || false;
        const word = await Word.findOne({ _id: ID });
        return {
          ...word._doc,
          fail,
          correct,
          deleted,
          difficult,
          wordId: ID,
          id: ID
        };
      })
    );
    // const idArr = userWords.map(item => {
    //   return item.wordId;
    // });
    // const testArr = await Word.find({ _id: { $in: [...idArr] } });
    res.status(200).json({
      dictionaryWords,
      message: 'Ваши слова доставлены'
    });
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
    console.log('get wordId', e);
    res.status(400).send(e);
  }
});

router.post('/:wordId', async (req, res) => {
  try {
    const userId = req.userId;
    const wordId = req.params.wordId;
    const wordBody = req.body;
    const wordEntity = await UserWord.findOne({ wordId, userId });
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
      allUserWords = await UserWord.find({ userId });
      res.status(200).json({ allUserWords, updatedWord, message: 'нашёл' });
    } else {
      const newUserWord = await UserWord.create({
        ...wordBody,
        userId,
        wordId
      });
      allUserWords = await UserWord.find({ userId });
      res.status(200).json({ allUserWords, newUserWord, message: 'создал' });
    }
  } catch (e) {
    console.log('user word id', e);
    res.status(400).send(e);
  }
});

router.delete('/:wordId', async (req, res) => {
  const wordId = req.params.wordId;
  const userId = req.userId;
  await UserWord.deleteOne({ wordId, userId });
  res.status(200).json({ message: 'Слово восстановлено' });
});

router.put('/answers', async (req, res) => {
  try {
    const userId = req.userId;
    const allAnswersArr = req.body.allAnswers;
    const correctAnswersArr = req.body.correctArr;
    const failAnswersArr = req.body.failArr;
    const result = await Promise.all(
      allAnswersArr.map(async item => {
        const wordId = item.id;
        const wordBody = {
          difficult: item.difficult,
          group: item.group,
          page: item.page,
          deleted: item.deleted
        };
        const wordEntity = await UserWord.findOne({ wordId, userId });
        if (wordEntity) {
          await UserWord.findOneAndUpdate(
            { wordId, userId },
            { $set: wordBody },
            { new: true }
          );
          return null;
        }
        const newUserWord = await UserWord.create({
          ...wordBody,
          userId,
          wordId
        });
        return newUserWord;
      })
    );
    const correctResult = await Promise.all(
      correctAnswersArr.map(async item => {
        const wordId = item.id;
        const updatedWord = await UserWord.findOneAndUpdate(
          { wordId, userId },
          { $inc: { correct: 1 } },
          { new: true }
        );
        return updatedWord;
      })
    );
    const failResult = await Promise.all(
      failAnswersArr.map(async item => {
        const wordId = item.id;
        const updatedWord = await UserWord.findOneAndUpdate(
          { wordId, userId },
          { $inc: { fail: 1 } },
          { new: true }
        );
        return updatedWord;
      })
    );
    const newWordsArr = result.filter(word => word !== null);
    const newWordsCount = newWordsArr.length;
    const message = getMessage(newWordsCount);
    res.status(200).json({
      correctResult,
      failResult,
      newWordsArr,
      newWordsCount,
      message
    });
  } catch (e) {
    console.log('update userWord', e);
    res.status(400).send(e);
  }
});

router.put('/:wordId', async (req, res) => {
  try {
    const userId = req.userId;
    const wordId = req.params.wordId;
    const value = req.body.value;
    let updatedWord = {};
    if (value) {
      updatedWord = await UserWord.findOneAndUpdate(
        { wordId, userId },
        { $inc: { correct: 1 } },
        { new: true }
      );
    } else {
      updatedWord = await UserWord.findOneAndUpdate(
        { wordId, userId },
        { $inc: { fail: 1 } },
        { new: true }
      );
    }
    res.status(200).json({ updatedWord, message: 'Слово обновилось' });
  } catch (e) {
    console.log('update userWord', e);
    res.status(400).send(e);
  }
});

module.exports = router;
