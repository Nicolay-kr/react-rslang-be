const { OK, NO_CONTENT } = require('http-status-codes');
const router = require('express').Router({ mergeParams: true });

const userWordService = require('./userWord.service');

router.get('/', async (req, res) => {
  const userWords = await userWordService.getAll(req.userId);
  res.status(OK).send(userWords.map(w => w.toResponse()));
});

router.get('/:wordId', async (req, res) => {
  const word = await userWordService.get(req.params.wordId, req.userId);
  res.status(OK).send(word.toResponse());
});

router.post('/:wordId', async (req, res) => {
  const word = await userWordService.save(
    req.params.wordId,
    req.userId,
    req.body
  );
  res.status(OK).send(word.toResponse());
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
