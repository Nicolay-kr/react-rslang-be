function getStatsPerGame(arr, filterElem) {
  const initArr = arr;
  const game = filterElem;
  let longestSeries = 0;
  let correctPercent = 0;
  let wordsCount = 0;
  const filteredArray = initArr.filter(item => item.gameName === game);
  if (filteredArray.length) {
    longestSeries = Math.max.apply(
      null,
      filteredArray.map(item => item.longestSeries)
    );
    correctPercent = Math.round(
      filteredArray
        .map(elem => elem.correctPercent)
        .reduce((acc, val) => acc + val) / filteredArray.length
    );
    wordsCount = filteredArray
      .map(elem => elem.totalWords)
      .reduce((acc, val) => acc + val);
  }
  return { longestSeries, correctPercent, wordsCount };
}

function getCorrectPercentToday(arr, filterElem) {
  const initArr = arr;
  const date = filterElem;
  let correctPercentToday = 0;
  const filteredArray = initArr.filter(item => item.date === date);
  if (filteredArray.length) {
    correctPercentToday = Math.round(
      filteredArray
        .map(item => item.correctPercent)
        .reduce((acc, val) => acc + val) / filteredArray.length
    );
  }
  return `${correctPercentToday}%`;
}

function getLearnedWordsPerDate(arr) {
  const initArr = arr;
  const dates = [...new Set(initArr.map(item => item.date))];

  const allDates = dates.map(elem => {
    const filteredArr = initArr.filter(game => game.date === elem);
    return filteredArr;
  });

  const perDate = allDates.map(elem => {
    const date = elem.map(game => game.date)[0];
    const learnedWords = elem
      .map(game => game.totalWords)
      .reduce((acc, val) => acc + val);
    return { date, learnedWords };
  });

  return perDate;
}

function getLearnedWordsToday(arr, date) {
  const initArr = arr;
  const todayDate = date;
  let learnedWordsToday = 0;
  const filteredArray = initArr.filter(item => item.date === todayDate);
  if (filteredArray.length) {
    learnedWordsToday = filteredArray
      .map(item => item.totalWords)
      .reduce((acc, val) => acc + val);
  }
  return learnedWordsToday;
}

function getLearnedWordsTotal(data) {
  const amount = data.reduce((acc, value, i) => {
    if (i === 0) {
      acc.push({
        name: value.date,
        words: value.learnedWords
      });
    } else if (i > 0) {
      acc.push({
        name: value.date,
        words: value.learnedWords + acc[i - 1].words
      });
    }
    return acc;
  }, []);
  return amount;
}

module.exports = {
  getLearnedWordsTotal,
  getLearnedWordsToday,
  getLearnedWordsPerDate,
  getCorrectPercentToday,
  getStatsPerGame
};
