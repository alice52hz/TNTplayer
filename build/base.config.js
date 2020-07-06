const path = require('path')
const webpack = require('webpack')

function getPath(p) {
    return path.resolve(__dirname, '../src/' + p)
}

module.exports = {
    entry: {
        player: getPath('platform/index.js'),
        core: getPath('core/index.js')
    },
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: 'player.min.js',
        libraryTarget: 'umd',
        library: 'Player',
        libraryExport: "default",
        umdNamedDefine: true
    },
    plugins: [
        new webpack.DefinePlugin({
            TARGET_PLATFORM: JSON.stringify(process.env.PLATFORM)
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve('src')
        }  
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.less$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }, {
                    loader: "less-loader"
                }]
            }
        ]
    }
}