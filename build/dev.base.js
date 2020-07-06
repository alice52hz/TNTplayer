const path = require('path')
const webpack = require('webpack')
const webpackDevServer = require('webpack-dev-server')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseConfig = require('./base.config')

const config = Object.assign(baseConfig, {
    mode: 'development',
    devtool: 'inline-source-map'
})

config.plugins.push(new HtmlWebpackPlugin({
    filename: 'index.html',
    template: './dev/player.html'
}))

function runDevServer(config) {
    const options = {
        open: true,
        contentBase: path.resolve(__dirname, "../dist"),
        host: 'localhost'
    }
    
    webpackDevServer.addDevServerEntrypoints(config, options)
    const compiler = webpack(config)
    const server = new webpackDevServer(compiler, options)
    
    server.listen(8000, 'localhost', () => {
        console.log('server is running at port 8000')
    })
}

module.exports = {
    config,
    runDevServer
}