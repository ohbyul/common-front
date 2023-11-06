const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv')
const isProd = process.env.NODE_ENV === 'production'

dotenv.config();

const config = {
    resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src/"),
			"@components": path.resolve(__dirname, "./src/views/components/"),
		},
	},
    entry: {
        index: path.resolve(__dirname, 'src/index.js')
    },
   
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: [path.resolve(__dirname, 'node_modules')],
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
            {
                test: /\.(jpg|jpeg|gif|png|svg)$/i,
                use: {
                  loader: 'file-loader',
                  options: {
                    name: '[name].[ext]',
                    outputPath: 'images',
                  }
                }
              },
        
              {
                test: /\.(eot|ttf|woff|woff2)$/,
                use: {
                  loader: 'file-loader',
                  options: {
                    name: '[name].[ext]',
                    outputPath: 'fonts',
                  }
                }
              },
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                    {from: 'public/favicon.ico', to:'.'},
                    {from: 'src/assets/images', to:'images'},
                ]
            }),
        new CleanWebpackPlugin({cleanAfterEveryBuildPatterns: ['public']}),
        new HtmlWebpackPlugin({
            minify: isProd
                ? true
                : {
                    collapseWhitespace: true,
                    removeComments: true,
                    useShortDoctype: true,
                    minifyCSS: true,
                },
            template: './public/index.html',
            title: 'common',
            description: `common`
        }),
        new webpack.DefinePlugin({ 'process.env': JSON.stringify(process.env)})
    ]
};

module.exports = config
