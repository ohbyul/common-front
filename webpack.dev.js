const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')
const config =  {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        publicPath: '/',
    },
    devServer: {
        static: {
            directory: path.join(__dirname, '/public'),
          },
        historyApiFallback: true,
        compress: true,
        open: true,
        port: 8000,
        // host: 'https://be-common-5ce913bbd3df.herokuapp.com/',
        host: 'localhost',
        proxy: {
            '/api': 'https://be-common-5ce913bbd3df.herokuapp.com:3000/',
        }
    },
}

module.exports = merge(common, config)
