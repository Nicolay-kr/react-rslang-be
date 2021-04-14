const jwt = require('jsonwebtoken');
const {
  JWT_SECRET_KEY,
  JWT_REFRESH_SECRET_KEY
} = require('../../common/config');
// const { AUTHORIZATION_ERROR } = require('../../errors/appErrors');

const ALLOWED_PATHS = ['/signin', '/signup'];
const DOC_PATH_REGEX = /^\/doc\/?$/;
const DOC_PATH_RESOURCES_REGEX = /^\/doc\/.+$/;
const WORDS_PATH_REGEX = /^\/words.*$/;
const USERS_PATH = '/users';

function isOpenPath(path) {
  return (
    ALLOWED_PATHS.includes(path) ||
    DOC_PATH_REGEX.test(path) ||
    DOC_PATH_RESOURCES_REGEX.test(path) ||
    WORDS_PATH_REGEX.test(path)
  );
}

const checkAuthentication = (req, res, next) => {
  // console.log(req.body);
  if (isOpenPath(req.path)) {
    return next();
  }
  // console.log(req.method);
  if (req.path === USERS_PATH && req.method === 'POST') {
    return next();
  }
  const rawToken = req.headers.authorization;
  // console.log('1', rawToken);
  if (!rawToken) {
    res
      .status(400)
      .json({ message: 'Пожалуйста, зайдите / перезайдите в свой аккаунт' });
  }
  // console.log('2', rawToken);
  try {
    const token = rawToken.slice(7, rawToken.length);
    console.log(req.path.includes('tokens'));
    const secret = req.path.includes('tokens')
      ? JWT_REFRESH_SECRET_KEY
      : JWT_SECRET_KEY;
    console.log('secret', secret);
    const { id, tokenId } = jwt.verify(token, secret);
    console.log('id', id);
    console.log('tokenId', tokenId);
    req.userId = id;
    req.tokenId = tokenId;
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Пожалуйста, зайдите / перезайдите в свой аккаунт' });
  }

  next();
};

module.exports = checkAuthentication;
