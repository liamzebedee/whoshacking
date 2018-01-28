var path = require('path');
var webpack = require('webpack');
const context = path.resolve(__dirname, 'src');


module.exports = {
  target: "electron",
  devtool: 'eval',
  entry: [
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        loaders: [
          'style-loader',
          'css-loader?importLoader=1&modules&localIdentName=[path]___[name]__[local]___[hash:base64:5]'
        ],
        test: /\.css$/
      },

      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: path.join(__dirname, './src'),
        query: {
          plugins: [
            'transform-react-jsx',
            [
              'react-css-modules',
              {
                context
              }
            ]
          ]
        },
      }
    ]
  }
};
