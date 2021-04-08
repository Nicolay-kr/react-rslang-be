// const { BAD_REQUEST, UNPROCESSABLE_ENTITY } = require('http-status-codes');

// const errorResponse = errors => {
//   return {
//     status: 'failed',
//     errors: errors.map(err => {
//       const { path, message } = err;
//       return { path, message };
//     })
//   };
// };

const validator = (schema, property) => {
  // console.log(schema);
  // console.log(property);
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);
    console.log('zalupa', error);
    if (error) {
      res.json(
        property === 'body'
          ? { message: 'Не валидное бади' }
          : { message: 'плохой запрос' }
      );
      // .json({ error: errorResponse(error.details) });
    } else {
      return next();
    }
  };
};

const userIdValidator = (req, res, next) => {
  console.log(req.userId);
  console.log(req.params.id);
  if (req.userId !== req.params.id) {
    res.json({ message: 'Вы не авторизованы' });
  } else {
    return next();
  }
};

module.exports = { validator, userIdValidator };
