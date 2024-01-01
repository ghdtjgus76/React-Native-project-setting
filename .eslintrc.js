module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    'react/react-in-jsx-scope': 0,
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
};
