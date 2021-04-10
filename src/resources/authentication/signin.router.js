const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const User = require('../users/user.model');
const tokenService = require('../token/token.service');

router.route('/').post(
  [
    check('email', 'Пожалуйста, введите корректно свой email')
      .normalizeEmail()
      .isEmail(),
    check('password', 'Введите свой пароль').exists()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.json({
          errors: errors.array(),
          message: 'Некорректно введены данные'
        });
      }

      const { email, password } = req.body;
      console.log(req.body);
      const user = await User.findOne({ email });
      console.log(user);
      if (!user) {
        return res.json({ message: 'Такого пользователя не существует' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.json({ message: 'Неправильно введён пароль' });
      }

      const tokens = await tokenService.getTokens(user._id);

      console.log(user.avatarURL);
      res.json({
        ...tokens,
        userId: user.id,
        name: user.name,
        avatarURL: user.avatarURL
      });
    } catch (e) {
      console.log('signin', e);
      res.json({ message: 'При входе что-то пошло не так:(' });
    }
  }
);

module.exports = router;
