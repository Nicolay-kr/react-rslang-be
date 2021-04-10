const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const User = require('./user.model');
// const MONGO_ENTITY_EXISTS_ERROR_CODE = 11000;
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

router.post(
  '/',
  [
    check('email', 'Incorrect Email').isEmail(),
    check('password', 'Min password length is 6 characters').isLength({
      min: 6
    })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректно введены данные, попробуйте снова'
        });
      }
      const { email, password, name } = req.body;

      const candidate = await User.findOne({ email });

      if (candidate) {
        return res
          .status(400)
          .json({ message: 'Извините, такой email занят :(' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ email, password: hashedPassword, name });

      await user.save();
      res.status(201).json({ message: 'Вы успешно зарегистрировались)' });
    } catch (e) {
      console.log('register', e);
      res.status(500).json({ message: 'Беда с регистрацией' });
    }
  }
);

router.get('/:id', async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  if (!user) {
    res.json({ message: 'Пользователь с таким ID не найден' });
  }
  res.send(user.toResponse());
});

router.put('/:id', async (req, res) => {
  const ID = req.params.id;
  console.log(ID);
  // console.log(req);
  console.log('body', req.body);
  console.log('req body files', req.body.files);
  console.log('formData', req.formData);
  console.log('file', req.file);
  console.log('files', req.files);
  console.log('avatar', req.avatar);

  try {
    // const result = await cloudinary.uploader.upload(
    //   req.files.avatar.tempFilePath,
    //   { upload_preset: 'avatarPreset' }
    // );
    // const avatarURL = result.url;
    // const user = await User.findByIdAndUpdate(ID, {
    //   avatarURL: result.url,
    //   new: true
    // });
    // const user = User.findById({ ID });
    // console.log(user);
    // res.json({ user });
  } catch (e) {
    console.log(e);
    res.send(e);
  }
  // const userEntity = await userService.update(req.userId, req.body);
  // res.send(userEntity.toResponse());
  res.json({ message: 'Всё отлично с загрузкой фото' });
});

// router.delete('/:id', async (req, res) => {
//   await userService.remove(req.params.id);
//   res.json({ message: 'норм' });
// });

module.exports = router;
