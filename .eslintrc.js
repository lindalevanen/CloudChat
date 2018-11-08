module.exports = {
  parser: "babel-eslint",
  extends: "airbnb",
  plugins: ["react", "react-native"],
  rules: {
    "react/jsx-filename-extension": [
      1,
      {
        extensions: [".js", ".jsx"]
      }
    ],
    "react/prop-types": 1,
    "import/prefer-default-export": 0
  },
  env: {
    browser: true
  }
};
