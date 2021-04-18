function getMessage(count) {
  const number = +count;
  let message;
  switch (number) {
    case 0:
      message = 'Все слова из игры уже у вас есть';
      break;
    case 1:
      message = `${number} новое слово уже в вашем словаре`;
      break;
    case 2:
    case 3:
    case 4:
      message = `${number} новых слова уже в вашем словаре`;
      break;
    default:
      message = `${number} новых слов уже в вашем словаре`;
      break;
  }
  return message;
}

module.exports = {
  getMessage
};
