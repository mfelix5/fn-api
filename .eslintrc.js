module.exports = { 
  "extends": "airbnb-base",
  "rules": {
    "quotes": 0,
    "no-unused-vars": [1, {"vars": "local", "args": "none"}],
    "max-len": [1, 120, 2, {ignoreComments: true}],
    "arrow-body-style": 0,
    "consistent-return": 0,
  }
};