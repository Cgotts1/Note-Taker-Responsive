module.exports = () =>                             // Gives note a random id
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);