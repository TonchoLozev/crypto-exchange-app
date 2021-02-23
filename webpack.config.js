const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.(png|jp(e*)g|svg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'images/[hash]-[name].[ext]',
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src', 'index.html'),
        }),
    ],
    devServer: {
        historyApiFallback: true,
        proxy: {
            '/api/v3/*': {
                target: 'https://api.binance.com',
                secure: false,
                changeOrigin: true,
            },
            '/ticker/*': {
                target: 'https://api-pub.bitfinex.com/v2',
                secure: false,
                changeOrigin: true,
            },
            '/market/*': {
                target: 'https://api.huobi.pro',
                secure: false,
                changeOrigin: true,
            },
            '/0/public/*': {
                target: 'https://api.kraken.com',
                secure: false,
                changeOrigin: true,
            },
        },
    },
    devtool: 'source-map',
};
