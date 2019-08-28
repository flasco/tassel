module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        extensions: ['.js'],
        alias: {
          '@api': './src/api',
          '@assets': './src/assets',
          '@components': './src/components',
          '@screen': './src/screen',
          '@config': './src/config',
          '@models': './src/models',
          '@util': './src/util',
        },
      },
    ],
  ],
};
