let { config, runDevServer } = require('./dev.base')

delete config.entry.core

runDevServer(config)