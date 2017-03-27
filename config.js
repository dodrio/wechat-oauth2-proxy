const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  proxy: envAssert(process.env.PROXY),
  listen: {
    host: process.env.LISTEN_HOST || '0.0.0.0',
    port: +process.env.LISTEN_PORT || 3000
  }
}

function envAssert (env) {
  if (env === 'true') {
    return true
  } else {
    return false
  }
}
