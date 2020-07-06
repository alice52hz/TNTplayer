const { config, build } = require('./build.base')
const uglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin')

config.output.filename = `[name].${process.env.PLATFORM}.js`
config.optimization = {
    minimizer: [
        new uglifyjsWebpackPlugin({
            chunkFilter: chunk => {
                return false
            }
        })
    ]
}

build(config)
