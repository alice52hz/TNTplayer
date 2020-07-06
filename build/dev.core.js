let { config, runDevServer } = require('./dev.base')

delete config.entry.player

runDevServer(config)