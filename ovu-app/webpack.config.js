const { merge } = require('webpack-merge');

module.exports = (config) => {
  return merge(config, {
    ignoreWarnings: [
      /The glob pattern import\("\.\/\*\*\/\*\.entry\.js\*"\) did not match any files/
    ]
  });
};
