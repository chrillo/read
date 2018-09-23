require = require("esm")(module, { cjs: true })

const start = require('./src/app')
start(process.env.PORT || 8080)