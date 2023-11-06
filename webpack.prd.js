const WebpackObfuscator = require('webpack-obfuscator')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path');
const config = {
    mode: 'production',
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name]-[hash].js',
        chunkFilename: 'chunk-[chunkhash].js',
        publicPath: '/',
    },
    plugins: [
        new WebpackObfuscator ({
            "rotateStringArray": true
        }),
    ]
}

module.exports = merge(common, config)
