let env = 'dev'

if (process.env.NODE_ENV === 'production') {
  env = 'prod'
}

let store = require(`./configure.${env}`)

module.exports = store