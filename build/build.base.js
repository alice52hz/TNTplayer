const webpack = require('webpack')
const baseConfig = require('./base.config')

const config = Object.assign(baseConfig, {
    mode: 'production'
})

config.output.filename = `[name].${process.env.PLATFORM}.min.js`

function build(config) {
    webpack(config, (err, stats) => {
        if (err) {
            console.error(err.stack || err)
            if (err.details) {
                console.error(err.details)
            }
            return
        }
    
        if (stats.hasErrors()) {
            console.error(stats.toJson().errors)
        }
    
        //  handle end
        console.log('build complele')
    })
}

module.exports = {
    build,
    config
}